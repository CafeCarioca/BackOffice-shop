// Días para los descuentos por día (Semana Carioca). El índice coincide con el
// "weekday" del backend: 0 = domingo ... 6 = sábado (hora de Uruguay).
export const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// "" en el formulario = todos los días (null en el backend)
export const weekdayToForm = (weekday) => (weekday === null || weekday === undefined ? '' : String(weekday));
export const weekdayFromForm = (value) => (value === '' ? null : Number(value));
