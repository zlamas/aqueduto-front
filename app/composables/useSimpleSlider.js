export default function useSimpleSlider(container) {
  const scrollEdge = ref('left')

  function scrollLeft() {
    container.value.scrollBy({ left: -1 })
  }

  function scrollRight() {
    container.value.scrollBy({ left: 1 })
  }

  function updateScrollEdge(event) {
    if (event.target.scrollLeft === 0) {
      scrollEdge.value = 'left'
    } else if (event.target.scrollLeft + event.target.offsetWidth === event.target.scrollWidth) {
      scrollEdge.value = 'right'
    } else {
      scrollEdge.value = null
    }
  }

  onMounted(() => container.value?.addEventListener('scroll', updateScrollEdge))

  return { scrollLeft, scrollRight, scrollEdge }
}
