const input = await Bun.file("input.txt").text();

function canEquationBeTrue(testValue: number, numbers: number[]): boolean {
    const numbersCopy = [...numbers]
    
    if(numbersCopy.length === 1) {
        return numbersCopy[0] === testValue
    }
    
    const lastNumber = numbersCopy.pop()
    if(lastNumber === undefined) {
        throw new Error("Shit happened")
    }

    const plusCase = canEquationBeTrue(testValue - lastNumber, numbersCopy);
    const timesCase = canEquationBeTrue(testValue / lastNumber, numbersCopy);

    const indexOfLastSubstring = `${lastNumber}`.length * -1
    const endOfStringTestValue = `${testValue}`.slice(indexOfLastSubstring)
    const concatCase = canEquationBeTrue(Number(`${testValue}`.slice(0, indexOfLastSubstring)), numbersCopy) && endOfStringTestValue === `${lastNumber}`;

    return plusCase || timesCase || concatCase
}

console.time()
console.log(input.split("\n").reduce((acc, line) => {
    const [testValueRaw, numbersRaw] = line.split(": ")
    const testValue = Number(testValueRaw)
    const numbers = numbersRaw.split(" ").map(Number)

    return acc + (canEquationBeTrue(testValue, numbers) ? testValue : 0)
}, 0));
console.timeEnd()