export function* get_partial_solutions(
	n: number,
	row: number,
	columns: number[],
	sums: number[],
	diffs: number[]
): IterableIterator<number[]> {
	if (row < n) {
		for (let col = 0; col < n; col++) {
			const invalid =
				columns.includes(col) ||
				sums.includes(row + col) ||
				diffs.includes(row - col)
			if (!invalid) {
				for (const sol of get_partial_solutions(
					n,
					row + 1,
					[...columns, col],
					[...sums, row + col],
					[...diffs, row - col]
				)) {
					yield sol
				}
			}
		}
	} else {
		yield columns
	}
}

export function get_solutions(n: number): IterableIterator<number[]> {
	return get_partial_solutions(n, 0, [], [], [])
}
