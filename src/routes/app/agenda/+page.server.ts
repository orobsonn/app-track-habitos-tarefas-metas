import { scheduledTasks, googleCalendarTokens } from '$lib/server/db/schema';
import { eq, and, isNull, gte } from 'drizzle-orm';
import { generateId, requireAuth } from '$lib/server/auth';
import { getTodayDateBrazil } from '$lib/server/date-utils';
import { createCalendarEvent, deleteCalendarEvent } from '$lib/server/google-calendar';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const today = getTodayDateBrazil();

	// Buscar tasks agendadas do usuário (apenas futuras e de hoje, não deletadas)
	const userScheduledTasks = await locals.db
		.select()
		.from(scheduledTasks)
		.where(
			and(
				eq(scheduledTasks.userId, userId),
				gte(scheduledTasks.scheduledDate, today),
				isNull(scheduledTasks.deletedAt)
			)
		)
		.orderBy(scheduledTasks.scheduledDate, scheduledTasks.scheduledTime);

	// Verificar se o usuário tem Google Calendar conectado
	const calendarToken = await locals.db
		.select()
		.from(googleCalendarTokens)
		.where(eq(googleCalendarTokens.userId, userId))
		.get();

	const hasCalendarConnected = !!calendarToken && calendarToken.isEnabled === 1;

	return {
		scheduledTasks: userScheduledTasks,
		hasCalendarConnected,
		today
	};
};

export const actions: Actions = {
	// Adicionar task agendada
	addScheduledTask: async ({ request, locals }) => {
		const userId = requireAuth(locals);
		const formData = await request.formData();

		const description = formData.get('description') as string;
		const notes = formData.get('notes') as string | null;
		const category = formData.get('category') as string;
		const scheduledDate = formData.get('scheduledDate') as string;
		const scheduledTime = formData.get('scheduledTime') as string | null;
		const durationStr = formData.get('duration') as string | null;
		const duration = durationStr ? parseInt(durationStr, 10) : 60;
		const addToCalendar = formData.get('addToCalendar') === 'true';

		if (!description || !scheduledDate) {
			return { error: 'Descrição e data são obrigatórios' };
		}

		let googleCalendarEventId: string | null = null;

		// Se marcou para adicionar ao Calendar e tem horário, criar evento
		if (addToCalendar && scheduledTime) {
			const eventId = await createCalendarEvent(locals.db, userId, {
				description,
				notes: notes || undefined,
				scheduledDate,
				scheduledTime,
				duration
			});
			googleCalendarEventId = eventId;
		}

		await locals.db.insert(scheduledTasks).values({
			id: generateId(),
			userId,
			description,
			notes: notes || null,
			category: category || 'personal',
			scheduledDate,
			scheduledTime: scheduledTime || null,
			duration,
			googleCalendarEventId
		});

		return { success: true };
	},

	// Toggle task agendada
	toggleScheduledTask: async ({ request, locals }) => {
		const userId = requireAuth(locals);
		const formData = await request.formData();
		const taskId = formData.get('taskId') as string;
		const completed = formData.get('completed') === 'true' ? 1 : 0;

		// Verificar se a task pertence ao usuário
		const task = await locals.db
			.select()
			.from(scheduledTasks)
			.where(and(eq(scheduledTasks.id, taskId), eq(scheduledTasks.userId, userId)))
			.get();

		if (!task) {
			return { error: 'Task not found' };
		}

		await locals.db
			.update(scheduledTasks)
			.set({ completed })
			.where(eq(scheduledTasks.id, taskId));

		return { success: true };
	},

	// Deletar task agendada
	deleteScheduledTask: async ({ request, locals }) => {
		const userId = requireAuth(locals);
		const formData = await request.formData();
		const taskId = formData.get('taskId') as string;

		// Verificar se a task pertence ao usuário
		const task = await locals.db
			.select()
			.from(scheduledTasks)
			.where(and(eq(scheduledTasks.id, taskId), eq(scheduledTasks.userId, userId)))
			.get();

		if (!task) {
			return { error: 'Task not found' };
		}

		// Se tiver evento no Calendar, deletar também
		if (task.googleCalendarEventId) {
			await deleteCalendarEvent(locals.db, userId, task.googleCalendarEventId);
		}

		await locals.db
			.update(scheduledTasks)
			.set({ deletedAt: new Date().toISOString() })
			.where(eq(scheduledTasks.id, taskId));

		return { success: true };
	}
};
