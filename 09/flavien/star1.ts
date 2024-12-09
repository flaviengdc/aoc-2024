const diskMap = (await Bun.file("input.txt").text()).split("").map(Number);

const {blocks} = diskMap.reduce<{blocks: string[], IDNumber: number}>((acc, block, index) => {
    if(index % 2 === 0) {
        return {
            blocks: [...acc.blocks, ...Array.from(new Array(block).fill(`${acc.IDNumber}`)) ],
            IDNumber: acc.IDNumber + 1
        }
    }

    return {
        ...acc,
        blocks: [...acc.blocks, ...Array.from(new Array(block).fill('.')) ],
    }
}, {
    blocks: [],
    IDNumber: 0
});

const blocksCopy = [...blocks];

let leftCursor = 0;
let rightCursor = blocksCopy.length - 1;

while(leftCursor <= rightCursor) {
    let leftBlock = blocksCopy[leftCursor];
    let rightBlock = blocksCopy[rightCursor];

    if(leftBlock !== '.') {leftCursor++; continue;}
    if(rightBlock === '.') {rightCursor--; continue;}

    blocksCopy[leftCursor] = rightBlock;
    blocksCopy[rightCursor] = '.';
}

const checksum = blocksCopy.reduce((acc, block, index) => {
    if(block === '.') return acc;
    return acc + Number(block) * index
}, 0);

console.log(checksum)