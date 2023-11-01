<script lang="ts">
	import { get_solutions } from './solutions'

	const SIZES = new Array(17).fill(0).map((_, i) => i + 4)
	let n = 8

	$: title = `Solutions of the ${n} queens problem`

	let current_index: number = 0
	$: solutions = get_solutions(n)

	$: current_solution = solutions[current_index] ?? null

	function right(): void {
		current_index += 1
		if (current_index >= solutions.length) {
			current_index = 0
		}
	}

	function left(): void {
		current_index -= 1
		if (current_index < 0) {
			current_index = solutions.length - 1
		}
	}

	function change_size() {
		current_index = 0
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header class="vh">
	<h1>{title}</h1>
</header>

<main>
	<menu class="menu">
		<div class="solution_controls">
			<button on:click={left}>
				<img alt="left" src="./arrow.svg" />
			</button>
			<span class="name">
				Solution {current_index + 1} / {solutions.length}
			</span>
			<button on:click={right}>
				<img class="mirrored" alt="right" src="./arrow.svg" />
			</button>
		</div>

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
	</menu>
	{#if current_solution}
		<div class="board" style:--n={n}>
			{#each { length: n } as _, row}
				{#each { length: n } as _, col}
					<div
						class="cell"
						class:light={(row + col) % 2 == 0}
					/>
				{/each}
			{/each}
			{#each { length: n } as _, row}
				<img
					class="queen"
					style:--row={row}
					style:--col={current_solution[row]}
					src="./queen.png"
					alt="queen"
				/>
			{/each}
		</div>
	{/if}
</main>

<style>
	.board {
		--size: 80vmin;
		--unit: calc(var(--size) / var(--n));
		width: var(--size);
		height: var(--size);
		display: grid;
		grid-template: repeat(var(--n), 1fr) / repeat(var(--n), 1fr);
		gap: 2px;
		overflow: hidden;
		border-radius: 0.5rem;
	}

	.cell {
		background-color: #445;
	}

	.cell.light {
		background-color: #779;
	}

	.queen {
		position: absolute;
		width: calc(0.8 * var(--unit));
		transition: transform 400ms ease;
		transform: translateX(calc((var(--col) + 0.1) * var(--unit)))
			translateY(calc((var(--row) + 0.1) * var(--unit)));
	}

	.menu {
		display: flex;
		flex-direction: column;
		font-size: 1.5rem;
		row-gap: 0.5rem;
		padding-bottom: 2rem;
	}

	.solution_controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.menu button {
		padding: 0.25rem;
		display: flex;
	}

	.size_controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.size_controls select {
		text-align: center;
		font-size: 1.25rem;
	}

	@media (min-width: 32rem) {
		.menu {
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 1rem;
		}
		.solution_controls {
			justify-content: flex-start;
		}
	}
</style>
