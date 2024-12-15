const input = (await Bun.file("input.txt").text())
  .split("\n")
  .map((line) => line.split(""));

const inputAsMapOriginal: Partial<Record<string, string>> = {};

input.forEach((row, y) => {
  row.forEach((col, x) => {
    inputAsMapOriginal[`${x},${y}`] = col;
  });
});

function isInMap({ x, y }: { x: number; y: number }) {
  if (x >= 0 && y >= 0 && y < input.length && x < input[0].length)
    return { x, y };
  return undefined;
}

function findRegion(
  inputAsMap: Partial<Record<string, string>>,
  x: number,
  y: number,
  regionFromParent?: Partial<Record<string, string>>
) {
  const inputAsMapCopy = inputAsMap;
  const region: Partial<Record<string, string>> = regionFromParent
    ? regionFromParent
    : {};
  const currentPlot = inputAsMapCopy[`${x},${y}`];
  region[`${x},${y}`] = currentPlot;
  delete inputAsMapCopy[`${x},${y}`];

  const north = isInMap({ x, y: y - 1 });
  const east = isInMap({ x: x + 1, y });
  const south = isInMap({ x, y: y + 1 });
  const west = isInMap({ x: x - 1, y });

  if (checkDirection(north, currentPlot!, region)) {
    findRegion(inputAsMapCopy, north!.x, north!.y, region);
  }
  if (checkDirection(south, currentPlot!, region)) {
    findRegion(inputAsMapCopy, south!.x, south!.y, region);
  }
  if (checkDirection(east, currentPlot!, region)) {
    findRegion(inputAsMapCopy, east!.x, east!.y, region);
  }
  if (checkDirection(west, currentPlot!, region)) {
    findRegion(inputAsMapCopy, west!.x, west!.y, region);
  }

  return region;
}

function checkDirection(
  direction: { x: number; y: number } | undefined,
  currentPlot: string,
  region: Partial<Record<string, string>>
) {
  if (!direction) return false;
  if (input[direction.y][direction.x] !== currentPlot) return false;
  if (region[`${direction.x},${direction.y}`]) return false;
  return true;
}

const inputAsMapCopy = { ...inputAsMapOriginal };

let totalPrice = 0;

function isNWOutwardCorner({ x, y }: { x: number, y: number }) {
  if (!isInMap({ x, y })) return false
  const currentPlot = inputAsMapOriginal[`${x},${y}`]

  const north = isInMap({ x, y: y - 1 });
  const west = isInMap({ x: x - 1, y });

  if (north && inputAsMapOriginal[`${north.x},${north.y}`] === currentPlot) return false
  if (west && inputAsMapOriginal[`${west.x},${west.y}`] === currentPlot) return false

  return true;
}

function isNEOutwardCorner({ x, y }: { x: number, y: number }) {
  if (!isInMap({ x, y })) return false
  const currentPlot = inputAsMapOriginal[`${x},${y}`]

  const north = isInMap({ x, y: y - 1 });
  const east = isInMap({ x: x + 1, y });

  if (north && inputAsMapOriginal[`${north.x},${north.y}`] === currentPlot) return false
  if (east && inputAsMapOriginal[`${east.x},${east.y}`] === currentPlot) return false

  return true;
}

function isSWOutwardCorner({ x, y }: { x: number, y: number }) {
  if (!isInMap({ x, y })) return false
  const currentPlot = inputAsMapOriginal[`${x},${y}`]

  const south = isInMap({ x, y: y + 1 });
  const west = isInMap({ x: x - 1, y });

  if (south && inputAsMapOriginal[`${south.x},${south.y}`] === currentPlot) return false
  if (west && inputAsMapOriginal[`${west.x},${west.y}`] === currentPlot) return false

  return true;
}

