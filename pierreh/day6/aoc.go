package main

import (
	p_map "aoc/utils/p_maps"
	_ "embed"
	"fmt"
	"slices"
	"strings"
)

type GuardPosition struct {
	position  Position
	direction Direction
}

type Position struct {
	x int
	y int
}

type Direction int

const (
	North Direction = iota
	East  Direction = iota
	South Direction = iota
	West  Direction = iota
)

type Cell int

const (
	Clear       Cell = iota
	Obstruction Cell = iota
)

//go:embed input.txt
var input string

func init() {
	input = strings.TrimRight(input, "\n")
}
func get_map_with_obstructions_and_guard() ([][]Cell, GuardPosition) {
	var map_with_obstructions [][]Cell

	var guard_position GuardPosition

	for x, line := range strings.Split(input, "\n") {
		var cur_line []Cell

		for y, cell := range line {
			if cell == '.' {
				cur_line = append(cur_line, Clear)
				continue
			}
			if cell == '#' {
				cur_line = append(cur_line, Obstruction)
				continue
			}
			// it's the guard cell, could be better tbh
			cur_line = append(cur_line, Clear)

			var guard_direction Direction
			if cell == 'v' {
				guard_direction = South
			}
			if cell == '>' {
				guard_direction = East
			}
			if cell == '<' {
				guard_direction = West
			}
			if cell == '^' {
				guard_direction = North
			}

			guard_position = GuardPosition{Position{x, y}, guard_direction}
		}

		map_with_obstructions = append(map_with_obstructions, cur_line)
	}

	return map_with_obstructions, guard_position
}

func main() {
	part_1()
	part_2()
}

func move_guard(cur_map [][]Cell, guard_pos GuardPosition) (GuardPosition, bool) {
	var next_pos Position
	cur_x := guard_pos.position.x
	cur_y := guard_pos.position.y
	switch guard_pos.direction {
	case South:
		next_pos = Position{cur_x + 1, cur_y}
	case West:
		next_pos = Position{cur_x, cur_y - 1}
	case East:
		next_pos = Position{cur_x, cur_y + 1}
	case North:
		next_pos = Position{cur_x - 1, cur_y}
	}

	// guard is out of the map
	if next_pos.x < 0 || next_pos.y < 0 || next_pos.x >= len(cur_map) || next_pos.y >= len(cur_map[0]) {
		return guard_pos, true
	}

	next_cell := cur_map[next_pos.x][next_pos.y]

	if next_cell == Clear {
		// Keep same direction with next pos
		return GuardPosition{next_pos, guard_pos.direction}, false
	}

	// Ostacle
	var new_direction Direction
	switch guard_pos.direction {
	case South:
		new_direction = West
	case West:
		new_direction = North
	case East:
		new_direction = South
	case North:
		new_direction = East
	}

	// Keep position with 90deg rotation
	return GuardPosition{guard_pos.position, new_direction}, false
}

func move_guard_until_out_or_loop(cur_map [][]Cell, guard_pos GuardPosition) (visited_cells []Position, is_looping bool) {
	visited_pos := make(map[Position][]Direction)
	visited_pos[guard_pos.position] = []Direction{guard_pos.direction}
	cur_guard_pos := guard_pos

	for {
		new_guard_pos, is_success := move_guard(cur_map, cur_guard_pos)
		// He's out, no loop
		if is_success {
			return p_map.Keys(visited_pos), false
		}

		// If he already been there with the same direction, he's looping
		if slices.Contains(visited_pos[new_guard_pos.position], new_guard_pos.direction) {
			return p_map.Keys(visited_pos), true
		}

		visited_pos[new_guard_pos.position] = append(visited_pos[new_guard_pos.position], new_guard_pos.direction)
		cur_guard_pos = new_guard_pos
	}
}

func count_obstacles_to_loop(cur_map [][]Cell, guard_pos GuardPosition) int {
	obstacle_count := 0
	all_guard_positions, _ := move_guard_until_out_or_loop(cur_map, guard_pos)

	// We'll put an obstacle on all guard positions and see if it makes him loop
	for _, cur_guard_pos := range all_guard_positions {
		// can't put an obstacle on starting point
		if cur_guard_pos == guard_pos.position {
			continue
		}

		cur_map[cur_guard_pos.x][cur_guard_pos.y] = Obstruction

		_, is_looping := move_guard_until_out_or_loop(cur_map, guard_pos)

		if is_looping {
			obstacle_count++
		}

		// reset map
		cur_map[cur_guard_pos.x][cur_guard_pos.y] = Clear

	}

	return obstacle_count
}

func part_1() {
	cur_map, guard_pos := get_map_with_obstructions_and_guard()
	visited_cells_count, _ := move_guard_until_out_or_loop(cur_map, guard_pos)
	fmt.Printf("%d\n", len(visited_cells_count))
}

func part_2() {
	cur_map, guard_pos := get_map_with_obstructions_and_guard()
	count := count_obstacles_to_loop(cur_map, guard_pos)
	fmt.Printf("%d\n", count)
}
