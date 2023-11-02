<script lang="ts">
	import { fly, fade } from 'svelte/transition'
	import { get_solutions, type solution } from './solutions'
	import { DoublyLinkedList } from './DoublyLinkedList'

	const SIZES = new Array(17).fill(0).map((_, i) => i + 4)
	let n = 8

	$: title = `Solutions of the ${n} queens problem`

	let solution_generator = get_solutions(n)
	let solution_list = new DoublyLinkedList<solution>()
	solution_list.add(solution_generator.next().value)
	let current_solution = solution_list.first
	let current_index: number = 0
	let total_number: number = 0

	let found_all = false
	let highlight = false
	let editing = false
	let edit_matrix: number[][] = []
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
		} else if (!found_all) {
			found_all = true
			highlight = true
			setTimeout(() => {
				highlight = false
			}, 1000)
		}
		total_number = current_index + 1
	}

	function show_previous_solution(): void {
		const prev_solution = current_solution.prev
		if (prev_solution) {
			current_solution = prev_solution
			current_index -= 1
		}
	}

	function change_size(): void {
		found_all = false
		solution_generator = get_solutions(n)
		solution_list = new DoublyLinkedList()
		solution_list.add(solution_generator.next().value)
		current_solution = solution_list.first
		current_index = 0
		clear_matrix()
	}

	function toggle_edit(): void {
		editing = !editing
		if (editing) {
			clear_matrix()
		}
	}

	function clear_matrix(): void {
		edit_matrix = []
		for (let i = 0; i < n; i++) {
			const some_list = []
			for (let j = 0; j < n; j++) {
				some_list.push(0)
			}
			edit_matrix.push(some_list)
		}
	}

	function toggle_cell(row: number, col: number): void {
		if (!editing) return
		if (edit_matrix[row][col] > 0) {
			edit_matrix[row][col] = 0
		} else {
			edit_matrix[row][col] = 1
		}
		determine_problems()
	}

	function toggle_coordinates(): void {
		show_coords = !show_coords
	}

	function determine_problems() {
		// refactor later
		for (let row1 = 0; row1 < n; row1++) {
			for (let col1 = 0; col1 < n; col1++) {
				if (edit_matrix[row1][col1] == 0) continue
				let problem = false
				for (let row2 = 0; row2 < n; row2++) {
					for (let col2 = 0; col2 < n; col2++) {
						if (
							edit_matrix[row2][col2] == 0 ||
							(row1 == row2 && col1 == col2)
						)
							continue
						if (
							col1 == col2 ||
							row1 == row2 ||
							row1 + col1 == row2 + col2 ||
							row1 - col1 == row2 - col2
						) {
							problem = true
						}
					}
				}
				edit_matrix[row1][col1] = problem ? 2 : 1
			}
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header class="vh">
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

				<span
					aria-live="polite"
					class="solution_counter"
					class:highlight
				>
					Solution {current_index + 1}
					<span aria-hidden="true">/</span>
					{#if found_all}
						<span class="vh">of</span>
						{total_number}
					{:else}
						?
					{/if}
				</span>

				<button
					disabled={found_all &&
						current_index == total_number - 1}
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
			<!-- CELLS -->
			{#each { length: n } as _, row}
				{#each { length: n } as _, col}
					{#if editing}
						{@const entry = edit_matrix?.[row]?.[col]}
						<button
							class="cell"
							class:light={(row + col) % 2 == 0}
							class:active={entry == 1}
							class:problem={entry == 2}
							on:click={() => toggle_cell(row, col)}
						>
							<span
								class="coordinate"
								class:visible={show_coords}
								>({row},{col})</span
							>
						</button>
					{:else}
						<div
							class="cell"
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
	.board {
		--size: min(45rem, 90vmin);
		--unit: calc(var(--size) / var(--n));
		width: var(--size);
		height: var(--size);
		display: grid;
		grid-template: repeat(var(--n), 1fr) / repeat(var(--n), 1fr);
		gap: 2px;
		border-radius: 0.5rem;
		position: relative;
		margin-top: 0.5rem;
	}

	.board * {
		transition: all 400ms ease;
	}

	.cell {
		aspect-ratio: 1;
		overflow: hidden;
		background-color: var(--cell-color);
	}

	.cell.light {
		background-color: var(--cell-color-light);
	}

	.cell.active {
		background-color: var(--cell-color-active);
	}

	.cell.problem {
		background-color: var(--cell-color-problem);
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

	.menu {
		font-size: 1.5rem;
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
		font-size: 1rem;
	}

	.coordinate {
		opacity: 0;
		color: var(--bg-color);
		font-size: min(2rem, calc(0.4 * var(--unit)));
	}

	.cell.active .coordinate {
		color: var(--font-color);
	}

	.coordinate.visible {
		opacity: 1;
	}

	.icon {
		width: 1.25rem;
	}

	.solution_counter {
		transition: all 250ms ease-in-out;
	}

	.highlight {
		scale: 1.05;
		color: var(--alert-color);
	}

	@media (min-width: 32rem) {
		.menu {
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
