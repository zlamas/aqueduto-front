<script setup>
defineProps({
  type: String,
  label: String,
  iconLeft: String,
  iconRight: {
    type: String,
    default: 'arrow-down',
  },
  bgColor: {
    type: String,
    default: 'var(--color-bg-tertiary)'
  },
  textColor: {
    type: String,
    default: 'var(--color-tertiary)'
  },
  contentClass: {
    type: String,
    default: ''
  },
})

const button = useTemplateRef('button')
const dropdown = useTemplateRef('dropdown')

const open = ref(false)
const popupPosition = ref(null)

watch(
  open,
  (value) => {
    if (value) {
      const buttonRect = button.value.getBoundingClientRect()

      const top = window.scrollY + buttonRect.bottom
      const left = Math.max(
        Math.min(
          window.scrollX + buttonRect.left,
          window.innerWidth - dropdown.value.offsetWidth,
        ),
        0
      )

      popupPosition.value = {
        top: `${top}px`,
        left: `${left}px`,
      }
    }
  }
)

onMounted(() => {
  document.body.addEventListener('pointerdown', (event) => {
    if (!button.value?.contains(event.target) && !dropdown.value?.contains(event.target)) {
      open.value = false
    }
  })
})
</script>

<template>
  <button
    ref="button"
    class="flex gap-[4px] items-center justify-between bg-(--bg) text-(--text) rounded-full p-[10px_16px] before:content-(--icon-left) before:leading-0 after:content-(--icon-right) after:leading-0"
    :style="{
      '--bg': bgColor,
      '--text': textColor,
      '--icon-left': iconLeft && `url(/images/${iconLeft}.svg)`,
      '--icon-right': iconRight && `url(/images/${iconRight}.svg)`,
     }"
    @click="open = !open"
  >
    <span :class="{ 'max-desktop:hidden': iconLeft }">
      {{ label }}
    </span>

    <Teleport to="body">
      <div
        ref="dropdown"
        :class="{
          'absolute top-0 mt-[8px] bg-white p-[16px] rounded-[20px] shadow-md z-999': true,
          [contentClass]: true,
          'invisible': !open
        }"
        :style="popupPosition"
      >
        <slot />
      </div>
    </Teleport>
  </button>
</template>

<style scoped>

</style>
