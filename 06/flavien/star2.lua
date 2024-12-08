local input = io.open("input.txt"):read("a");

Set = {}
Set.mt = {
    __len = function(self)
        local count = 0
        for _, _ in pairs(self) do
            count = count + 1
        end
        return count
    end,
}

function Set.new()
    local set = {}
    setmetatable(set, Set.mt)
    return set
end

DIRECTIONS = {
    ["^"] = { x = 0, y = -1 },
    [">"] = { x = 1, y = 0 },
    ["v"] = { x = 0, y = 1 },
    ["<"] = { x = -1, y = 0 },
}

DIRECTIONS["^"].next = ">"
DIRECTIONS[">"].next = "v"
DIRECTIONS["v"].next = "<"
DIRECTIONS["<"].next = "^"

local visitedPositions = Set.new()

local INITIAL_MAP = {}
local INITIAL_GUARD = {
    position = nil,
    direction = nil
}

for line in input:gmatch("[^\n]+") do
    INITIAL_MAP[#INITIAL_MAP + 1] = {}
    for char in line:gmatch(".") do
        if (char == "^" or char == "v" or char == ">" or char == "<") then
            INITIAL_MAP[#INITIAL_MAP][#INITIAL_MAP[#INITIAL_MAP] + 1] = '.'
            INITIAL_GUARD.position = { x = #INITIAL_MAP[#INITIAL_MAP], y = #INITIAL_MAP }
            INITIAL_GUARD.direction = char
        else
            INITIAL_MAP[#INITIAL_MAP][#INITIAL_MAP[#INITIAL_MAP] + 1] = char
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

local WanderingGuard = {
    position = {
        x = INITIAL_GUARD.position.x,
        y = INITIAL_GUARD.position.y,
    },
    direction = INITIAL_GUARD.direction
}

while (isInMapArea(INITIAL_MAP, WanderingGuard.position)) do
    visitedPositions[tostring(WanderingGuard.position.x) .. "," .. tostring(WanderingGuard.position.y)] = true

    local nextPosition = {
        x = WanderingGuard.position.x + DIRECTIONS[WanderingGuard.direction].x,
        y = WanderingGuard.position.y + DIRECTIONS[WanderingGuard.direction].y
    }


    if (not isInMapArea(INITIAL_MAP, nextPosition)) then
        break
    end

    local nextTile = INITIAL_MAP[nextPosition.y][nextPosition.x]

    if (nextTile == '.') then
        WanderingGuard.position = nextPosition
    elseif (nextTile == '#') then
        WanderingGuard.direction = DIRECTIONS[WanderingGuard.direction].next
    end
end

function deepcopy(t)
    local t2 = {}
    for k, v in pairs(t) do
        if type(v) == "table" then
            t2[k] = deepcopy(v)
        else
            t2[k] = v
        end
    end
    return t2
end

local loopingPositions = 0
local step = 1
for visitedPositionRaw in pairs(visitedPositions) do
    local visitedPositionAsTable = {}
    for num in visitedPositionRaw:gmatch("%d+") do
        table.insert(visitedPositionAsTable, tonumber(num))
    end
    local visitedPositionAsCoord = { x = visitedPositionAsTable[1], y = visitedPositionAsTable[2] }
    local map = INITIAL_MAP
    map[visitedPositionAsCoord.y][visitedPositionAsCoord.x] = '#'
    local guard = deepcopy(INITIAL_GUARD)
    local visitedPositions2 = Set.new()

    while (isInMapArea(map, guard.position)) do
        local hasAlreadyVisited = visitedPositions2
        [tostring(guard.position.x) .. "," .. tostring(guard.position.y) .. "," .. guard.direction]
        if (hasAlreadyVisited) then
            loopingPositions = loopingPositions + 1
            break
        end
        visitedPositions2[tostring(guard.position.x) .. "," .. tostring(guard.position.y) .. "," .. guard.direction] = true

        local nextPosition = { x = guard.position.x + DIRECTIONS[guard.direction].x, y = guard.position.y +
        DIRECTIONS[guard.direction].y }
        if (not isInMapArea(map, nextPosition)) then
            break
        end
        if (map[nextPosition.y][nextPosition.x] == '.') then
            guard.position = nextPosition
        elseif (map[nextPosition.y][nextPosition.x] == '#') then
            guard.direction = DIRECTIONS[guard.direction].next
        end
    end

    map[visitedPositionAsCoord.y][visitedPositionAsCoord.x] = '.'
    step = step + 1
end

print(loopingPositions)
