const input = (await Bun.file("input.txt").text()).split(" ");

const stonesOccurence: Partial<Record<string, number>> = {};

input.forEach((item) => {
  stonesOccurence[item] = stonesOccurence[item] ? stonesOccurence[item] + 1 : 1;
});

function blink(stonesOccurence: Partial<Record<string, number>>) {
  const newStonesOccurence: Partial<Record<string, number>> = {};

  for (const [stone, occurence] of Object.entries(stonesOccurence)) {
    if (!occurence) continue;
    if (stone === "0") {
      newStonesOccurence["1"] = newStonesOccurence["1"]
        ? newStonesOccurence["1"] + occurence
        : occurence;
    } else if (stone.length % 2 === 0) {
      const firstHalf = removeLeading0(stone.slice(0, stone.length / 2));
      const secondHalf = removeLeading0(stone.slice(stone.length / 2));

      newStonesOccurence[firstHalf] = newStonesOccurence[firstHalf]
        ? newStonesOccurence[firstHalf] + occurence
        : occurence;
      newStonesOccurence[secondHalf] = newStonesOccurence[secondHalf]
        ? newStonesOccurence[secondHalf] + occurence
        : occurence;
    } else {
      const newStone = `${Number(stone) * 2024}`;
      newStonesOccurence[newStone] = newStonesOccurence[newStone]
        ? newStonesOccurence[newStone] + occurence
        : occurence;
    }
  }

  return newStonesOccurence;
}

function removeLeading0(stone: string) {
  return `${Number(stone)}`;
}

let output = stonesOccurence;
for (let i = 0; i < 75; i++) {
  output = blink(output);
}

console.log(Object.values(output).reduce((acc, value) => acc! + value!, 0));
