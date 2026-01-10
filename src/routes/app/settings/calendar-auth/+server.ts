import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { createGoogleCalendarClient } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
	// Verificar se usuário está autenticado
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const google = createGoogleCalendarClient(url.origin);

	// Scopes necessários para criar eventos no Calendar
	const scopes = [
		'https://www.googleapis.com/auth/calendar.events'
	];

	const authUrl = google.createAuthorizationURL(state, codeVerifier, scopes);

	// Adicionar access_type=offline para receber refresh_token
	authUrl.searchParams.set('access_type', 'offline');
	authUrl.searchParams.set('prompt', 'consent');

	const isProduction = url.origin.includes('workers.dev') || url.origin.includes('oritual.work');

	cookies.set('calendar_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
		secure: isProduction
	});

	cookies.set('calendar_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
		secure: isProduction
	});

	throw redirect(302, authUrl.toString());
};
