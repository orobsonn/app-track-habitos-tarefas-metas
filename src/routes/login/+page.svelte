<script lang="ts">
	import { onMount } from 'svelte';

	const quotes = [
		'"Disciplina é escolher entre o que você quer agora e o que você mais quer."',
		'"A jornada de mil milhas começa com um único passo." — Lao Tzu',
		'"Você não precisa ser perfeito, só precisa começar."',
		'"O sucesso é a soma de pequenos esforços repetidos dia após dia."',
		'"Não é sobre ter tempo, é sobre fazer tempo."',
		'"Grandes coisas são feitas por uma série de pequenas coisas reunidas." — Van Gogh',
		'"A melhor hora para plantar uma árvore foi há 20 anos. A segunda melhor é agora."',
		'"Foco não é dizer sim. É dizer não para centenas de boas ideias." — Steve Jobs'
	];

	let currentQuoteIndex = $state(0);
	let isVisible = $state(true);

	onMount(() => {
		const interval = setInterval(() => {
			isVisible = false;
			setTimeout(() => {
				currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
				isVisible = true;
			}, 500);
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Login - Rumo</title>
</svelte:head>

<main>
	<div class="logo-char">ᕙ(⇀‸↼‶)ᕗ</div>
	<h1>Rumo</h1>
	<p class="tagline">O rumo do seu dia depende do primeiro passo.</p>

	<a href="/login/google" class="google-btn">
		Entrar com Google
	</a>

	<div class="quote-container">
		<p class="quote" class:fade-out={!isVisible}>{quotes[currentQuoteIndex]}</p>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}

	.logo-char {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #e0e0e0;
	}

	.tagline {
		color: #8899a6;
		margin-bottom: 2rem;
	}

	.quote-container {
		margin-top: 3rem;
		min-height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quote {
		color: #88c0d0;
		font-size: 0.9rem;
		font-style: italic;
		max-width: 340px;
		text-align: center;
		line-height: 1.5;
		opacity: 1;
		transition: opacity 0.5s ease;
	}

	.quote.fade-out {
		opacity: 0;
	}

	.google-btn {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: #88c0d0;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		color: #0d1b2a;
		text-decoration: none;
		transition: background 0.2s;
		font-weight: 600;
	}

	.google-btn:hover {
		background: #9dd0e0;
		text-decoration: none;
	}
</style>
