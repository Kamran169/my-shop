export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function formatOrderNumber(id: number): string {
  return `#TF-${String(id).padStart(6, '0')}`
}

export function formatStock(stock: number): string {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 5) return `Only ${stock} left!`
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

export function getStockColor(stock: number): string {
  if (stock === 0) return '#cc0000'
  if (stock <= 5) return '#cc0000'
  if (stock <= 10) return '#ff6600'
  return '#007700'
}
