export function get_coord(i: number, n: number): [number, number] {
	const row = Math.floor(i / n)
	const col = i % n
	return [row, col]
}

export function range(start: number, end: number): number[] {
	const res = []
	let n = start
	while (n <= end) {
		res.push(n)
		n += 1
	}
	return res
}

export function zero_matrix(n: number): number[][] {
	const matrix = []
	for (let i = 0; i < n; i++) {
		const row = []
		for (let j = 0; j < n; j++) {
			row.push(0)
		}
		matrix.push(row)
	}
	return matrix
}
