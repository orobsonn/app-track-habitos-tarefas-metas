import { redirect, error } from '@sveltejs/kit';
import { createGoogleCalendarClient, generateId } from '$lib/server/auth';
import { googleCalendarTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	// Verificar se usuário está autenticado
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userId = locals.user.id;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('calendar_oauth_state');
	const codeVerifier = cookies.get('calendar_code_verifier');

	// Validar state e code
	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	const google = createGoogleCalendarClient(url.origin);

	try {
		// Trocar code por tokens
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);

		const accessToken = tokens.accessToken();
		const refreshToken = tokens.refreshToken();
		const expiresAt = tokens.accessTokenExpiresAt();

		if (!refreshToken) {
			error(400, 'No refresh token received. Please try again.');
		}

		// Verificar se já existe um registro para este usuário
		const existingToken = await locals.db
			.select()
			.from(googleCalendarTokens)
			.where(eq(googleCalendarTokens.userId, userId))
			.get();

		if (existingToken) {
			// Atualizar tokens existentes
			await locals.db
				.update(googleCalendarTokens)
				.set({
					accessToken,
					refreshToken,
					expiresAt: Math.floor(expiresAt.getTime() / 1000),
					isEnabled: 1
				})
				.where(eq(googleCalendarTokens.userId, userId));
		} else {
			// Criar novo registro
			await locals.db.insert(googleCalendarTokens).values({
				id: generateId(),
				userId,
				accessToken,
				refreshToken,
				expiresAt: Math.floor(expiresAt.getTime() / 1000),
				isEnabled: 1
			});
		}

		// Limpar cookies OAuth
		cookies.delete('calendar_oauth_state', { path: '/' });
		cookies.delete('calendar_code_verifier', { path: '/' });
	} catch (e) {
		console.error('Calendar OAuth error:', e);
		const errorMessage = e instanceof Error ? e.message : 'Unknown error';
		error(400, `Failed to connect Google Calendar: ${errorMessage}`);
	}

	// Redirecionar de volta para settings com mensagem de sucesso
	throw redirect(302, '/app/settings?calendar=connected');
};
