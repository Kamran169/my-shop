export const CURRENCY_SYMBOL = '£'
export const VAT_RATE = 0.2
export const FREE_DELIVERY_THRESHOLD = 50

export function formatPrice(price: number): string {
  return `${CURRENCY_SYMBOL}${price.toFixed(2)}`
}

export function calculateVAT(priceIncVAT: number): number {
  return priceIncVAT * VAT_RATE / (1 + VAT_RATE)
}

export function excludeVAT(priceIncVAT: number): number {
  return priceIncVAT - calculateVAT(priceIncVAT)
}

export function isFreeDelivery(total: number): boolean {
  return total >= FREE_DELIVERY_THRESHOLD
}
