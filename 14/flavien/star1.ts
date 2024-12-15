
function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

const input = (await Bun.file("input.txt").text()).split("\n").map(line => {
    const match = line.matchAll(/p=(?<pX>\d+),(?<pY>\d+) v=(?<vX>\-*\d+),(?<vY>\-*\d+)/g);
    const { pX, pY, vX, vY } = [...match][0].groups as { pX: string, pY: string, vX: string, vY: string };

    return {
        pX: Number(pX),
        pY: Number(pY),
        vX: Number(vX),
        vY: Number(vY),
    };
}).map(({ pX, pY, vX, vY }) => {

    const N_SECONDS = 100;

    return {
        pX: mod(pX + vX * N_SECONDS, MAP_WIDTH),
        pY: mod(pY + vY * N_SECONDS, MAP_HEIGHT)
    };
}).reduce<{ NE: { pX: number, pY: number }[], SE: { pX: number, pY: number }[], SW: { pX: number, pY: number }[], NW: { pX: number, pY: number }[] }>((acc, botPosition) => {

    const accCopy = { ...acc }

    if (isInNWQuadrant(botPosition)) accCopy.NW.push(botPosition)
    if (isInNEQuadrant(botPosition)) accCopy.NE.push(botPosition)
    if (isInSWQuadrant(botPosition)) accCopy.SW.push(botPosition)
    if (isInSEQuadrant(botPosition)) accCopy.SE.push(botPosition)

    return accCopy

}, { NE: [], SE: [], SW: [], NW: [] });

console.log(Object.values(input).reduce((acc, value) => {
    return acc * value.length
}, 1));

function isInNWQuadrant({ pX, pY }: { pX: number, pY: number }) {
    return pX >= 0 && pY >= 0 && pX < Math.floor(MAP_WIDTH / 2) && pY < Math.floor(MAP_HEIGHT / 2)
}
function isInNEQuadrant({ pX, pY }: { pX: number, pY: number }) {
    return pX > Math.floor(MAP_WIDTH / 2) && pY >= 0 && pX < MAP_WIDTH && pY < Math.floor(MAP_HEIGHT / 2)
}

function isInSWQuadrant({ pX, pY }: { pX: number, pY: number }) {
    return pX >= 0 && pY > Math.floor(MAP_HEIGHT / 2) && pX < Math.floor(MAP_WIDTH / 2) && pY < MAP_HEIGHT
}
function isInSEQuadrant({ pX, pY }: { pX: number, pY: number }) {
    return pX > Math.floor(MAP_WIDTH / 2) && pY > Math.floor(MAP_HEIGHT / 2) && pX < MAP_WIDTH && pY < MAP_HEIGHT
}