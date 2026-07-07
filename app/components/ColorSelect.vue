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
</script>

<template>
  <div class="flex items-center" :style="{ gap: `${gap}px` }">
    <ColorSwatch
      v-for="color in colors.slice(0, 4)"
      :key="color.id"
      :color="color"
      :size="size"
      :selected="currentColor === color.variant_id"
      @click="currentColor = color.variant_id"
    />

    <Dropdown
      v-if="colors.length > 4"
      content-class="flex flex-wrap gap-[4px] p-[8px] rounded-[16px] border border-neutral-100"
    >
      <template #button>
        <button
          class="swatch text-neutral-950 text-[12px] font-bold"
          :style="{
            '--size': `${size}px`,
            background: '#BFBFBF',
          }"
        >
          +{{ colors.length - 4 }}
        </button>
      </template>

      <ColorSwatch
        v-for="color in colors.slice(4)"
        :key="color.id"
        :color="color"
        :size="size"
        :selected="currentColor === color.variant_id"
        @click="currentColor = color.variant_id"
      />
    </Dropdown>
  </div>
</template>

<style scoped>

</style>
