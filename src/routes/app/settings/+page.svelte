<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let saved = $state(false);
	let calendarDisconnecting = $state(false);
</script>

<svelte:head>
	<title>Configurações - Ritual</title>
</svelte:head>

<main>
	<header>
		<a href="/app" class="back">&larr;</a>
		<h1>Configurações</h1>
	</header>

	<section class="section">
		<h2>Afirmação diária</h2>
		<p class="description">Esta afirmação aparecerá na seção "Manhã" do seu diário.</p>

		<form
			method="POST"
			action="?/saveAffirmation"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					saved = true;
					setTimeout(() => (saved = false), 2000);
				};
			}}
		>
			<textarea
				name="affirmation"
				placeholder="Ex: Eu sou capaz de alcançar meus objetivos."
				value={data.affirmation}
			></textarea>

			<div class="actions">
				<button type="submit">Salvar</button>
				{#if saved}
					<span class="saved">Salvo!</span>
				{/if}
			</div>
		</form>
	</section>

	<section class="section calendar-section">
		<h2>Google Calendar</h2>
		<p class="description">
			Conecte seu Google Calendar para exportar tarefas agendadas e receber notificações.
		</p>

		{#if data.calendarJustConnected}
			<div class="success-message">
				Google Calendar conectado com sucesso!
			</div>
		{/if}

		{#if data.hasCalendarConnected}
			<div class="calendar-status connected">
				<span class="status-icon">✓</span>
				<span>Google Calendar conectado</span>
			</div>
			<form
				method="POST"
				action="?/disconnectCalendar"
				use:enhance={() => {
					calendarDisconnecting = true;
					return async ({ update }) => {
						await update();
						calendarDisconnecting = false;
					};
				}}
			>
				<button type="submit" class="disconnect-btn" disabled={calendarDisconnecting}>
					{calendarDisconnecting ? 'Desconectando...' : 'Desconectar'}
				</button>
			</form>
		{:else}
			<a href="/app/settings/calendar-auth" class="connect-btn">
				Conectar Google Calendar
			</a>
		{/if}
	</section>

	<section class="section">
		<h2>Conta</h2>
		<div class="account-info">
			<p>
				<strong>Status:</strong>
				{#if data.isPremium}
					<span class="premium-badge">Premium</span>
				{:else}
					<span class="free-badge">Gratuito</span>
				{/if}
			</p>

			{#if !data.isPremium}
				<p class="upgrade-info">
					Desbloqueie metas e hábitos de casal com o plano Premium.
				</p>
				<form method="POST" action="/api/stripe/checkout">
					<button type="submit" class="upgrade-btn">
						Desbloquear Premium - R$ 47
					</button>
				</form>
			{/if}
		</div>
	</section>

	<section class="section danger">
		<h2>Sair</h2>
		<form method="POST" action="/logout">
			<button type="submit" class="logout-btn">Sair da conta</button>
		</form>
	</section>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
		padding-top: 4rem;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(13, 27, 42, 0.85);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(45, 74, 94, 0.5);
		z-index: 100;
		max-width: 600px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.back {
		font-size: 1.5rem;
		text-decoration: none;
		color: #88c0d0;
	}

	h1 {
		font-size: 1.25rem;
		margin: 0;
		color: #e0e0e0;
	}

	h2 {
		font-size: 1rem;
		margin: 0 0 0.5rem 0;
		color: #e0e0e0;
	}

	.section {
		background: #1b2838;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.description {
		font-size: 0.875rem;
		color: #8899a6;
		margin: 0 0 1rem 0;
	}

	textarea {
		width: 100%;
		min-height: 100px;
		padding: 0.75rem;
		background: #0d1b2a;
		border: 1px solid #2d4a5e;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
		box-sizing: border-box;
		margin-bottom: 0.5rem;
		color: #e0e0e0;
	}

	textarea:focus {
		outline: none;
		border-color: #88c0d0;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	button[type='submit'] {
		padding: 0.5rem 1rem;
		background: #88c0d0;
		color: #0d1b2a;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
	}

	button[type='submit']:hover {
		background: #9dd0e0;
	}

	.saved {
		color: #98c379;
		font-size: 0.875rem;
	}

	.account-info p {
		margin: 0 0 0.5rem 0;
		color: #e0e0e0;
	}

	.premium-badge {
		background: #fbbf24;
		color: #000;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.free-badge {
		background: #2d4a5e;
		color: #8899a6;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.upgrade-info {
		font-size: 0.875rem;
		color: #8899a6;
	}

	.upgrade-btn {
		width: 100%;
		padding: 0.75rem;
		background: #88c0d0;
		color: #0d1b2a;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 0.5rem;
		font-weight: 600;
	}

	.upgrade-btn:hover {
		background: #9dd0e0;
	}

	.danger {
		border: 1px solid #4a2a2a;
		background: #2a1a1a;
	}

	.logout-btn {
		background: #e06c75 !important;
		color: #fff !important;
	}

	.logout-btn:hover {
		background: #c95f67 !important;
	}

	/* Calendar section styles */
	.calendar-section .description {
		margin-bottom: 1rem;
	}

	.success-message {
		background: rgba(152, 195, 121, 0.15);
		border: 1px solid #98c379;
		color: #98c379;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.calendar-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.calendar-status.connected {
		background: rgba(136, 192, 208, 0.1);
		border: 1px solid #88c0d0;
		color: #88c0d0;
	}

	.status-icon {
		font-size: 1rem;
	}

	.connect-btn {
		display: block;
		text-align: center;
		padding: 0.75rem;
		background: #4285f4;
		color: #fff;
		border: none;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
	}

	.connect-btn:hover {
		background: #3367d6;
	}

	.disconnect-btn {
		width: 100%;
		padding: 0.5rem;
		background: transparent;
		color: #8899a6;
		border: 1px solid #2d4a5e;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.disconnect-btn:hover {
		background: rgba(224, 108, 117, 0.1);
		border-color: #e06c75;
		color: #e06c75;
	}

	.disconnect-btn:disabled {
		opacity: 0.5;
		cursor: wait;
	}
</style>
