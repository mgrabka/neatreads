export const getTimeAgo = (date: Date) => {
  const now = new Date().getTime()
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000)
  const minutes = Math.floor(diffInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (diffInSeconds < 60) return "less than a minute"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return `${weeks}w`
}
