<script lang="ts">
	import { fly, fade } from 'svelte/transition'
	import {
		get_solutions,
		TOTAL_NUMBERS,
		type solution,
	} from './solutions'
	import { DoublyLinkedList } from './DoublyLinkedList'
	import { get_coord, range, zero_matrix } from './utils'

	const SIZES = range(4, 20)
	let n = 8

	$: title = `Solutions to the ${n} queens problem`

	let solution_generator = get_solutions(n)
	let solution_list = new DoublyLinkedList<solution>()
	solution_list.add(solution_generator.next().value)
	let current_solution = solution_list.first
	let current_index: number = 0

	let editing = false
	let matrix: number[][] = zero_matrix(n)
	let show_coords = false

	function show_next_solution(): void {
		if (current_solution.next) {
			current_solution = current_solution.next
			current_index += 1
			return
		}

		const next_solution = solution_generator.next().value

		if (next_solution) {
			current_solution = solution_list.add(next_solution)
			current_index += 1
		}
	}

	function show_previous_solution(): void {
		const prev_solution = current_solution.prev
		if (prev_solution) {
			current_solution = prev_solution
			current_index -= 1
		}
	}

	function change_size(): void {
		solution_generator = get_solutions(n)
		solution_list = new DoublyLinkedList()
		solution_list.add(solution_generator.next().value)
		current_solution = solution_list.first
		current_index = 0
		matrix = zero_matrix(n)
	}

	function toggle_edit(): void {
		editing = !editing
	}

	function toggle_square(row: number, col: number): void {
		if (!editing) return
		if (matrix[row][col] > 0) {
			matrix[row][col] = 0
		} else {
			matrix[row][col] = 1
		}
		determine_problems()
	}

	function toggle_coordinates(): void {
		show_coords = !show_coords
	}

	function is_empty(row: number, col: number): boolean {
		return matrix[row][col] == 0
	}

	function determine_problems(): void {
		for (let i = 0; i < n ** 2; i++) {
			const [row_1, col_1] = get_coord(i, n)
			if (is_empty(row_1, col_1)) continue
			let problem = false
			for (let j = 0; j < n ** 2; j++) {
				if (j == i) continue
				const [row_2, col_2] = get_coord(j, n)
				if (is_empty(row_2, col_2)) continue
				const attacking =
					col_1 == col_2 ||
					row_1 == row_2 ||
					row_1 + col_1 == row_2 + col_2 ||
					row_1 - col_1 == row_2 - col_2
				if (attacking) {
					problem = true
					break
				}
			}
			matrix[row_1][col_1] = problem ? 2 : 1
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header>
	<h1>{title}</h1>
</header>

<main>
	<!-- MENU -->
	<menu class="menu">
		{#if !editing}
			<div
				class="solution_controls"
				transition:fly={{ x: -100 }}
			>
				<button
					disabled={current_index == 0}
					on:click={show_previous_solution}
					aria-label="Previous solution"
				>
					<img
						alt="arrow left"
						aria-hidden="true"
						src="./arrow.svg"
					/>
				</button>

				<span aria-live="polite" class="solution_counter">
					Solution {current_index + 1}
					<span aria-hidden="true">/</span>
					<span class="vh">of</span>
					{TOTAL_NUMBERS[n]}
				</span>

				<button
					disabled={current_index == TOTAL_NUMBERS[n] - 1}
					on:click={show_next_solution}
					aria-label="Next solution"
				>
					<img
						class="mirrored"
						alt="arrow left"
						aria-hidden="true"
						src="./arrow.svg"
					/>
				</button>
			</div>
		{/if}

		<div class="secondary_controls">
			<button
				on:click={toggle_edit}
				aria-label="Toggle edit mode"
			>
				<img
					class="icon"
					src="./edit.svg"
					alt="edit"
					aria-hidden="true"
				/>
			</button>

			<button
				aria-label="toggle coordinates"
				on:click={toggle_coordinates}
				disabled={!editing}
			>
				<img
					src="./coordinate.svg"
					alt="coordinate"
					class="icon"
					aria-hidden="true"
				/>
			</button>

			<div class="size_controls">
				<label for="size_input">Size</label>
				<select
					id="size_input"
					bind:value={n}
					on:change={change_size}
				>
					{#each SIZES as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</div>
		</div>
	</menu>

	<!-- BOARD -->
	{#if current_solution}
		<div class="board" style:--n={n}>
			<!-- SQUARES -->
			{#each { length: n } as _, row}
				{#each { length: n } as _, col}
					{#if editing}
						{@const entry = matrix?.[row]?.[col]}
						<button
							class="square"
							class:light={(row + col) % 2 == 0}
							class:active={entry == 1}
							class:problem={entry == 2}
							on:click={() => toggle_square(row, col)}
						>
							<span
								class="coordinate"
								class:visible={show_coords}
								>({row},{col})</span
							>
						</button>
					{:else}
						<div
							class="square"
							class:light={(row + col) % 2 == 0}
						/>
					{/if}
				{/each}
			{/each}

			<!-- QUEENS -->
			{#if !editing}
				<div class="absolute" transition:fade>
					{#each { length: n } as _, row}
						{@const col = current_solution.data[row]}
						<div
							class="queen"
							style:--row={row}
							style:--col={col}
						>
							<img
								class="queen-img"
								src="./queen.png"
								alt="queen in row {row +
									1} and column {col + 1}"
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</main>

<!-- STYLES -->

<style>
	header {
		padding-block: 2rem;
	}

	h1 {
		font-weight: 300;
		text-align: center;
	}

	main {
		--size: min(45rem, 90vmin);
		width: min(45rem, 90vmin);
		margin-inline: auto;
	}

	.board {
		--unit: calc(var(--size) / var(--n));
		width: var(--size);
		height: var(--size);
		display: grid;
		grid-template: repeat(var(--n), 1fr) / repeat(var(--n), 1fr);
		position: relative;
		margin-top: 0.5rem;
	}

	.board * {
		transition: all 400ms ease;
	}

	.square {
		overflow: hidden;
		background-color: var(--square-color);
		border: 1px solid var(--bg-color);
	}

	.square.light {
		background-color: var(--square-color-light);
	}

	.square.active {
		background-color: var(--square-color-active);
	}

	.square.problem {
		background-color: var(--square-color-problem);
	}

	.queen {
		position: absolute;
		width: var(--unit);
		height: var(--unit);
		transform: translateX(calc(var(--col) * var(--unit)))
			translateY(calc(var(--row) * var(--unit)));
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.queen-img {
		width: 90%;
	}

	.solution_controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-bottom: 1rem;
	}

	.menu button {
		padding: 0.25rem;
		display: flex;
	}

	.secondary_controls {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.size_controls {
		display: flex;
		gap: 0.5rem;
		font-size: 1rem;
		align-items: center;
		justify-self: end;
		margin-left: auto;
	}

	.size_controls select {
		text-align: center;
	}

	.coordinate {
		opacity: 0;
		color: var(--bg-color);
		font-size: min(2rem, calc(0.4 * var(--unit)));
	}

	.square:is(.active, .problem) .coordinate {
		color: var(--font-color);
	}

	.coordinate.visible {
		opacity: 1;
	}

	.icon {
		width: 1.25rem;
	}

	.solution_counter {
		word-break: break-all;
	}

	@media (min-width: 32rem) {
		h1 {
			font-size: 2.25rem;
		}

		.menu {
			font-size: 1.5rem;
			min-height: 3rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.solution_controls {
			padding-bottom: unset;
			gap: 1rem;
		}
		.secondary_controls {
			margin-left: auto;
		}
	}
</style>
