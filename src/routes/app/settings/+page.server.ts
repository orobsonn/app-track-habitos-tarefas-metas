import { users, googleCalendarTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '$lib/server/auth';
import { disconnectCalendar } from '$lib/server/google-calendar';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userId = requireAuth(locals);
	const user = await locals.db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.get();

	// Verificar status do Google Calendar
	const calendarToken = await locals.db
		.select()
		.from(googleCalendarTokens)
		.where(eq(googleCalendarTokens.userId, userId))
		.get();

	const hasCalendarConnected = !!calendarToken && calendarToken.isEnabled === 1;
	const calendarJustConnected = url.searchParams.get('calendar') === 'connected';

	return {
		affirmation: user?.affirmation ?? '',
		isPremium: user?.isPremium === 1,
		hasCalendarConnected,
		calendarJustConnected
	};
};

export const actions: Actions = {
	saveAffirmation: async ({ request, locals }) => {
		const userId = requireAuth(locals);
		const formData = await request.formData();
		const affirmation = formData.get('affirmation') as string;

		await locals.db
			.update(users)
			.set({ affirmation })
			.where(eq(users.id, userId));

		return { success: true };
	},

	disconnectCalendar: async ({ locals }) => {
		const userId = requireAuth(locals);
		await disconnectCalendar(locals.db, userId);
		return { success: true, calendarDisconnected: true };
	}
};
