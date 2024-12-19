interface Point {
    x: number;
    y: number;
}

interface State {
    point: Point;
    direction: number;
    cost: number;
}

class PriorityQueue<T> {
    private queue: [number, T, number][] = []; // Added index for stable sort
    private index: number = 0;

    push(cost: number, item: T) {
        this.queue.push([cost, item, this.index++]);
        this.queue.sort((a, b) => a[0] === b[0] ? a[2] - b[2] : a[0] - b[0]);
    }

    pop(): T | undefined {
        return this.queue.shift()?.[1];
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

class MazeSolver {
    private maze: string[][] = [];
    private start: Point = { x: 0, y: 0 };
    private end: Point = { x: 0, y: 0 };
    private readonly DIRECTIONS = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // E,S,W,N
    private readonly TURN_COST = 1000;

    constructor(input: string) {
        this.parseMaze(input);
    }

    private parseMaze(input: string) {
        this.maze = input.split('\n').map(line => line.split(''));
        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[i].length; j++) {
                if (this.maze[i][j] === 'S') this.start = { x: i, y: j };
                if (this.maze[i][j] === 'E') this.end = { x: i, y: j };
            }
        }
    }

    private getKey(point: Point, direction: number): string {
        return `${point.x},${point.y},${direction}`;
    }

    findShortestPaths(): Set<string> {
        const distances = new Map<string, number>();
        const previous = new Map<string, Set<string>>();
        const queue = new PriorityQueue<State>();
        const pathTiles = new Set<string>();

        // Initialize with starting state (facing East)
        const initialState: State = { point: this.start, direction: 0, cost: 0 };
        const initialKey = this.getKey(this.start, 0);

        queue.push(0, initialState);
        distances.set(initialKey, 0);
        previous.set(initialKey, new Set());

        while (!queue.isEmpty()) {
            const current = queue.pop()!;
            const currentKey = this.getKey(current.point, current.direction);
            const currentDist = distances.get(currentKey)!;

            for (let newDir = 0; newDir < 4; newDir++) {
                const [dx, dy] = this.DIRECTIONS[newDir];
                const newX = current.point.x + dx;
                const newY = current.point.y + dy;

                if (newX >= 0 && newX < this.maze.length &&
                    newY >= 0 && newY < this.maze[0].length &&
                    this.maze[newX][newY] !== '#') {

                    const turnCost = current.direction !== newDir ?
                        Math.min((newDir - current.direction + 4) % 4,
                            (current.direction - newDir + 4) % 4) * this.TURN_COST : 0;

                    const newPoint = { x: newX, y: newY };
                    const newKey = this.getKey(newPoint, newDir);
                    const newDist = currentDist + turnCost + 1;

                    if (!distances.has(newKey) || newDist <= distances.get(newKey)!) {
                        if (newDist === distances.get(newKey)) {
                            previous.get(newKey)!.add(currentKey);
                        } else {
                            distances.set(newKey, newDist);
                            previous.set(newKey, new Set([currentKey]));
                            queue.push(newDist, { point: newPoint, direction: newDir, cost: newDist });
                        }
                    }
                }
            }
        }

        // Find all end states with minimum distance
        let minDist = Infinity;
        const endStates = new Set<string>();

        for (let dir = 0; dir < 4; dir++) {
            const key = this.getKey(this.end, dir);
            const dist = distances.get(key);
            if (dist !== undefined) {
                if (dist < minDist) {
                    minDist = dist;
                    endStates.clear();
                    endStates.add(key);
                } else if (dist === minDist) {
                    endStates.add(key);
                }
            }
        }

        // Reconstruct all paths using DFS
        const visited = new Set<string>();
        const reconstructPath = (state: string) => {
            if (visited.has(state)) return;
            visited.add(state);

            const [x, y] = state.split(',').map(Number);
            pathTiles.add(`${x},${y}`);

            const prevStates = previous.get(state);
            if (prevStates) {
                for (const prevState of prevStates) {
                    reconstructPath(prevState);
                }
            }
        };

        for (const endState of endStates) {
            reconstructPath(endState);
        }

        return pathTiles;
    }
}

// Usage
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const solver = new MazeSolver(input);
const paths = solver.findShortestPaths();
console.log(`Number of tiles in shortest paths: ${paths.size}`);
console.log('Path coordinates:', [...paths].sort());
