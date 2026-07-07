export default function useSimpleSlider(container) {
  function scrollLeft() {
    container.value.scrollBy({ left: -1 })
  }

  function scrollRight() {
    container.value.scrollBy({ left: 1 })
  }

  return { scrollLeft, scrollRight }
}
