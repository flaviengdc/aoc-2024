const [map, instructions] = (await Bun.file("input.txt").text()).split("\n\n")
const parsedInstructions = instructions.split("").filter(isValidInstruction);

const parsedMap = map.split("\n").map(line => line.split(""))
const MAP_HEIGHT = parsedMap.length;
const MAP_WIDTH = parsedMap[0].length;
// const MAP_EXTENDED_WIDTH = MAP_WIDTH * 2
const mapAsMap = new Map();

const robotPosition = { x: -1, y: -1 }

// Initialize Map and Robot
for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
        if (parsedMap[y][x] === "#") {
            mapAsMap.set(`${2 * x},${y}`, parsedMap[y][x]);
            mapAsMap.set(`${2 * x + 1},${y}`, parsedMap[y][x]);
        }
        if (parsedMap[y][x] === "O") {
            mapAsMap.set(`${2 * x},${y}`, "[");
            mapAsMap.set(`${2 * x + 1},${y}`, "]");
        }
        if (parsedMap[y][x] === "@") {
            mapAsMap.set(`${2 * x},${y}`, "@");
            robotPosition.x = 2 * x;
            robotPosition.y = y;
        }
    }
}

function isValidInstruction(instruction: string): instruction is "^" | "v" | ">" | "<" {
    return instruction === "^" || instruction === "v" || instruction === ">" || instruction === "<";
}

function instructionToVector(instruction: "^" | "v" | ">" | "<") {
    switch (instruction) {
        case "^":
            return { dx: 0, dy: -1 };
        case "v":
            return { dx: 0, dy: 1 };
        case ">":
            return { dx: 1, dy: 0 };
        case "<":
            return { dx: -1, dy: 0 };
    }
}

// function draw() {
//     for (let y = 0; y < MAP_HEIGHT; y++) {
//         const line = [];
//         for (let x = 0; x < MAP_EXTENDED_WIDTH; x++) {
//             line.push(mapAsMap.get(`${x},${y}`) ?? ".")
//         }
//         console.log(line.join(""));
//     }
//     console.log("");
// }

// console.log(`Initial state:`);
// draw();

do {
    let currentInstruction = parsedInstructions.shift()
    if (!currentInstruction || !isValidInstruction(currentInstruction)) break;

    // console.log(`Move ${currentInstruction}:`);

    const { dx, dy } = instructionToVector(currentInstruction);
    const nextRobotPosition = {
        x: robotPosition.x + dx,
        y: robotPosition.y + dy
    }
    const nextTile = mapAsMap.get(`${nextRobotPosition.x},${nextRobotPosition.y}`);

    if (nextTile === "#") {
        // draw();
        continue;
    }

    if (nextTile === "[" || nextTile === "]") {
        pushCrate({ x: nextRobotPosition.x, y: nextRobotPosition.y }, currentInstruction);
    }

    if (!mapAsMap.get(`${nextRobotPosition.x},${nextRobotPosition.y}`)) {
        const newRobotPosition = moveRobot(robotPosition, nextRobotPosition);
        robotPosition.x = newRobotPosition.x;
        robotPosition.y = newRobotPosition.y;
        // draw();
        continue;
    }

    // draw();
} while (parsedInstructions.length > 0)

function canPushCrate({ x, y }: { x: number; y: number }, instruction: "^" | "v" | ">" | "<"): boolean {
    const { dx, dy } = instructionToVector(instruction);

    // Normalize crate position
    const cratePosition = normalizeCratePosition({ x, y });

    if (instruction === '<') {
        const next = {
            x: cratePosition.x + dx,
            y: cratePosition.y + dy
        }

        if (mapAsMap.get(`${next.x},${next.y}`) === "#") return false;
        if (!mapAsMap.get(`${next.x},${next.y}`)) return true;

        return canPushCrate(next, instruction);
    }

    if (instruction === '>') {
        const next = {
            x: cratePosition.x + 2 * dx,
            y: cratePosition.y + dy
        }

        if (mapAsMap.get(`${next.x},${next.y}`) === "#") return false;
        if (!mapAsMap.get(`${next.x},${next.y}`)) return true;

        return canPushCrate(next, instruction);
    }

    const next = {
        x: cratePosition.x + dx,
        y: cratePosition.y + dy
    }

    const leftIsPossible = !(mapAsMap.get(`${next.x},${next.y}`) === "#") && (!mapAsMap.has(`${next.x},${next.y}`) || canPushCrate(next, instruction));

    if (mapAsMap.get(`${next.x + 1},${next.y}`) === "#") return false;
    if (!mapAsMap.get(`${next.x + 1},${next.y}`) || normalizeCratePosition(next).x === normalizeCratePosition({ x: next.x + 1, y: next.y }).x) return leftIsPossible;

    return leftIsPossible && canPushCrate({ x: next.x + 1, y: next.y }, instruction);
}

function pushCrate({ x, y }: { x: number; y: number }, instruction: "^" | "v" | ">" | "<") {

    if (!canPushCrate({ x, y }, instruction)) return;

    const { dx, dy } = instructionToVector(instruction);
    const cratePosition = normalizeCratePosition({ x, y });

    if (instruction === '<') {
        const next = {
            x: cratePosition.x + dx,
            y: cratePosition.y + dy
        }

        if (mapAsMap.get(`${next.x},${next.y}`) === "]") pushCrate(next, instruction);
        moveCrate(cratePosition, next);
        return;
    }

    if (instruction === '>') {
        const next = {
            x: cratePosition.x + 2 * dx,
            y: cratePosition.y + dy
        }

        if (mapAsMap.get(`${next.x},${next.y}`) === "[") pushCrate(next, instruction);
        moveCrate(cratePosition, { x: cratePosition.x + dx, y: next.y });
        return;
    }


    const next = {
        x: cratePosition.x + dx,
        y: cratePosition.y + dy
    }

    if (["[", "]"].includes(mapAsMap.get(`${next.x},${next.y}`))) pushCrate(next, instruction);
    if (mapAsMap.get(`${next.x + 1},${next.y}`) === "[") pushCrate({ x: next.x + 1, y: next.y }, instruction);

    moveCrate(cratePosition, next);
}

function moveRobot(from: { x: number, y: number }, to: { x: number, y: number }) {
    mapAsMap.delete(`${from.x},${from.y}`);
    mapAsMap.set(`${to.x},${to.y}`, "@");
    return to;
}

function moveCrate(from: { x: number, y: number }, to: { x: number, y: number }) {
    mapAsMap.delete(`${from.x},${from.y}`);
    mapAsMap.delete(`${from.x + 1},${from.y}`);
    mapAsMap.set(`${to.x},${to.y}`, "[");
    mapAsMap.set(`${to.x + 1},${to.y}`, "]");
}

function normalizeCratePosition({ x, y }: { x: number; y: number }) {
    const cratePosition = {
        x: mapAsMap.get(`${x},${y}`) === "[" ? x : x - 1,
        y: y
    }
    return cratePosition;
}

console.log(Array.from(mapAsMap.entries()).reduce((acc, [key, value]) => {
    if (value !== "[") return acc
    const [x, y] = key.split(",").map(Number);
    return acc + (100 * y) + x
}, 0));