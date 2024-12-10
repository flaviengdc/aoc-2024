const topologyMap = (await Bun.file("input.txt").text()).split("\n").map(line => line.split("").map(Number));

const trailHeads = topologyMap.reduce<{ x: number, y: number }[]>((accR, row, y) => {
    return [...accR, ...row.reduce<{ x: number, y: number }[]>((accC, col, x) => {
        if (col === 0) return [...accC, { x, y }]
        return accC
    }, [])]
}, [])

function isInMap({ x, y }: { x: number, y: number }) {
    if (x >= 0 && y >= 0 && y < topologyMap.length && x < topologyMap[0].length) return { x, y }
    return undefined
}

function getScore(xy: { x: number, y: number } | undefined, history: { x: number, y: number }[]) {
    if (!xy) return 0
    const { x, y } = xy
    const currentHeight = topologyMap[y][x];

    if (currentHeight === 9) { return 1 };

    const score: number = [isInMap({ x, y: y - 1 }),
    isInMap({ x, y: y + 1 }),
    isInMap({ x: x - 1, y }),
    isInMap({ x: x + 1, y })].reduce<number>((score_, potentialNeighboor) => {
        if (potentialNeighboor && topologyMap[potentialNeighboor.y][potentialNeighboor.x] === currentHeight + 1) return score_ + getScore(potentialNeighboor, history ? [...history, { x: potentialNeighboor.x, y: potentialNeighboor.y }] : [{ x: potentialNeighboor.x, y: potentialNeighboor.y }]);
        return score_
    }, 0)

    return score
}

const scores = trailHeads.reduce((scoresAcc, trailHead) => {
    return scoresAcc + getScore(trailHead, [trailHead]);
}, 0)

console.log(scores)
