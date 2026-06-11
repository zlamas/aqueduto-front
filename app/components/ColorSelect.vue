<script setup>
defineProps({
  colors: {
    type: Array,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 32,
  },
  gap: {
    type: [Number, String],
    default: 4,
  }
})

const currentColor = defineModel()
</script>

<template>
  <div class="flex" :style="{ gap: `${gap}px` }">
    <button
      v-for="color in colors"
      :key="color.id"
      :class="{
        'swatch': true,
        'selected': currentColor === color.id,
        'border': color.hex === '#FFFFFF',
      }"
      :style="{
        '--size': `${size}px`,
        '--bg': color.hex,
      }"
      :title="color.name"
      @click="currentColor = color.id"
    >
      <svg
        v-show="currentColor === color.id"
        class="swatch-checkmark"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.1499 11.309L9.60879 14.7679L16.5388 7.8501" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.swatch {
  width: var(--size);
  height: var(--size);
  background: var(--bg);
  border-color: #CBD5E1;
  border-radius: 50%;
  flex-shrink: 0;
}

.swatch-checkmark {
  width: 80%;
  height: 80%;
  margin: auto;
  stroke: contrast-color(var(--bg));
}
</style>
