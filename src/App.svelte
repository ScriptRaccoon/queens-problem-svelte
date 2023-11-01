<script lang="ts">
	import { get_solutions, get_partial_solutions } from './solutions'

	let n = 8
	let current_index: number = 0
	const solutions = get_solutions(n)

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
</script>

<header class="vh">
	<h1>Solutions of the {n} queens problem</h1>
</header>

<main>
	<menu class="menu">
		<button on:click={left}>
			<img alt="left" src="./arrow.svg" />
		</button>
		<span class="name"
			>Solution {current_index + 1} / {solutions.length}</span
		>
		<button on:click={right}>
			<img class="arrow-right" alt="right" src="./arrow.svg" />
		</button>
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
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		padding-bottom: 1rem;
		gap: 1.5rem;
	}

	.menu button {
		padding: 0.25rem;
		display: flex;
	}

	.menu .arrow-right {
		transform: scaleX(-1);
	}
</style>
