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

function findLastFile(block: string[], index?: number) {
    index = index ?? block.length - 1;
    while(index >= 0 && block[index] === '.') index--;

    if(index < 0) return undefined

    let rightCursor = index;
    let leftCursor = index;
    const fileId = block[index];

    while(leftCursor >= 0 && block[leftCursor - 1] === fileId) {
        leftCursor--;
    }

    return {
        leftCursor,
        rightCursor,
        fileId,
        length: rightCursor - leftCursor + 1
    }
}

function findFirstSpace(block: string[], minSize: number, lastIndex: number) {
    let leftCursor = 0;
    let rightCursor = 0;
    let found = false;

    while(!found && leftCursor < lastIndex) {
        while(leftCursor < lastIndex && block[leftCursor] !== '.') leftCursor++;
        rightCursor = leftCursor;
        while(rightCursor < lastIndex && block[rightCursor + 1] === '.') rightCursor++;

        if(rightCursor - leftCursor + 1 >= minSize && rightCursor < lastIndex) {
            found = true;
            break;
        }

        leftCursor = rightCursor + 1;
    }

    if(!found) {
        return undefined
    }

    return {
        leftCursor,
        rightCursor,
        length: rightCursor - leftCursor + 1
    }
}

const blocksCopy = [...blocks];
let rightCursor = blocksCopy.length - 1;
while(rightCursor >= 0) {
    const lastFile = findLastFile(blocksCopy, rightCursor);
    if(!lastFile) break;

    const firstSpace = findFirstSpace(blocksCopy, lastFile.length, rightCursor - 1);
    if(!firstSpace) {rightCursor = lastFile.leftCursor - 1; continue;}

    for(let i=0; i<lastFile.length; i++) {
        blocksCopy[firstSpace.leftCursor + i] = lastFile.fileId
        blocksCopy[lastFile.leftCursor + i] = '.'
    }

    rightCursor = lastFile.leftCursor - 1
}

const checksum = blocksCopy.reduce((acc, block, index) => {
    if(block === '.') return acc;
    return acc + Number(block) * index
}, 0);

console.log(checksum)