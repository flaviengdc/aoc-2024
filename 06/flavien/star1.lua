local input = io.open("input.txt"):read("a");

Position = {}
Position.mt = {
    __eq = function(a, b)
        return a.x == b.x and a.y == b.y
    end
}
function Position.new(x, y)
    local position = {
        x = x,
        y = y
    }
    setmetatable(position, Position.mt)
    return position
end

Set = {}
Set.mt = {
    __len = function(self)
        local count = 0
        for _, _ in pairs(self) do
            count = count + 1
        end
        return count
    end,
    __index = function(self, requestedKey)
        for existingKey, value in pairs(self) do
            if (Position.mt.__eq(requestedKey, existingKey)) then
                return value
            end
            return nil
        end
    end,
    __newindex = function(self, requestedKey, value)
        for existingKey in pairs(self) do
            if (Position.mt.__eq(requestedKey, existingKey)) then
                return nil
            end
        end

        rawset(self, requestedKey, value)
    end,
}

function Set.new()
    local set = {}
    setmetatable(set, Set.mt)
    return set
end

DIRECTIONS = {
    ["^"] = Position.new(0, -1),
    [">"] = Position.new(1, 0),
    ["v"] = Position.new(0, 1),
    ["<"] = Position.new(-1, 0),
}

DIRECTIONS["^"].next = DIRECTIONS[">"]
DIRECTIONS[">"].next = DIRECTIONS["v"]
DIRECTIONS["v"].next = DIRECTIONS["<"]
DIRECTIONS["<"].next = DIRECTIONS["^"]

local visitedPositions = Set.new()

local map = {}
local guard = {
    position = Position.new(nil, nil),
    direction = nil
}

for line in input:gmatch("[^\n]+") do
    map[#map + 1] = {}
    for char in line:gmatch(".") do
        if (char == "^" or char == "v" or char == ">" or char == "<") then
            map[#map][#map[#map] + 1] = '.'
            guard.position = Position.new(#map[#map], #map)
            guard.direction = DIRECTIONS[char]
        else
            map[#map][#map[#map] + 1] = char
        end
    end
end

local function isInMapArea(map, position)
    if (position.y < 1) then return false end
    if (position.x < 1) then return false end
    if (position.y > #map) then return false end
    if (position.x > #map[position.y]) then return false end
    return true
end


while (isInMapArea(map, guard.position)) do
    visitedPositions[guard.position] = true

    local nextPosition = Position.new(guard.position.x + guard.direction.x, guard.position.y + guard.direction.y)

    if (not isInMapArea(map, nextPosition)) then
        break
    end

    local nextTile = map[nextPosition.y][nextPosition.x]

    if (nextTile == '.') then
        guard.position = nextPosition
    elseif (nextTile == '#') then
        guard.direction = guard.direction.next
    end
end

print(#visitedPositions)
