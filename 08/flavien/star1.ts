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
            const secondPosition = positions[j];

            const difference = {
                x: secondPosition.x - firstPosition.x,
                y: secondPosition.y - firstPosition.y
            };

            const firstAntinode = {
                x: secondPosition.x + difference.x,
                y: secondPosition.y + difference.y
            };

            const secondAntinode = {
                x: firstPosition.x - difference.x,
                y: firstPosition.y - difference.y
            };
            
            if(isInCity(firstAntinode)) antinodeLocations.add(`${firstAntinode.x},${firstAntinode.y}`);
            if(isInCity(secondAntinode)) antinodeLocations.add(`${secondAntinode.x},${secondAntinode.y}`);
        }
    }
}

console.log(antinodeLocations.size)