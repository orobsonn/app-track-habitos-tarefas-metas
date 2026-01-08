<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let step = $state(1);
	let affirmation = $state('');

	$effect(() => {
		if (form?.step) {
			step = form.step;
		}
	});
	let habits = $state([
		{ title: '', days: [] as string[] },
		{ title: '', days: [] as string[] }
	]);
	let goals = $state([{ title: '', target: 12 }]);
	let hasPartner = $state<boolean | null>(null);

	const weekDays = [
		{ value: 'mon', label: 'Seg' },
		{ value: 'tue', label: 'Ter' },
		{ value: 'wed', label: 'Qua' },
		{ value: 'thu', label: 'Qui' },
		{ value: 'fri', label: 'Sex' },
		{ value: 'sat', label: 'Sáb' },
		{ value: 'sun', label: 'Dom' }
	];

	function addHabit() {
		habits = [...habits, { title: '', days: [] }];
	}

	function addGoal() {
		goals = [...goals, { title: '', target: 1 }];
	}

	function toggleDay(habitIndex: number, day: string) {
		const habit = habits[habitIndex];
		if (habit.days.includes(day)) {
			habit.days = habit.days.filter(d => d !== day);
		} else {
			habit.days = [...habit.days, day];
		}
		habits = [...habits];
	}
</script>

<svelte:head>
	<title>Bem-vindo ao Ritual</title>
</svelte:head>

