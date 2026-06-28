export default function useSimpleSlider(refs){
  const containers = computed(() =>
    Array.isArray(refs.value) ? refs.value : [refs.value]
  )

  function scrollLeft() {
    containers.value.forEach((container) => container.scrollBy({ left: -1 }))
  }

  function scrollRight() {
    containers.value.forEach((container) => container.scrollBy({ left: 1 }))
  }

  return { scrollLeft, scrollRight }
}
