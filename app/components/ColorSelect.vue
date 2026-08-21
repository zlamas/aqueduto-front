<script setup>
import Dropdown from "@/components/Dropdown.vue";
import ColorSwatch from "@/components/ColorSwatch.vue";

const props = defineProps({
  colors: {
    type: Array,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 28,
  },
  gap: {
    type: [Number, String],
    default: 4,
  }
})

const currentColor = defineModel()

const groupedColors = Object.groupBy(
  props.colors,
  (color) => color.on_order ? 'onOrder' : 'normal'
)
</script>

<template>
  <div class="flex flex-wrap items-center" :style="{ gap: `${gap}px` }">
    <ColorSwatch
      v-for="color in groupedColors.normal"
      :key="color.id"
      :color="color"
      :size="size"
      :selected="currentColor.id === color.id"
      :class="{
        'laptop:mx-[4px]': currentColor.id === color.id
      }"
      @click="currentColor = color"
    />

    <Dropdown
      v-if="groupedColors.onOrder"
      content-class="w-max max-w-[300px] grid gap-[8px] p-[8px] rounded-[16px] outline outline-neutral-100"
    >
      <template #button>
        <button
          class="swatch text-neutral-950 text-[12px] font-bold"
          :style="{
            '--size': `${size}px`,
            background: '#BFBFBF',
          }"
        >
          +{{ groupedColors.onOrder.length }}
        </button>
      </template>

      <div class="text-[14px] text-neutral-500">
        Цвета под заказ
      </div>

      <div class="flex flex-wrap gap-[4px]">
        <ColorSwatch
          v-for="color in groupedColors.onOrder"
          :key="color.id"
          :color="color"
          :size="size"
          :disabled="true"
          :selected="currentColor.id === color.id"
          :class="{
            'laptop:mx-[4px]': currentColor.id === color.id
          }"
          @click="currentColor = color"
        />
      </div>
    </Dropdown>
  </div>
</template>

<style scoped>

</style>