function isSEOutwardCorner({ x, y }: { x: number, y: number }) {
  if (!isInMap({ x, y })) return false
  const currentPlot = inputAsMapOriginal[`${x},${y}`]

  const south = isInMap({ x, y: y + 1 });
  const east = isInMap({ x: x + 1, y });

  if (south && inputAsMapOriginal[`${south.x},${south.y}`] === currentPlot) return false
  if (east && inputAsMapOriginal[`${east.x},${east.y}`] === currentPlot) return false

  return true;
}

function isNWInwardCorner({ x, y }: { x: number, y: number }) {
  const north = isInMap({ x, y: y - 1 });
  const west = isInMap({ x: x - 1, y: y });
  const northWest = isInMap({ x: x - 1, y: y - 1 });
  const currentPlot = inputAsMapOriginal[`${x},${y}`]
  if (north && inputAsMapOriginal[`${north.x},${north.y}`] === currentPlot &&
    west && inputAsMapOriginal[`${west.x},${west.y}`] === currentPlot &&
    northWest && inputAsMapOriginal[`${northWest.x},${northWest.y}`] !== currentPlot
  ) return true;

  return false;
}

function isNEInwardCorner({ x, y }: { x: number, y: number }) {
  const north = isInMap({ x, y: y - 1 });
  const east = isInMap({ x: x + 1, y: y });
  const northEast = isInMap({ x: x + 1, y: y - 1 });
  const currentPlot = inputAsMapOriginal[`${x},${y}`]
  if (north && inputAsMapOriginal[`${north.x},${north.y}`] === currentPlot &&
    east && inputAsMapOriginal[`${east.x},${east.y}`] === currentPlot &&
    northEast && inputAsMapOriginal[`${northEast.x},${northEast.y}`] !== currentPlot
  ) return true;

  return false;
}
function isSEInwardCorner({ x, y }: { x: number, y: number }) {
  const south = isInMap({ x, y: y + 1 });
  const east = isInMap({ x: x + 1, y: y });
  const southEast = isInMap({ x: x + 1, y: y + 1 });
  const currentPlot = inputAsMapOriginal[`${x},${y}`]
  if (south && inputAsMapOriginal[`${south.x},${south.y}`] === currentPlot &&
    east && inputAsMapOriginal[`${east.x},${east.y}`] === currentPlot &&
    southEast && inputAsMapOriginal[`${southEast.x},${southEast.y}`] !== currentPlot
  ) return true;

  return false;
}
function isSWInwardCorner({ x, y }: { x: number, y: number }) {
  const south = isInMap({ x, y: y + 1 });
  const west = isInMap({ x: x - 1, y: y });
  const southWest = isInMap({ x: x - 1, y: y + 1 });
  const currentPlot = inputAsMapOriginal[`${x},${y}`]
  if (south && inputAsMapOriginal[`${south.x},${south.y}`] === currentPlot &&
    west && inputAsMapOriginal[`${west.x},${west.y}`] === currentPlot &&
    southWest && inputAsMapOriginal[`${southWest.x},${southWest.y}`] !== currentPlot
  ) return true;

  return false;
}

while (Object.entries(inputAsMapCopy).length > 0) {
  const firstItem = Object.entries(inputAsMapCopy)[0];
  const [x, y] = firstItem[0].split(",").map(Number);
  const region = findRegion(inputAsMapCopy, x, y);

  const perimeter = Object.entries(region).reduce((acc, [key, value]) => {
    const [x, y] = key.split(",").map(Number);
    let oldAcc = acc;

    if (isNWOutwardCorner({ x, y })) oldAcc++;
    if (isNEOutwardCorner({ x, y })) oldAcc++;
    if (isSEOutwardCorner({ x, y })) oldAcc++;
    if (isSWOutwardCorner({ x, y })) oldAcc++;

    if (isNWInwardCorner({ x, y })) oldAcc++;
    if (isNEInwardCorner({ x, y })) oldAcc++;
    if (isSEInwardCorner({ x, y })) oldAcc++;
    if (isSWInwardCorner({ x, y })) oldAcc++;

    return oldAcc;
  }, 0);

  totalPrice += perimeter * Object.keys(region).length;
}

console.log(totalPrice);


