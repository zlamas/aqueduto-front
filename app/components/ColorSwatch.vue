<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  size: {
    type: [String, Number],
    default: 28,
  },
  color: Object,
})

const colorData = {
  40: { invertCheckmark: true },
  45: { invertCheckmark: true },
  70: { invertCheckmark: true },
  71: { invertCheckmark: true },
  72: { invertCheckmark: true },
  75: { invertCheckmark: true },
}
</script>

<template>
  <button
    :class="{
      'swatch': true,
      'selected': selected,
    }"
    :style="{
      '--size': `${size}px`,
      background: `${color.hex} url(/images/colors/${color.code}.svg)`,
    }"
    :title="color.name"
  >
    <svg
      v-show="selected"
      :class="{
        'swatch-checkmark': true,
        'stroke-white': colorData[color.code]?.invertCheckmark
      }"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="black"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.1499 11.309L9.60879 14.7679L16.5388 7.8501" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<style>
.swatch {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  flex-shrink: 0;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.swatch:hover {
  outline-color: var(--color-neutral-300);
}

.swatch.selected {
  outline-color: var(--color-brand-950);
}

.swatch-checkmark {
  width: 75%;
  margin: auto;
}
</style>
