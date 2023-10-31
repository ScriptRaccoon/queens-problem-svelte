<script lang="ts">
	import { onMount } from 'svelte'

	type solution = number[]

	let solutions: solution[] = []
	let current_index: number = 0

	$: current_solution = solutions[current_index] ?? null

	async function get_solutions(): Promise<solution[]> {
		const res = await fetch('./solutions.json')
		const data = await res.json()
		return data
	}

	onMount(async () => {
		solutions = await get_solutions()
	})

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
	<h1>Solutions of the 8 queens problem</h1>
</header>

<main>
	<menu class="menu">
		<button on:click={left}>
			<img alt="left" src="./arrow.svg" />
		</button>
		<span class="name">Solution {current_index + 1}</span>
		<button on:click={right}>
			<img class="arrow-right" alt="right" src="./arrow.svg" />
		</button>
	</menu>
	{#if current_solution}
		<div class="board">
			{#each { length: 8 } as _, row}
				{#each { length: 8 } as _, col}
					<div
						class="cell"
						class:light={(row + col) % 2 == 0}
					/>
				{/each}
			{/each}
			{#each { length: 8 } as _, row}
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
		--unit: calc(var(--size) / 8);
		width: var(--size);
		height: var(--size);
		display: grid;
		grid-template: repeat(8, 1fr) / repeat(8, 1fr);
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
