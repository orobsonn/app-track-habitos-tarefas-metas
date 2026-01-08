/**
 * Utilitários de data para timezone Brasil (America/Sao_Paulo)
 */

const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna a data de hoje no formato YYYY-MM-DD usando timezone Brasil
 */
export function getTodayDateBrazil(): string {
	return new Date().toLocaleDateString('en-CA', { timeZone: BRAZIL_TIMEZONE });
}

/**
 * Retorna o range de datas da semana atual (segunda a domingo) usando timezone Brasil
 */
export function getWeekDateRangeBrazil(): { start: string; end: string } {
	const now = new Date();
	const brazilDateStr = now.toLocaleDateString('en-CA', { timeZone: BRAZIL_TIMEZONE });
	const [year, month, day] = brazilDateStr.split('-').map(Number);

	// Criar data no timezone local para cálculos
	const currentDate = new Date(year, month - 1, day);
	const currentWeekDay = currentDate.getDay(); // 0 = domingo

	// Ajustar para segunda como início (0 = segunda, 6 = domingo)
	const mondayOffset = currentWeekDay === 0 ? -6 : 1 - currentWeekDay;

	const monday = new Date(currentDate);
	monday.setDate(currentDate.getDate() + mondayOffset);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	return {
		start: monday.toISOString().split('T')[0],
		end: sunday.toISOString().split('T')[0]
	};
}

/**
 * Retorna o range de datas do mês atual usando timezone Brasil
 */
export function getMonthDateRangeBrazil(): { start: string; end: string } {
	const now = new Date();
	const brazilDateStr = now.toLocaleDateString('en-CA', { timeZone: BRAZIL_TIMEZONE });
	const [year, month] = brazilDateStr.split('-').map(Number);

	const firstDay = new Date(year, month - 1, 1);
	const lastDay = new Date(year, month, 0);

	return {
		start: firstDay.toISOString().split('T')[0],
		end: lastDay.toISOString().split('T')[0]
	};
}

/**
 * Retorna o dia da semana atual (0 = segunda, 6 = domingo) usando timezone Brasil
 */
export function getCurrentWeekDayBrazil(): number {
	const now = new Date();
	const brazilDateStr = now.toLocaleDateString('en-CA', { timeZone: BRAZIL_TIMEZONE });
	const [year, month, day] = brazilDateStr.split('-').map(Number);

	const currentDate = new Date(year, month - 1, day);
	const jsDay = currentDate.getDay(); // 0 = domingo em JS

	// Converter para 0 = segunda, 6 = domingo
	return jsDay === 0 ? 6 : jsDay - 1;
}
