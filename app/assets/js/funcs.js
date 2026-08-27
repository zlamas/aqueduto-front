export function formatNumber(number) {
  const parsedNumber= parseFloat(number)
  return Number.isFinite(parsedNumber) ? parsedNumber.toLocaleString('ru') : ''
}

export function formatCurrency(sum) {
  const formattedNumber = formatNumber(sum)
  return formattedNumber ? formattedNumber + '₽' : 'по запросу'
}

export function filterQuery(query = '', items = [], field = null) {
  return items.filter((item) => {
    item = field ? item[field] : item
    return item.toLowerCase().includes(query.toLowerCase())
  })
}

export function debounce(func) {
  let timeoutId

  return (timeout, ...args)=> {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(
      () => func.apply(this, args),
      timeout
    )
  }
}

export function getDayOfWeek() {
  return new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
}
