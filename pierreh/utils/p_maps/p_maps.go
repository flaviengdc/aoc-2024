package p_map

func Keys[T comparable, Y any](target map[T]Y) []T {
	keys := make([]T, len(target))

	i := 0
	for k := range target {
		keys[i] = k
		i++
	}

	return keys
}
