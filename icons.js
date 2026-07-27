const icons = {
  land: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20h18M5 20V10l7-6 7 6v10M9 20v-6h6v6"/></svg>',
  house: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5M5 10v9.5h14V10M9.5 19.5v-6h5v6"/></svg>',
  car: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16V11l2-5h12l2 5v5M2 16h20M6.5 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM17.5 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg>',
  sound: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/></svg>',
  decoration: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v4M12 22v-6M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/></svg>',
  default: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>',
};

function categoryIcon(name) {
  return icons[name] || icons.default;
}

module.exports = { categoryIcon };
