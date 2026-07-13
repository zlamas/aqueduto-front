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
const hoverTimeoutDuration = 100

function positionDropdown() {
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

watch(
  open,
  (value) => {
    if (value) positionDropdown()
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
      :class="{
        [`button button-secondary rounded-full ${buttonClass}`]: true,
        'bg-neutral-200 outline -outline-offset-1 outline-neutral-400': open
      }"
    >
      <img
        v-if="iconLeft"
        class="min-w-[20px]"
        :src="`/images/${iconLeft}.svg`"
        alt=""
      >
      <span :class="{
        'whitespace-nowrap': true,
         'max-laptop:hidden': iconLeft
      }">
        {{ label }}
      </span>
      <img
        v-if="iconRight"
        :class="{ 'min-w-[20px]': true, 'rotate-180': open }"
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
