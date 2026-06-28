export function validateProduct(data: {
  name: string
  code: string
  price: number
  stock: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters')
  }
  if (!data.code || data.code.trim().length < 3) {
    errors.push('Product code must be at least 3 characters')
  }
  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0')
  }
  if (data.stock < 0) {
    errors.push('Stock cannot be negative')
  }

  return { valid: errors.length === 0, errors }
}
