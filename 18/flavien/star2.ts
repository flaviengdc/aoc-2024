type Position = {
    x: number;
    y: number;
}

type Node = {
    position: Position;
    parent: Node | null;
    g: number;
    h: number;
    f: number;
}

const input = (await Bun.file("input.txt").text()).split("\n");

const MEMORY_SIZE = 70 + 1;

function isInMemory({ x, y }: Position) {
    if (x < 0) return false;
    if (y < 0) return false;
    if (x >= MEMORY_SIZE) return false;
    if (y >= MEMORY_SIZE) return false;
    return true
}

function heuristic(a: Position, b: Position) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function isReachable(step: number) {
    const inputAsSet = new Set();

    let iBytes = 0;
    while (iBytes < step) {
        inputAsSet.add(input[iBytes]);
        iBytes++;
    }

    const north = ({ x, y }: Position) => {
        const north = { x, y: y - 1 };
        if (!isInMemory(north)) return undefined
        if (inputAsSet.has(`${north.x},${north.y}`)) return undefined;
        return north;
    }

    const south = ({ x, y }: Position) => {
        const south = { x, y: y + 1 };
        if (!isInMemory(south)) return undefined
        if (inputAsSet.has(`${south.x},${south.y}`)) return undefined;
        return south;
    }

    const west = ({ x, y }: Position) => {
        const west = { x: x - 1, y };
        if (!isInMemory(west)) return undefined
        if (inputAsSet.has(`${west.x},${west.y}`)) return undefined;
        return west;
    }

    const east = ({ x, y }: Position) => {
        const east = { x: x + 1, y };
        if (!isInMemory(east)) return undefined
        if (inputAsSet.has(`${east.x},${east.y}`)) return undefined;
        return east;
    }

    const START_NODE: Node = {
        position: { x: 0, y: 0 },
        parent: null,
        g: Infinity,
        h: 0,
        f: Infinity
    }

    const TARGET_NODE: Node = {
        position: { x: MEMORY_SIZE - 1, y: MEMORY_SIZE - 1 },
        parent: null,
        g: 0,
        h: 0,
        f: 0
    }

    START_NODE.g = 0;
    START_NODE.h = heuristic(START_NODE.position, TARGET_NODE.position);
    START_NODE.f = START_NODE.g + START_NODE.h;

    const nodesToCheck = [START_NODE];
    const nodesChecked = new Set();

    const shortestPathSet = new Set();

    while (nodesToCheck.length > 0) {
        // Sort by f-score, then g-score
        nodesToCheck.sort((a, b) => a.f !== b.f ? a.f - b.f : b.g - a.g);

        // Pick best f-score
        const currentNode: Node = nodesToCheck.shift()!;

        if (currentNode.position.x === TARGET_NODE.position.x && currentNode.position.y === TARGET_NODE.position.y) {
            // Found the shortest path
            let lastNode = currentNode;

            while (lastNode.parent) {
                shortestPathSet.add(`${lastNode.position.x},${lastNode.position.y}`);
                lastNode = lastNode.parent;
            }

            return true
        }

        // Add current node to checked
        nodesChecked.add(`${currentNode.position.x},${currentNode.position.y}`);

        // Add neighbors to check
        const neighbors = [];

        if (north(currentNode.position)) neighbors.push(north(currentNode.position)!);
        if (south(currentNode.position)) neighbors.push(south(currentNode.position)!);
        if (west(currentNode.position)) neighbors.push(west(currentNode.position)!);
        if (east(currentNode.position)) neighbors.push(east(currentNode.position)!);

        for (const neighbor of neighbors) {
            const neighborNode: Node = {
                position: neighbor,
                parent: currentNode,
                g: currentNode.g + 1,
                h: heuristic(neighbor, TARGET_NODE.position),
                f: currentNode.g + 1 + heuristic(neighbor, TARGET_NODE.position),
            };

            if (nodesChecked.has(`${neighborNode.position.x},${neighborNode.position.y}`)) { continue; }

            const alreadyInLine = nodesToCheck.find(node => node.position.x === neighborNode.position.x && node.position.y === neighborNode.position.y);
            if (!alreadyInLine || neighborNode.f < alreadyInLine.f) {
                nodesToCheck.push(neighborNode);
            }
        }
    }

    return false
}

const TOTAL_STEPS = input.length;

let minCursor = 0;
let maxCursor = TOTAL_STEPS - 1;

let middleCursor = Math.floor((minCursor + maxCursor) / 2);

while (isReachable(middleCursor) === isReachable(middleCursor + 1)) {
    if (isReachable(middleCursor)) {
        minCursor = middleCursor;
    } else {
        maxCursor = middleCursor;
    }
    middleCursor = Math.floor((minCursor + maxCursor) / 2);
}

console.log(input[middleCursor])