<main>
	<div class="progress-dots">
		{#each [1, 2, 3, 4, 5] as s}
			<span class="dot" class:active={step >= s}></span>
		{/each}
	</div>

	{#if step === 1}
		<!-- Step 1: Afirmação -->
		<section class="step">
			<h1>Sua afirmação diária</h1>
			<p class="subtitle">
				Uma frase que você verá toda manhã como parte do seu ritual.
			</p>

			<form method="POST" action="?/saveAffirmation" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						step = 2;
					}
				};
			}}>
				<textarea
					name="affirmation"
					placeholder="Ex: Eu sou capaz de alcançar meus objetivos. Cada dia é uma nova oportunidade."
					bind:value={affirmation}
					rows="3"
				></textarea>

				<div class="actions">
					<button type="submit" class="primary">Continuar</button>
				</div>
			</form>
		</section>

	{:else if step === 2}
		<!-- Step 2: Explicação Hábitos vs Metas -->
		<section class="step explanation-step">
			<h1>Hábitos e Metas</h1>
			<p class="subtitle">Duas formas de acompanhar seu progresso</p>

			<div class="explanation-cards">
				<div class="explanation-card habits-card">
					<div class="card-icon">🔄</div>
					<h3>Hábitos</h3>
					<p class="card-desc">Ações recorrentes do dia a dia que você pratica com frequência.</p>
					<ul class="examples">
						<li>Academia 3x por semana</li>
						<li>Leitura diária</li>
						<li>Meditação todas as manhãs</li>
					</ul>
				</div>

				<div class="explanation-card goals-card">
					<div class="card-icon">🎯</div>
					<h3>Metas</h3>
					<p class="card-desc">Objetivos maiores com um valor alvo que você quer alcançar.</p>
					<ul class="examples">
						<li>Ler 12 livros no ano</li>
						<li>Economizar R$ 10.000</li>
						<li>Completar 50 treinos</li>
					</ul>
				</div>
			</div>

			<div class="actions">
				<button type="button" class="primary" onclick={() => step = 3}>Continuar</button>
			</div>
		</section>

	{:else if step === 3}
		<!-- Step 3: Hábitos -->
		<section class="step">
			<h1>Seus hábitos</h1>
			<p class="subtitle">
				Ações recorrentes que você quer praticar. Selecione os dias da semana.
			</p>

			<form method="POST" action="?/saveHabits" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						step = 4;
					}
				};
			}}>
				{#each habits as habit, i}
					<div class="habit-block">
						<input
							type="text"
							name="habits"
							placeholder="Ex: Meditar, Exercitar, Ler..."
							bind:value={habits[i].title}
						/>
						<div class="days-grid">
							{#each weekDays as day}
								<button
									type="button"
									class="day-chip"
									class:selected={habits[i].days.includes(day.value)}
									onclick={() => toggleDay(i, day.value)}
								>
									{day.label}
								</button>
							{/each}
						</div>
						<input type="hidden" name="habitDays" value={JSON.stringify(habits[i].days)} />
					</div>
				{/each}

				<button type="button" class="add-more" onclick={addHabit}>
					+ Adicionar outro hábito
				</button>

				<div class="actions">
					<button type="submit" class="primary">Continuar</button>
				</div>
			</form>
		</section>

	{:else if step === 4}
		<!-- Step 4: Metas -->
		<section class="step">
			<h1>Suas metas</h1>
			<p class="subtitle">
				Objetivos com valor alvo. Ex: Ler 12 livros, economizar R$ 5000.
			</p>

			<form method="POST" action="?/saveGoals" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						step = 5;
					}
				};
			}}>
				{#each goals as goal, i}
					<div class="goal-row">
						<input
							type="text"
							name="goals"
							placeholder="Ex: Ler livros"
							bind:value={goals[i].title}
						/>
						<input
							type="number"
							name="targets"
							min="1"
							bind:value={goals[i].target}
						/>
					</div>
				{/each}

				<button type="button" class="add-more" onclick={addGoal}>
					+ Adicionar outra meta
				</button>

				<div class="actions">
					<button type="submit" class="primary">Continuar</button>
				</div>
			</form>
		</section>

	{:else if step === 5}
		<!-- Step 5: Casal -->
		<section class="step">
			<h1>Metas em casal</h1>
			<p class="subtitle">
				Você pode criar metas e hábitos compartilhados com seu parceiro(a).
			</p>

			{#if hasPartner === null}
				<div class="partner-question">
					<p>Você tem um parceiro(a) para compartilhar metas?</p>
					<div class="partner-options">
						<button class="option" onclick={() => hasPartner = true}>
							Sim, tenho
						</button>
						<button class="option" onclick={() => hasPartner = false}>
							Não / Prefiro não
						</button>
					</div>
				</div>

			{:else if hasPartner}
				<div class="premium-offer">
					<div class="offer-badge">Oferta de boas-vindas</div>
					<h2>Desbloqueie o modo Casal</h2>
					<p>Crie metas e hábitos compartilhados com quem você ama.</p>

					<div class="pricing">
						<span class="old-price">R$ 47</span>
						<span class="new-price">R$ 27</span>
						<span class="discount">-42%</span>
					</div>

					<p class="once">Pagamento único. Sem mensalidade.</p>

					<form method="POST" action="/api/stripe/checkout">
						<input type="hidden" name="onboarding" value="true" />
						<button type="submit" class="primary premium-btn">
							Quero desbloquear
						</button>
					</form>

					<form method="POST" action="?/finish" use:enhance>
						<input type="hidden" name="hasPartner" value="true" />
						<input type="hidden" name="wantsPremium" value="false" />
						<button type="submit" class="skip-link">
							Talvez depois
						</button>
					</form>
				</div>

			{:else}
				<form method="POST" action="?/finish" use:enhance>
					<input type="hidden" name="hasPartner" value="false" />
					<input type="hidden" name="wantsPremium" value="false" />
					<button type="submit" class="primary">
						Começar a usar o Ritual
					</button>
				</form>
			{/if}
		</section>
	{/if}

	<form method="POST" action="?/skip" use:enhance class="skip-form">
		<button type="submit" class="skip">Pular configuração</button>
	</form>
</main>

<style>
	main {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.progress-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2d4a5e;
		transition: background 0.3s;
	}

	.dot.active {
		background: #88c0d0;
	}

	.step {
		flex: 1;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
		text-align: center;
		color: #e0e0e0;
	}

	.subtitle {
		color: #8899a6;
		text-align: center;
		margin: 0 0 2rem 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	textarea,
	input[type='text'] {
		width: 100%;
		padding: 0.75rem;
		background: #1b2838;
		border: 1px solid #2d4a5e;
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		box-sizing: border-box;
		color: #e0e0e0;
	}

	textarea:focus,
	input[type='text']:focus,
	input[type='number']:focus {
		outline: none;
		border-color: #88c0d0;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	input[type='number'] {
		width: 80px;
		padding: 0.75rem;
		background: #1b2838;
		border: 1px solid #2d4a5e;
		border-radius: 8px;
		font-size: 1rem;
		text-align: center;
		color: #e0e0e0;
	}

	.goal-row {
		display: flex;
		gap: 0.5rem;
	}

	.goal-row input[type='text'] {
		flex: 1;
	}

	.add-more {
		background: none;
		border: none;
		color: #8899a6;
		cursor: pointer;
		font-size: 0.875rem;
		padding: 0.5rem;
	}

	.add-more:hover {
		color: #88c0d0;
	}

	.actions {
		margin-top: 1rem;
	}

	button.primary {
		width: 100%;
		padding: 1rem;
		background: #88c0d0;
		color: #0d1b2a;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 600;
	}

	button.primary:hover {
		background: #9dd0e0;
	}

	/* Partner question */
	.partner-question {
		text-align: center;
	}

	.partner-question p {
		margin-bottom: 1rem;
		color: #e0e0e0;
	}

	.partner-options {
		display: flex;
		gap: 1rem;
	}

	.option {
		flex: 1;
		padding: 1rem;
		background: #1b2838;
		border: 1px solid #2d4a5e;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		color: #e0e0e0;
	}

	.option:hover {
		background: #243447;
		border-color: #88c0d0;
	}

	/* Premium offer */
	.premium-offer {
		text-align: center;
		background: linear-gradient(135deg, #2d4a3e 0%, #1b3830 100%);
		padding: 2rem;
		border-radius: 12px;
		margin-top: 1rem;
		border: 1px solid #3d6a5e;
	}

	.offer-badge {
		display: inline-block;
		background: #88c0d0;
		color: #0d1b2a;
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.premium-offer h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		color: #e0e0e0;
	}

	.premium-offer > p {
		color: #8899a6;
		margin: 0 0 1.5rem 0;
	}

	.pricing {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.old-price {
		text-decoration: line-through;
		color: #5a6a7a;
		font-size: 1rem;
	}

	.new-price {
		font-size: 2rem;
		font-weight: bold;
		color: #98c379;
	}

	.discount {
		background: #22c55e;
		color: #fff;
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
	}

	.once {
		font-size: 0.875rem;
		color: #8899a6;
		margin-bottom: 1.5rem;
	}

	.premium-btn {
		background: #98c379 !important;
		color: #0d1b2a !important;
	}

	.skip-link {
		background: none;
		border: none;
		color: #8899a6;
		cursor: pointer;
		font-size: 0.875rem;
		margin-top: 1rem;
		width: 100%;
	}

	.skip-link:hover {
		color: #88c0d0;
	}

	/* Skip form */
	.skip-form {
		margin-top: auto;
		padding-top: 2rem;
	}

	.skip {
		background: none;
		border: none;
		color: #5a6a7a;
		cursor: pointer;
		font-size: 0.875rem;
		width: 100%;
	}

	.skip:hover {
		color: #8899a6;
	}

	/* Habit block */
	.habit-block {
		background: #1b2838;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}

	.habit-block input[type='text'] {
		margin-bottom: 0.75rem;
	}

	.days-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.day-chip {
		padding: 0.4rem 0.6rem;
		background: #0d1b2a;
		border: 1px solid #2d4a5e;
		border-radius: 16px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
		color: #8899a6;
	}

	.day-chip:hover {
		border-color: #88c0d0;
	}

	.day-chip.selected {
		background: #88c0d0;
		color: #0d1b2a;
		border-color: #88c0d0;
	}

	/* Explanation step */
	.explanation-cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.explanation-card {
		background: #1b2838;
		padding: 1.25rem;
		border-radius: 12px;
		border: 1px solid #2d4a5e;
	}

	.explanation-card.habits-card {
		border-left: 3px solid #88c0d0;
	}

	.explanation-card.goals-card {
		border-left: 3px solid #98c379;
	}

	.card-icon {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.explanation-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		color: #e0e0e0;
	}

	.card-desc {
		font-size: 0.9rem;
		color: #8899a6;
		margin: 0 0 0.75rem 0;
	}

	.examples {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.examples li {
		font-size: 0.85rem;
		color: #6a8a9a;
		padding: 0.25rem 0;
		padding-left: 1rem;
		position: relative;
	}

	.examples li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: #5a7a8a;
	}
</style>
