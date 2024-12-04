local leftColumn, rightColumn = {}, {}

for line in io.lines("input.txt") do
    local left, right = line:match("(%d%d%d%d%d)%s*(%d%d%d%d%d)")

    leftColumn[#leftColumn+1] = tonumber(left)
    rightColumn[#rightColumn+1] = tonumber(right)
end

table.sort(leftColumn)
table.sort(rightColumn)

local totalDistance = 0

for i = 1, #leftColumn do
    totalDistance = totalDistance + math.abs(leftColumn[i] - rightColumn[i])
end

print(totalDistance)