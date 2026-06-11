export default function useSlider(container, items) {
  const activeItem = ref(1)
  const targetSet = ref(false)

  const containerWidth = ref(null)
  const containerScrollWidth = ref(null)
  const itemOffsets = ref(null)

  const scrollPointsCount = computed(() =>
    (itemOffsets.value?.findIndex(
      (offset) => offset >= containerScrollWidth.value - containerWidth.value
    ) + 1) || 0
  )

  let scrollPos = 0
  let isDragging = false

  function onSliderScroll() {
    if (!container.value) return
    const scrollAmount = container.value.scrollLeft - scrollPos
    scrollPos = container.value.scrollLeft
    if (isDragging || targetSet.value) return

    const index = scrollPos / containerWidth.value + 1
    activeItem.value = scrollAmount > 0 ? Math.ceil(index) : Math.floor(index + 0.01)
  }

  function onSliderTouchStart() {
    isDragging = true
    targetSet.value = false
  }

  function onSliderTouchEnd() {
    isDragging = false
  }

  function goToSlide(index) {
    targetSet.value = true
    activeItem.value = index
  }

  function updateParameters() {
    containerWidth.value = container.value.offsetWidth
    containerScrollWidth.value = container.value.scrollWidth
    itemOffsets.value = items.value.map((item) => item.offsetLeft)
  }

  onMounted(() => {
    container.value?.addEventListener('scroll', onSliderScroll)
    container.value?.addEventListener('touchstart', onSliderTouchStart)
    container.value?.addEventListener('touchend', onSliderTouchEnd)
    window.addEventListener('resize', updateParameters)
    updateParameters()
  })

  onUnmounted(() => {
    container.value?.removeEventListener('scroll', onSliderScroll)
    container.value?.removeEventListener('touchstart', onSliderTouchStart)
    container.value?.removeEventListener('touchend', onSliderTouchEnd)
    window.removeEventListener('resize', updateParameters)
  })

  watch(
    activeItem,
    (item) => {
      if (targetSet.value) {
        container.value.scrollTo({ left: itemOffsets.value[item - 1], behavior: 'smooth' })
      }
    }
  )

  return { activeItem, scrollPointsCount, goToSlide }
}
