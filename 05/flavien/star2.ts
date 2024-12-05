function compareArrays<T>(a: T[], b: T[]) {
  return a.every((element, index) => b[index] === element);
}

const input = await Bun.file("input.txt").text();

const [unparsedOrderingRules, unparsedUpdates] = input.split("\n\n");

const orderingRules = unparsedOrderingRules
  .split("\n")
  .map((orderingRule) => orderingRule.split("|"));

const updates = unparsedUpdates.split("\n").map((update) => update.split(","));

const result = updates.reduce((acc, update) => {
  const sortedUpdate = update.toSorted((a, b) => {
    const rulesToCheck = orderingRules.find((orderingRule) => {
      return orderingRule.includes(a) && orderingRule.includes(b);
    });

    if (rulesToCheck) return rulesToCheck.indexOf(a) - rulesToCheck.indexOf(b);

    return 0;
  });

  if (!compareArrays(sortedUpdate, update)) {
    const middlePageNumber = sortedUpdate[Math.floor(sortedUpdate.length / 2)];
    return acc + Number(middlePageNumber);
  }

  return acc;
}, 0);

console.log(result);
