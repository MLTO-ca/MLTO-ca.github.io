export function formatDateToStr(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export function getTimeZoneAbbr(date, timeZone = 'America/Toronto') {
  const tzOptions = { timeZone, timeZoneName: 'short' };
  return new Intl.DateTimeFormat('en-CA', tzOptions)
    .formatToParts(date)
    .find(part => part.type === 'timeZoneName')?.value || '';
}

export function enhanceTodayCell() {
  document.querySelectorAll('[data-vc-date-today] .vc-date__btn').forEach(btn => {
    btn.setAttribute('title', 'Today');
    btn.setAttribute('aria-current', 'date');
    const dateLabel = btn.getAttribute('aria-label');
    if (dateLabel) {
      btn.setAttribute('aria-label', `Today, ${dateLabel}`);
    } else {
      btn.setAttribute('aria-label', 'Today');
    }
  });
}