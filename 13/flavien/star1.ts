const input = (await Bun.file("input.txt").text()).split("\n\n").map(configAndLocation => {

    const [ButtonA, ButtonB, Prize] = configAndLocation.split("\n");

    const matchA = ButtonA.matchAll(/Button A: X\+(?<AX>\d+), Y\+(?<AY>\d+)/g)
    const { AX, AY } = [...matchA][0].groups as { AX: string, AY: string }

    const matchB = ButtonB.matchAll(/Button B: X\+(?<BX>\d+), Y\+(?<BY>\d+)/g)
    const { BX, BY } = [...matchB][0].groups as { BX: string, BY: string }

    const matchPrize = Prize.matchAll(/Prize: X=(?<PX>\d+), Y=(?<PY>\d+)/g)
    const { PX, PY } = [...matchPrize][0].groups as { PX: string, PY: string }

    /**
        PX = A*AX + B*BX
        PX - B*BX = A*AX
        (PX - B*BX) / AX = A

        PY = A*AY + B*BY
        PY = ((PX - B*BX) / AX) * AY + B*BY
        (((PX - B*BX) / AX) * AY + B*BY) - PY = 0
    */

    const nPX = Number(PX)
    const nPY = Number(PY)
    const nAX = Number(AX)
    const nAY = Number(AY)
    const nBX = Number(BX)
    const nBY = Number(BY)

    let B = 0;

    while (((((nPX - B * nBX) / nAX) * nAY + B * nBY) - nPY) !== 0 && B <= 100) {
        B++;
    }

    /*
        PX = A*AX + B*BX
        PX - B*BX = A*AX
        (PX - B*BX) / AX = A
    */
    const A = (nPX - B * nBX) / nAX

    if (A < 0 || A > 100 || A !== Math.floor(A) || B !== Math.floor(B)) {
        return 0
    }

    return 3 * A + B
}).reduce((acc, value) => acc + value, 0);

console.log(input)