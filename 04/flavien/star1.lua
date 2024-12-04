local input = io.open("input.txt"):read("a");

local lines = {}
for line in input:gmatch("[^\n]+") do
    lines[#lines + 1] = {}
    for char in line:gmatch(".") do
        lines[#lines][#lines[#lines] + 1] = char
    end
end

local function appears(letters)
    return letters.M == "M" and letters.A == "A" and letters.S == "S"
end

local function checkX(position)
    return lines[position.line][position.column] == "X"
end

local function checkN(position)
    if(not checkX(position)) then return false end
    if (position.line - 3 < 1) then return false end

    local XMAS = {
        M = lines[position.line - 1][position.column],
        A = lines[position.line - 2][position.column],
        S = lines[position.line - 3][position.column]
    }

    return appears(XMAS)
end

local function checkS(position)
    if(not checkX(position)) then return false end
    if (position.line + 3 > #lines) then return false end

    local XMAS = {
        M = lines[position.line + 1][position.column],
        A = lines[position.line + 2][position.column],
        S = lines[position.line + 3][position.column]
    }

    return appears(XMAS)
end

local function checkE(position)
    if(not checkX(position)) then return false end
    if (position.column + 3 > #lines[1]) then return false end

    local XMAS = {
        M = lines[position.line][position.column + 1],
        A = lines[position.line][position.column + 2],
        S = lines[position.line][position.column + 3]
    }

    return appears(XMAS)
end

local function checkO(position)
    if(not checkX(position)) then return false end
    if (position.column - 3 < 1) then return false end

    local XMAS = {
        M = lines[position.line][position.column - 1],
        A = lines[position.line][position.column - 2],
        S = lines[position.line][position.column - 3]
    }

    return appears(XMAS)
end

local function checkNO(position)
    if(not checkX(position)) then return false end
    if (position.line - 3 < 1) then return false end
    if (position.column - 3 < 1) then return false end

    local XMAS = {
        M = lines[position.line - 1][position.column - 1],
        A = lines[position.line - 2][position.column - 2],
        S = lines[position.line - 3][position.column - 3]
    }

    return appears(XMAS)
end

local function checkNE(position)
    if(not checkX(position)) then return false end
    if (position.line - 3 < 1) then return false end
    if (position.column + 3 > #lines[1]) then return false end

    local XMAS = {
        M = lines[position.line - 1][position.column + 1],
        A = lines[position.line - 2][position.column + 2],
        S = lines[position.line - 3][position.column + 3]
    }

    return appears(XMAS)
end

local function checkSE(position)
    if(not checkX(position)) then return false end
    if (position.line + 3 > #lines) then return false end
    if (position.column + 3 > #lines[1]) then return false end

    local XMAS = {
        M = lines[position.line + 1][position.column + 1],
        A = lines[position.line + 2][position.column + 2],
        S = lines[position.line + 3][position.column + 3]
    }

    return appears(XMAS)
end

local function checkSO(position)
    if(not checkX(position)) then return false end
    if (position.line + 3 > #lines) then return false end
    if (position.column - 3 < 1) then return false end

    local XMAS = {
        M = lines[position.line + 1][position.column - 1],
        A = lines[position.line + 2][position.column - 2],
        S = lines[position.line + 3][position.column - 3]
    }

    return appears(XMAS)
end

local occurences = 0

for line = 1, #lines do
    for column = 1, #lines[line] do
        if(checkN({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkS({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkE({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkO({ line = line, column = column })) then occurences = occurences + 1 end

        if(checkNO({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkNE({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkSE({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkSO({ line = line, column = column })) then occurences = occurences + 1 end
    end
end

print(occurences)