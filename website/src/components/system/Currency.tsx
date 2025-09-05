function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value)
}

export default function Currency({ value }: { value: number }) {
  return formatCurrency(value)
}
