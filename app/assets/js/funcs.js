export function formatNumber(number) {
  return parseFloat(number).toLocaleString('ru')
}

export function formatCurrency(sum) {
  return formatNumber(sum) + '₽'
}

export function filterQuery(items, field, query) {
  return items.filter((item) => item[field].toLowerCase().includes(query.toLowerCase()))
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
