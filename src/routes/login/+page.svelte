<script lang="ts">
	// Página de login
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

	<p class="quote">"Disciplina é escolher entre o que você quer agora e o que você mais quer."</p>
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

	.quote {
		margin-top: 3rem;
		color: #5a6a7a;
		font-size: 0.875rem;
		font-style: italic;
		max-width: 300px;
		text-align: center;
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
