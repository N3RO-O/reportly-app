export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function formatDateLong(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getNextDay(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return formatDate(next);
}

export function getDayOfWeek(dateStr) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateStr + 'T00:00:00');
  return days[date.getDay()];
}

export function isFutureDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

export function isToday(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
}

export function generateAutoDay(dateStr) {
  return {
    date: dateStr,
    hours: 0,
    tasks: '',
    holiday: false,
    auto_generated: false,
  };
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function parseJSONSafe(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// Auto-generate next day after user enters hours
export function shouldAutoGenerateNextDay(currentDay, nextDay) {
  // Don't auto-generate if:
  // 1. Current day has no hours
  // 2. Next day already exists
  // 3. Next day is a holiday
  // 4. Next day is in the future

  if (!currentDay?.hours || currentDay.hours === 0) return false;
  if (nextDay) return false;
  if (isFutureDate(formatDate(new Date(new Date().toISOString().split('T')[0] + 'T00:00:00').getTime() + 86400000))) return false;

  return true;
}

export function getReportStats(days) {
  if (!days || !Array.isArray(days)) return { total: 0, byDay: {}, holidays: 0 };

  const stats = {
    total: 0,
    byDay: {},
    holidays: 0,
  };

  days.forEach(day => {
    if (day.holiday) {
      stats.holidays++;
    } else {
      stats.total += day.hours || 0;
      const dayName = getDayOfWeek(day.date);
      stats.byDay[dayName] = (stats.byDay[dayName] || 0) + (day.hours || 0);
    }
  });

  return stats;
}
