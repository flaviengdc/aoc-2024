local leftColumn, rightColumn = {}, {}

for line in io.lines("input.txt") do
    local left, right = line:match("(%d%d%d%d%d)%s*(%d%d%d%d%d)")

    leftColumn[#leftColumn+1] = tonumber(left)
    rightColumn[#rightColumn+1] = tonumber(right)
end

local occurenceCache = {}
local totalDistance = 0

for _, left in ipairs(leftColumn) do
    if not occurenceCache[left] then
        local occurences = 0
        for _, right in ipairs(rightColumn) do
            if right == left then
                occurences = occurences + 1
            end
        end
        occurenceCache[left] = occurences
    end

    totalDistance = totalDistance + left * occurenceCache[left]
end

print(totalDistance)