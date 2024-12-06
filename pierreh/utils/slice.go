package slice

func Remove[T any](slice []T, index int) []T {
	var new_slice = make([]T, len(slice))
	copy(new_slice, slice)
	new_slice = append(new_slice[:index], new_slice[index+1:]...)
	return new_slice
}
