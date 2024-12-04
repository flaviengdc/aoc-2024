local input = io.open("input.txt"):read("a");

local lines = {}
for line in input:gmatch("[^\n]+") do
    lines[#lines + 1] = {}
    for char in line:gmatch(".") do
        lines[#lines][#lines[#lines] + 1] = char
    end
end

local function checkA(position)
    return lines[position.line][position.column] == "A"
end

local function checkN(position)
    if(not checkA(position)) then return false end
    if(position.line - 1 < 1) then return false end
    if(position.column - 1 < 1) then return false end
    if(position.line + 1 > #lines) then return false end
    if(position.column + 1 > #lines[1]) then return false end

    local X = {
        NO = lines[position.line - 1][position.column - 1],
        NE = lines[position.line - 1][position.column + 1],
        SO = lines[position.line + 1][position.column - 1],
        SE = lines[position.line + 1][position.column + 1]
    }

    return X.NO == "M" and X.NE == "S" and X.SO == "M" and X.SE == "S"
end

local function checkS(position)
    if(not checkA(position)) then return false end
    if(position.line - 1 < 1) then return false end
    if(position.column - 1 < 1) then return false end
    if(position.line + 1 > #lines) then return false end
    if(position.column + 1 > #lines[1]) then return false end

    local X = {
        NO = lines[position.line - 1][position.column - 1],
        NE = lines[position.line - 1][position.column + 1],
        SO = lines[position.line + 1][position.column - 1],
        SE = lines[position.line + 1][position.column + 1]
    }

    return X.NO == "S" and X.NE == "M" and X.SO == "S" and X.SE == "M"
end

local function checkE(position)
    if(not checkA(position)) then return false end
    if(position.line - 1 < 1) then return false end
    if(position.column - 1 < 1) then return false end
    if(position.line + 1 > #lines) then return false end
    if(position.column + 1 > #lines[1]) then return false end

    local X = {
        NO = lines[position.line - 1][position.column - 1],
        NE = lines[position.line - 1][position.column + 1],
        SO = lines[position.line + 1][position.column - 1],
        SE = lines[position.line + 1][position.column + 1]
    }

    return X.NO == "S" and X.NE == "S" and X.SO == "M" and X.SE == "M"
end

local function checkO(position)
    if(not checkA(position)) then return false end
    if(position.line - 1 < 1) then return false end
    if(position.column - 1 < 1) then return false end
    if(position.line + 1 > #lines) then return false end
    if(position.column + 1 > #lines[1]) then return false end

    local X = {
        NO = lines[position.line - 1][position.column - 1],
        NE = lines[position.line - 1][position.column + 1],
        SO = lines[position.line + 1][position.column - 1],
        SE = lines[position.line + 1][position.column + 1]
    }

    return X.NO == "M" and X.NE == "M" and X.SO == "S" and X.SE == "S"
end

local occurences = 0

for line = 1, #lines do
    for column = 1, #lines[line] do
        if(checkN({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkS({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkE({ line = line, column = column })) then occurences = occurences + 1 end
        if(checkO({ line = line, column = column })) then occurences = occurences + 1 end
    end
end

print(occurences)