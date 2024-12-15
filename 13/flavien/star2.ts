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
        PY = ((PX - B*BX) / AX)*AY + B*BY
        PY = (PX/AX - B*BX/AX)*AY + B*BY
        PY = PX/AX*AY - B*BX/AX*AY + B*BY
        PY = PX/AX*AY - B * (BX/AX*AY - BY)
        PY + B * (BX/AX*AY - BY) = PX/AX*AY
        B * (BX/AX*AY - BY) = PX/AX*AY - PY
        B = (PX/AX*AY - PY) / (BX/AX*AY - BY)
    */

    const nPX = Number(PX) + 10_000_000_000_000
    const nPY = Number(PY) + 10_000_000_000_000
    const nAX = Number(AX)
    const nAY = Number(AY)
    const nBX = Number(BX)
    const nBY = Number(BY)

    const B = Math.round((nPX/nAX*nAY - nPY) / (nBX/nAX*nAY - nBY))
    const A = Math.round((nPX - B * nBX) / nAX)
    
    
    if (A < 0) { return 0 }
    if (B < 0) { return 0 }
    if(A*nAX + B*nBX !== nPX) { return 0 }
    if(A*nAY + B*nBY !== nPY) { return 0 }
    
    return 3 * Math.round(A) + Math.round(B)
}).reduce((acc, value) => acc + value, 0);

console.log(input)