package main

import (
	slice "aoc/utils"
	_ "embed"
	"fmt"
	"strconv"
	"strings"
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

func get_rules_and_updates() ([]string, []string) {
	splited := strings.Split(input, "\n\n")

	return strings.Split(splited[0], "\n"), strings.Split(splited[1], "\n")
}

func get_rules(raw_rules []string) map[int][]int {
	rules := make(map[int][]int)

	for _, line := range raw_rules {
		splited_line := strings.Split(line, "|")
		source, err1 := strconv.Atoi(splited_line[0])
		if err1 != nil {
			panic(err1)
		}

		target, err1 := strconv.Atoi(splited_line[1])
		if err1 != nil {
			panic(err1)
		}

		rules[source] = append(rules[source], target)
	}

	return rules
}

func get_updates(raw_updates []string) [][]int {
	var updates [][]int
	for _, raw_update := range raw_updates {
		update_raw_items := strings.Split(raw_update, ",")
		var current_update []int
		for _, raw_item := range update_raw_items {
			item, err := strconv.Atoi(raw_item)
			if err != nil {
				panic(err)
			}

			current_update = append(current_update, item)
		}
		updates = append(updates, current_update)
	}

	return updates
}

func get_is_update_correctly_ordered(rules map[int][]int) func(update []int) (bool, int, int) {
	// Return the index of the both faulty page
	return func(update []int) (bool, int, int) {
		for i, target := range update {
			target_rules, ok := rules[target]
			following_pages := update[i+1:]

			// there is no rule for this target, it MUST be the last page
			if !ok {
				return len(following_pages) == 0, i, len(update) - 1
			}

			for j := i + 1; j < len(update); j++ {
				page := update[j]
				if !slice.Contains(target_rules, page) {
					return false, i, j
				}
			}
		}
		return true, -1, -1
	}
}

func get_correct_updates(rules map[int][]int, updates [][]int) [][]int {
	is_update_correctly_ordered := get_is_update_correctly_ordered(rules)
	var correct_updates [][]int

	for _, update := range updates {
		is_ordered, _, _ := is_update_correctly_ordered(update)
		if is_ordered {
			correct_updates = append(correct_updates, update)
		}
	}

	return correct_updates
}

func get_incorrect_updates(rules map[int][]int, updates [][]int) [][]int {
	is_update_correctly_ordered := get_is_update_correctly_ordered(rules)
	var incorrect_updates [][]int

	for _, update := range updates {
		is_ordered, _, _ := is_update_correctly_ordered(update)
		if !is_ordered {
			incorrect_updates = append(incorrect_updates, update)
		}
	}

	return incorrect_updates
}

func fix_update(rules map[int][]int, update []int) []int {
	is_update_correctly_ordered := get_is_update_correctly_ordered(rules)
	is_ordered, fail_index_i, fail_index_j := is_update_correctly_ordered(update)

	for !is_ordered {
		tmp := update[fail_index_i]
		update[fail_index_i] = update[fail_index_j]
		update[fail_index_j] = tmp

		is_ordered, fail_index_i, fail_index_j = is_update_correctly_ordered(update)
	}

	return update
}

func get_fixed_updates(rules map[int][]int, updates [][]int) [][]int {
	var fixed_updates [][]int
	to_fix_updates := get_incorrect_updates(rules, updates)

	for _, update := range to_fix_updates {
		fixed_updates = append(fixed_updates, fix_update(rules, update))
	}

	return fixed_updates
}

func get_middle_sum_of_updates(updates [][]int) int {
	sum := 0

	for _, update := range updates {
		middle_index := int(len(update) / 2)
		sum = sum + update[middle_index]
	}

	return sum
}

func part_1() {
	raw_rules, raw_updates := get_rules_and_updates()
	rules := get_rules(raw_rules)
	updates := get_updates(raw_updates)
	correct_updates := get_correct_updates(rules, updates)
	sum := get_middle_sum_of_updates(correct_updates)

	fmt.Printf("Part 1 : %v\n", sum)
}

func part_2() {
	raw_rules, raw_updates := get_rules_and_updates()
	rules := get_rules(raw_rules)
	updates := get_updates(raw_updates)
	incorrect_updates := get_incorrect_updates(rules, updates)
	fixed_updates := get_fixed_updates(rules, incorrect_updates)
	sum := get_middle_sum_of_updates(fixed_updates)

	fmt.Printf("Part 2 : %v\n", sum)
}
