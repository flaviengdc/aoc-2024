package main

import (
	_ "embed"
	"fmt"
	"strings"
)

type Direction int

const (
	North     Direction = iota
	NorthEast Direction = iota
	East      Direction = iota
	SouthEast Direction = iota
	South     Direction = iota
	SouthWest Direction = iota
	West      Direction = iota
	NorthWest Direction = iota
)

//go:embed input.txt
var input string

func init() {
	input = strings.TrimRight(input, "\n")
}
func main() {
	part_1()
	part_2()
}

func get_matrix() [][]rune {
	rows := strings.Split(input, "\n")
	var matrix [][]rune

	for _, row := range rows {
		runes := []rune(row)
		matrix = append(matrix, runes)
	}

	return matrix
}

func get_next_target(current_target rune) rune {
	switch current_target {
	case 'X':
		return 'M'
	case 'M':
		return 'A'
	case 'A':
		return 'S'
	case 'S':
		return rune(0)
	}

	errorString := fmt.Sprintf("Unknown target %s", string(current_target))

	panic(errorString)
}

func get_next_pos(x int, y int, direction Direction) (int, int) {
	switch direction {
	case North:
		return x - 1, y
	case NorthEast:
		return x - 1, y + 1
	case East:
		return x, y + 1
	case SouthEast:
		return x + 1, y + 1
	case South:
		return x + 1, y
	case SouthWest:
		return x + 1, y - 1
	case West:
		return x, y - 1
	case NorthWest:
		return x - 1, y - 1

	}

	error_string := fmt.Sprintf("Unknown direction %d", direction)
	panic(error_string)

}

func get_is_pos_valid(matrix [][]rune) func(x int, y int) bool {
	row_length := len(matrix)
	col_length := len(matrix[0])

	return func(x int, y int) bool {

		return x >= 0 && y >= 0 && x < row_length && y < col_length
	}

}

var directions_part_1 = [...]Direction{North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest}

func count_xmas_part_1(matrix [][]rune) int {

	count := 0
	is_pos_valid := get_is_pos_valid(matrix)

	for x := range matrix {
		for y := range matrix {
			if matrix[x][y] != 'X' {
				continue
			}

			for _, direction := range directions_part_1 {
				cur_rune := matrix[x][y]
				target := 'X'
				cur_x, cur_y := x, y

				for cur_rune == target {
					if cur_rune == 'S' {
						count = count + 1
						break
					}
					cur_x, cur_y = get_next_pos(cur_x, cur_y, direction)

					if !is_pos_valid(cur_x, cur_y) {
						break
					}

					target = get_next_target(cur_rune)
					cur_rune = matrix[cur_x][cur_y]
				}
			}
		}
	}

	return count
}

func count_xmas_part_2(matrix [][]rune) int {
	count := 0
	is_pos_valid := get_is_pos_valid(matrix)

	for x := range matrix {
		for y := range matrix {
			if matrix[x][y] != 'A' {
				continue
			}
			s_w_x, s_w_y := get_next_pos(x, y, SouthWest)
			s_e_x, s_e_y := get_next_pos(x, y, SouthEast)
			n_w_x, n_w_y := get_next_pos(x, y, NorthWest)
			n_e_x, n_e_y := get_next_pos(x, y, NorthEast)

			if !is_pos_valid(s_w_x, s_w_y) {
				continue
			}
			if !is_pos_valid(s_e_x, s_e_y) {
				continue
			}
			if !is_pos_valid(n_w_x, n_w_y) {
				continue
			}
			if !is_pos_valid(n_e_x, n_e_y) {
				continue
			}

			south_west_rune := matrix[s_w_x][s_w_y]
			south_east_rune := matrix[s_e_x][s_e_y]
			north_west_rune := matrix[n_w_x][n_w_y]
			north_east_rune := matrix[n_e_x][n_e_y]
			is_diag_sw_ne_ok := south_west_rune == 'M' && north_east_rune == 'S' || south_west_rune == 'S' && north_east_rune == 'M'
			is_diag_se_nw_ok := south_east_rune == 'M' && north_west_rune == 'S' || south_east_rune == 'S' && north_west_rune == 'M'

			if is_diag_sw_ne_ok && is_diag_se_nw_ok {
				count = count + 1
			}

		}
	}

	return count
}

func part_1() {
	matrix := get_matrix()
	count := count_xmas_part_1(matrix)
	fmt.Printf("%d\n", count)

}

func part_2() {
	matrix := get_matrix()
	count := count_xmas_part_2(matrix)
	fmt.Printf("%d\n", count)
}
