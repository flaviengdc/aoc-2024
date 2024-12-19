const input = (await Bun.file("input.txt").text()).split("\n").map(line => line.split(""));

// Initialize Map
const inputAsMap = new Map();
const START = { x: - 1, y: - 1 };
const TARGET = { x: - 1, y: - 1 };

for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        if (input[y][x] !== "#") {
            inputAsMap.set(`${x},${y}`, input[y][x]);
        }
        if (input[y][x] === "S") {
            START.x = x;
            START.y = y;
        }
        if (input[y][x] === "E") {
            TARGET.x = x;
            TARGET.y = y;
        }
    }
}

function getNeighboors({ x, y }: { x: number, y: number }) {
    const neighboors = []
    if (inputAsMap.has(`${x},${y - 1}`)) neighboors.push({ x, y: y - 1 });
    if (inputAsMap.has(`${x},${y + 1}`)) neighboors.push({ x, y: y + 1 });
    if (inputAsMap.has(`${x - 1},${y}`)) neighboors.push({ x: x - 1, y });
    if (inputAsMap.has(`${x + 1},${y}`)) neighboors.push({ x: x + 1, y });

    return neighboors;
}

type Position = {
    x: number,
    y: number
}

function comparePosition(a: Position, b: Position) {
    return a.x === b.x && a.y === b.y;
}

type Node = {
    position: Position,
    parent: Node | null,
    direction: "NORTH" | "SOUTH" | "WEST" | "EAST" | null,
    g: number,
    h: number,
    f: number
}

function heuristic(a: Position, b: Position) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getDirection(start: Position, target: Position) {
    if (target.x < start.x) return "WEST";
    if (target.x > start.x) return "EAST";
    if (target.y < start.y) return "NORTH";
    if (target.y > start.y) return "SOUTH";
    return null
}

const cache = new Map();

function aStar(start: Position, target: Position, overrideStartdirection?: "NORTH" | "SOUTH" | "WEST" | "EAST" | null): { path: Position[], totalCost: number, lastDirection: "NORTH" | "SOUTH" | "WEST" | "EAST" | null } {

    if (cache.has(JSON.stringify([start, target, overrideStartdirection]))) {
        return cache.get(JSON.stringify([start, target, overrideStartdirection]))!
    }

    const openList: Node[] = []; // To evaluate
    const closedList: Node[] = []; // Evaluated

    const START_NODE: Node = {
        position: start,
        direction: overrideStartdirection ?? "EAST",
        parent: null,
        g: 0,
        h: heuristic(start, target),
        f: 0 + heuristic(start, target)
    }

    const TARGET_NODE: Node = {
        position: target,
        direction: null,
        parent: null,
        g: 0,
        h: 0,
        f: 0
    }

    openList.push(START_NODE);

    while (openList.length > 0) {
        // Sort by f-score
        openList.sort((a, b) => a.f - b.f);

        // Pick best f-score
        const currentNode: Node = openList.shift()!;

        // Target reached
        if (comparePosition(currentNode.position, TARGET_NODE.position)) {

            // Rewind the path
            const path: Position[] = [];
            let lastNode = currentNode;
            while (lastNode.parent) {
                path.unshift(lastNode.position);
                lastNode = lastNode.parent;
            }

            cache.set(JSON.stringify([start, target, overrideStartdirection]), { path, totalCost: currentNode.g, lastDirection: currentNode.direction });

            return { path, totalCost: currentNode.g, lastDirection: currentNode.direction };
        }

        // Mark as evaluated
        closedList.push(currentNode);

        // Look for neighboors
        const neighboors = getNeighboors(currentNode.position);

        // For each neighboor compute scores
        for (const neighboor of neighboors) {

            const direction = getDirection(currentNode.position, neighboor);
            const movementCost = direction === currentNode.direction ? 1 : 1001;

            const neighboorNode: Node = {
                position: neighboor,
                parent: currentNode,
                direction: direction,
                g: currentNode.g + movementCost,
                h: heuristic(neighboor, TARGET_NODE.position),
                f: 0
            }
            neighboorNode.f = neighboorNode.g + neighboorNode.h;

            // Skip if we already evaluated it
            if (closedList.find(node => comparePosition(node.position, neighboorNode.position))) {
                continue;
            }

            const openNode = openList.find(node => comparePosition(node.position, neighboorNode.position));
            if (!openNode || neighboorNode.f < openNode.f) {
                // Not in open list or better path
                openList.push(neighboorNode);
            }
        }
    }

    return { path: [], totalCost: 0, lastDirection: null };
}

const minTotalCost = aStar(START, TARGET).totalCost
const shortestPathTiles = new Set();
const shortestPathTilesToCheck = [START];
const alreadyCheckedTiles = new Set();

while (shortestPathTilesToCheck.length > 0) {
    const currentTile = shortestPathTilesToCheck.shift()!;
    shortestPathTiles.add(`${currentTile.x},${currentTile.y}`);

    if (alreadyCheckedTiles.has(`${currentTile.x},${currentTile.y}`)) {
        continue;
    } else {
        alreadyCheckedTiles.add(`${currentTile.x},${currentTile.y}`);
    }

    if (currentTile.x === TARGET.x && currentTile.y === TARGET.y) {
        continue;
    }

    const neighboors = getNeighboors(currentTile);

    for (const neighboor of neighboors) {
        const { totalCost: firstTier, lastDirection: firstTierDirection } = aStar(START, { x: currentTile.x, y: currentTile.y });
        const { totalCost: secondTier, lastDirection: secondTierDirection } = aStar({ x: currentTile.x, y: currentTile.y, }, { x: neighboor.x, y: neighboor.y }, firstTierDirection);
        const { totalCost: lastTier } = aStar({ x: neighboor.x, y: neighboor.y }, TARGET, secondTierDirection);

        if (firstTier + secondTier + lastTier <= minTotalCost && !shortestPathTiles.has(`${neighboor.x},${neighboor.y}`)) {
            shortestPathTilesToCheck.push(neighboor);
        }
    }
}
console.log(shortestPathTiles.size)