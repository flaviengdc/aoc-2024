const input = (await Bun.file("input.txt").text()).split(" ");

function blink(stones: string[]) {
  const newStones: string[] = [];

  stones.forEach((stone, index) => {
    if (stone === "0") {
      newStones.push("1");
    } else if (stone.length % 2 === 0) {
      newStones.push(removeLeading0(stone.slice(0, stone.length / 2)));
      newStones.push(removeLeading0(stone.slice(stone.length / 2)));
    } else {
      newStones.push(`${Number(stone) * 2024}`);
    }
  });

  return newStones;
}

function removeLeading0(stone: string) {
  return `${Number(stone)}`;
}

let output = input;
for (let i = 0; i < 25; i++) {
  output = blink(output);
}

console.log(output.length);
