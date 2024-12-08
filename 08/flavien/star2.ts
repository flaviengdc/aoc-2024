const input = await Bun.file("input.txt").text();

const city = input.split("\n").map((line) => line.split(""));

const antennas: Partial<Record<string, Array<{x: number, y: number}>>> = {};

city.forEach((row, y) => {
    row.forEach((col, x) => {
        if(col !== ".") {
            antennas[col] = antennas[col] ? [...antennas[col], {x,y}] : [{x, y}];
        }
    });
});

const antinodeLocations = new Set();

function isInCity({x, y}: {x: number, y: number}) {
    return y >= 0 && x >= 0 && y < city.length && x < city[0].length;
}

for(const [, positions] of Object.entries(antennas)) {
    if(!positions) continue;

    for(let i=0; i<positions.length; i++) {
        for(let j=i+1; j<positions.length; j++) {
            const firstPosition = positions[i];
            antinodeLocations.add(`${firstPosition.x},${firstPosition.y}`);

            const secondPosition = positions[j];
            antinodeLocations.add(`${secondPosition.x},${secondPosition.y}`);

            const difference = {
                x: secondPosition.x - firstPosition.x,
                y: secondPosition.y - firstPosition.y
            };

            let nextAntinode = {x: secondPosition.x + difference.x, y: secondPosition.y + difference.y}
            while(isInCity(nextAntinode)) {
               antinodeLocations.add(`${nextAntinode.x},${nextAntinode.y}`);
               nextAntinode = {x: nextAntinode.x + difference.x, y: nextAntinode.y + difference.y} 
            }

            let previousAntinode = {x: firstPosition.x - difference.x, y: firstPosition.y - difference.y}
            while(isInCity(previousAntinode)) {
                antinodeLocations.add(`${previousAntinode.x},${previousAntinode.y}`);
                previousAntinode = {x: previousAntinode.x - difference.x, y: previousAntinode.y - difference.y} 
            }
        }
    }
}

console.log(antinodeLocations.size)