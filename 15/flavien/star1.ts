const [map, instructions] = (await Bun.file("input.txt").text()).split("\n\n")
const parsedInstructions = instructions.split("").filter(isValidInstruction);

const parsedMap = map.split("\n").map(line => line.split(""))
const MAP_HEIGHT = parsedMap.length;
const MAP_WIDTH = parsedMap[0].length;
const mapAsMap = new Map();

const robotPosition = { x: -1, y: -1 }

// Initialize Map and Robot
for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
        if (parsedMap[y][x] !== ".") {
            mapAsMap.set(`${x},${y}`, parsedMap[y][x]);
        }
        if (parsedMap[y][x] === "@") {
            robotPosition.x = x;
            robotPosition.y = y;
        }
    }
}

// function draw() {
//     for (let y = 0; y < MAP_HEIGHT; y++) {
//         const line = [];
//         for (let x = 0; x < MAP_WIDTH; x++) {
//             line.push(mapAsMap.get(`${x},${y}`) ?? ".")
//         }
//         console.log(line.join(""));
//     }
//     console.log("");
// }

// console.log(`Initial state:`);
// draw();

// typeguard for instruction
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

function getNextFreeSpot({ x, y }: { x: number; y: number }, direction: "^" | "v" | ">" | "<") {
    const { dx, dy } = instructionToVector(direction);

    const nextPositon = {
        x: x + dx,
        y: y + dy
    }

    const nextTile = mapAsMap.get(`${nextPositon.x},${nextPositon.y}`);
    if (nextTile === "#") return undefined;
    if (nextTile === "O") return getNextFreeSpot(nextPositon, direction);

    return nextPositon;
}

do {
    let currentInstruction = parsedInstructions.shift()
    if (!currentInstruction || !isValidInstruction(currentInstruction)) break;

    // console.log(`Move ${currentInstruction}:`);

    const nextFreeSpot = getNextFreeSpot(robotPosition, currentInstruction);
    if (nextFreeSpot) {
        const { dx, dy } = instructionToVector(currentInstruction);
        const { x: freeX, y: freeY } = nextFreeSpot;
        const nextRobotPosition = {
            x: robotPosition.x + dx,
            y: robotPosition.y + dy
        }

        // Direct move
        if (nextRobotPosition.x === freeX && nextRobotPosition.y === freeY) {
            mapAsMap.delete(`${robotPosition.x},${robotPosition.y}`);
            robotPosition.x = freeX;
            robotPosition.y = freeY;
        } else {
            // Push crates
            mapAsMap.delete(`${robotPosition.x},${robotPosition.y}`);
            mapAsMap.set(`${freeX},${freeY}`, "O");
            robotPosition.x = nextRobotPosition.x;
            robotPosition.y = nextRobotPosition.y;
        }
        mapAsMap.set(`${robotPosition.x},${robotPosition.y}`, "@");
    }

    // draw();

} while (parsedInstructions.length > 0)

console.log(Array.from(mapAsMap.entries()).reduce((acc, [key, value]) => {
    if (value !== "O") return acc
    const [x, y] = key.split(",").map(Number);
    return acc + (100 * y) + x
}, 0));