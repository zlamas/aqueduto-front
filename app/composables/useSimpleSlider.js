export default function useSimpleSlider(refs){
  const containers = computed(() =>
    refs.value.forEach ? refs.value : [refs.value]
  )

  function scrollLeft() {
    containers.value.forEach((container) => container.scrollBy({ left: -1 }))
  }

  function scrollRight() {
    containers.value.forEach((container) => container.scrollBy({ left: 1 }))
  }

  // onMounted(() => {
  //   containers.value.forEach((container) =>
  //     container.addEventListener("scroll", () => {
  //       containers.value.forEach((el) =>
  //         console.log(el !== container && el.scrollTo({ left: container.scrollLeft }))
  //       )
  //     })
  //   )
  // })

  return { scrollLeft, scrollRight }
}
