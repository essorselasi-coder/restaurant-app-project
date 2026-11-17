export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}