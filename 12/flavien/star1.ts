const input = (await Bun.file("input.txt").text())
  .split("\n")
  .map((line) => line.split(""));

const inputAsMapOriginal: Partial<Record<string, string>> = {};

input.forEach((row, y) => {
  row.forEach((col, x) => {
    inputAsMapOriginal[`${x},${y}`] = col;
  });
});

// console.log(inputAsMap);

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

while (Object.entries(inputAsMapCopy).length > 0) {
  const firstItem = Object.entries(inputAsMapCopy)[0];
  const [x, y] = firstItem[0].split(",").map(Number);
  const region = findRegion(inputAsMapCopy, x, y);

  const perimeter = Object.entries(region).reduce((acc, [key, value]) => {
    const [x, y] = key.split(",").map(Number);
    let oldAcc = acc;

    const north = isInMap({ x, y: y - 1 });
    const east = isInMap({ x: x + 1, y });
    const south = isInMap({ x, y: y + 1 });
    const west = isInMap({ x: x - 1, y });

    if (!north || input[north.y][north.x] !== value) oldAcc++;
    if (!south || input[south.y][south.x] !== value) oldAcc++;
    if (!east || input[east.y][east.x] !== value) oldAcc++;
    if (!west || input[west.y][west.x] !== value) oldAcc++;

    return oldAcc;
  }, 0);

  totalPrice += perimeter * Object.keys(region).length;
}

console.log(totalPrice);
