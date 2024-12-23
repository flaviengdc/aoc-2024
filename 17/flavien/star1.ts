const input = await Bun.file("input.txt").text();

const matches = input.matchAll(/Register A: (?<registerA>\d+)\nRegister B: (?<registerB>\d+)\nRegister C: (?<registerC>\d+)\n\nProgram: (?<program>(\d+(,)?)*)/g)
const groups = [...matches][0].groups

let registerA = Number(groups!.registerA)
let registerB = Number(groups!.registerB)
let registerC = Number(groups!.registerC)
const program = groups!.program.split(",").map(Number)

let opCodeCursor = 0
let operandCursor = opCodeCursor + 1
let output = []

type ThreeBitsNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

const getComboOperand = (comboOperand: ThreeBitsNumber) => {
    switch (comboOperand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return comboOperand
        case 4:
            return registerA
        case 5:
            return registerB
        case 6:
            return registerC
        case 7:
            throw new Error("Shit happened")
    }
}

while (opCodeCursor < program.length) {
    let opCode = program[opCodeCursor]
    operandCursor = opCodeCursor + 1
    let operand = program[operandCursor] as ThreeBitsNumber

    switch (opCode) {
        case 0:
            // ADV
            registerA = Math.floor(registerA / Math.pow(2, getComboOperand(operand)))

            opCodeCursor += 2
            break;
        case 1:
            // BXL
            registerB = registerB ^ operand

            opCodeCursor += 2
            break;
        case 2:
            // BST
            registerB = mod(getComboOperand(operand), 8)

            opCodeCursor += 2
            break;
        case 3:
            // JNZ
            if (registerA !== 0) {
                opCodeCursor = operand
            } else {
                opCodeCursor += 2
            }

            break;
        case 4:
            // BXC
            registerB = registerB ^ registerC

            opCodeCursor += 2
            break;
        case 5:
            // OUT
            output.push(mod(getComboOperand(operand), 8))

            opCodeCursor += 2
            break;
        case 6:
            // BDV
            registerB = Math.floor(registerA / Math.pow(2, getComboOperand(operand)))

            opCodeCursor += 2
            break;
        case 7:
            // CDV
            registerC = Math.floor(registerA / Math.pow(2, getComboOperand(operand)))

            opCodeCursor += 2
            break;
    }
}

console.log(output.join(','))