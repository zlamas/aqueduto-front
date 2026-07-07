<script setup>
const props = defineProps({
  label: String,
  iconLeft: String,
  iconRight: {
    type: String,
    default: 'arrow-down',
  },
  buttonClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: ''
  },
  hover: {
    type: Boolean,
    default: false
  },
  closeOnClick: {
    type: Boolean,
    default: false
  }
})

const button = useTemplateRef('button')
const dropdown = useTemplateRef('dropdown')

const open = ref(false)
const popupPosition = ref(null)

let hoverTimeout = null
const hoverTimeoutDuration = 200

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

function onPointerEnter() {
  if (!props.hover) return

  clearTimeout(hoverTimeout)
  open.value = true
}

function onPointerLeave() {
  if (!props.hover) return

  hoverTimeout = setTimeout(
    () => open.value = false,
    hoverTimeoutDuration
  )
}
</script>

<template>
  <div
    ref="button"
    @click="!hover && (open = !open)"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <slot v-if="$slots.button" name="button" />

    <button
      v-else
      :class="`button button-secondary rounded-full ${buttonClass}`"
    >
      <img v-if="iconLeft" :src="`/images/${iconLeft}.svg`" alt="">
      <span :class="{ 'max-desktop:hidden': iconLeft }">
        {{ label }}
      </span>
      <img
        v-if="iconRight"
        :class="{ 'rotate-180': open }"
        :src="`/images/${iconRight}.svg`"
        alt=""
      >
    </button>

    <Teleport to="body">
      <div
        ref="dropdown"
        :class="{
          [`absolute top-0 mt-[8px] bg-white shadow-md z-999 ${contentClass}`]: true,
          'invisible': !open,
        }"
        :style="popupPosition"
        @pointerenter="onPointerEnter"
        @pointerleave="onPointerLeave"
        @click="closeOnClick && (open = false)"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

</style>
