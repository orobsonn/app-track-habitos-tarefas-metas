import type { Handle } from '@sveltejs/kit';
import { createDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	// Inicializa o banco de dados
	if (event.platform?.env.DB) {
		event.locals.db = createDb(event.platform.env.DB);
	}

	// Verificar sessão
	const sessionCookie = event.cookies.get('session');

	if (sessionCookie && event.locals.db) {
		const [userId, sessionToken] = sessionCookie.split(':');

		// Validar que ambos userId e sessionToken existem
		if (userId && sessionToken) {
			try {
				// Buscar usuário E validar o sessionToken
				const user = await event.locals.db
					.select({
						id: users.id,
						email: users.email,
						name: users.name,
						sessionToken: users.sessionToken
					})
					.from(users)
					.where(and(eq(users.id, userId), eq(users.sessionToken, sessionToken)))
					.get();

				if (user) {
					event.locals.user = {
						id: user.id,
						email: user.email,
						name: user.name
					};
				}
			} catch (e) {
				console.error('Session error:', e);
			}
		}
	}

	if (!event.locals.user) {
		event.locals.user = null;
	}

	return resolve(event);
};
