<script setup>
const props = defineProps({
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
        backgroundColor: color.hex,
      }"
      :title="color.name"
      @click="currentColor = color.id"
    ></button>
  </div>
</template>

<style scoped>
.swatch {
  width: var(--size);
  height: var(--size);
  background-position: center;
  background-size: 80%;
  background-repeat: no-repeat;
  border-color: #CBD5E1;
  border-radius: 50%;
  flex-shrink: 0;
}

.swatch.selected {
  background-image: url(~/assets/icons/checkmark.svg);
}
</style>
