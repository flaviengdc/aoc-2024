function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

const input = (await Bun.file("input.txt").text()).split("\n").map(line => {
    const match = line.matchAll(/p=(?<pX>\d+),(?<pY>\d+) v=(?<vX>\-*\d+),(?<vY>\-*\d+)/g)
    const { pX, pY, vX, vY } = [...match][0].groups as { pX: string, pY: string, vX: string, vY: string }

    return {
        pX: Number(pX),
        pY: Number(pY),
        vX: Number(vX),
        vY: Number(vY),
    }
})

let tick = 0;
let patternDetected = false
while (!patternDetected) {
    const botSet = new Set(input.map(({ pX, pY }) => `${pX},${pY}`))

    const detectPattern = [...botSet.values()].some(bot => {
        const [x, y] = bot.split(",").map(Number);
        const ROW_HEIGHT = 10;
        let foundPattern = true;
        for (let i = 0; i < ROW_HEIGHT; i++) {
            foundPattern = foundPattern && botSet.has(`${x + i},${y}`)
        }
        return foundPattern
    })

    function draw() {
        console.log(tick);
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const line = [];
            for (let x = 0; x < MAP_WIDTH; x++) {

                if (botSet.has(`${x},${y}`)) {
                    line.push("#")
                } else {
                    line.push(".")
                }
            }

            console.log(line.join(""));
        }
    }

    if (detectPattern) {
        // draw()
        // console.log("\n")
        patternDetected = true
        console.log(tick)
    }

    function updateBots() {
        for (const bot of input) {
            bot.pX = mod(bot.pX + bot.vX, MAP_WIDTH);
            bot.pY = mod(bot.pY + bot.vY, MAP_HEIGHT);
        }
        tick++;
    }
    updateBots()
}
