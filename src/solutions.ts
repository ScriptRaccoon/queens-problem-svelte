export type solution = number[]

export function* get_partial_solutions(
	n: number,
	row: number,
	columns: number[],
	sums: number[],
	diffs: number[]
): IterableIterator<solution> {
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

export function get_solutions(n: number): IterableIterator<solution> {
	return get_partial_solutions(n, 0, [], [], [])
}

export const TOTAL_NUMBERS = [
	1, 1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680, 14200, 73712,
	365596, 2279184, 14772512, 95815104, 666090624, 4968057848,
	39029188884,
]
