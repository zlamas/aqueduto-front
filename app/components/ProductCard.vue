<script setup>
import ColorSelect from "@/components/ColorSelect.vue";
import {formatCurrency} from '@/assets/js/funcs';
import {useAPI} from "@/composables/useAPI.js";

const props = defineProps({
  id: Number,
  name: String,
  slug: String,
  article: String,
  price: [Number, String],
  old_price: [Number, String],
  badge: String,
  badge_label: String,
  collection: Object,
  image: String,
  image_hover: String,
  colors: Array,
  is_favorite: Boolean,
  is_in_comparison: Boolean,
  compareButton: {
    type: Boolean,
    default: true
  },
})

const productCard = useTemplateRef('product-card')

defineExpose({productCard})

const isFavorite = ref(props.is_favorite)
const isInComparison = ref(props.is_in_comparison)

function toggleFavorite() {
  useAPI(`/favorites/${props.id}`, { method: isFavorite.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isFavorite.value = !isFavorite.value
    })
}

function toggleComparison() {
  useAPI(`/comparison/${props.id}`, { method: isInComparison.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isInComparison.value = !isInComparison.value
    })
}

const currentColor = ref(props.colors?.find((color) => color.is_default)?.variant_id)

const currentColorData = computed(() => props.colors?.find((color) => currentColor.value === color.variant_id))
</script>

<template>
  <NuxtLink
    :to="`/product/${slug}`"
    ref="product-card"
    class="slider-item group/card gap-0 grid-rows-[auto_1fr] rounded-[20px] desktop:rounded-[28px] hover:shadow-md active:shadow-md">
    <div
      :class="{
        'group/image relative rounded-[16px] desktop:rounded-[28px] bg-backdrop overflow-hidden': true,
        [`product-${badge}`]: badge,
      }"
    >
      <img
        :src="currentColorData?.image || image"
        class="relative size-full object-contain z-9"
        alt=""
      >
      <img
        v-if="image_hover"
        :src="image_hover"
        class="absolute inset-0 size-full object-contain group-hover/image:z-19"
        alt=""
      >
      <div v-if="badge" class="absolute top-[8px] left-[8px] desktop:top-[16px] desktop:left-[16px] flex items-center gap-[4px] rounded-full bg-(--bg) text-[12px]/[16px] desktop:text-[14px]/[20px] text-white font-semibold p-[4px_10px] desktop:p-[6px_12px] before:content-(--icon) before:leading-0 z-99">
        {{ badge_label }}
      </div>
      <button
        class="absolute max-desktop:bottom-[8px] max-desktop:right-[8px] desktop:top-[16px] desktop:right-[16px] desktop:invisible group-hover/card:visible bg-neutral-50 rounded-full p-[8px] z-99"
        @click.prevent="toggleFavorite"
      >
        <img
          v-if="isFavorite"
          src="~/assets/icons/favorite-full.svg"
          alt=""
        >
        <img
          v-else
          src="~/assets/icons/favorite.svg"
          alt=""
        >
      </button>
    </div>

    <div class="grid gap-[16px] grid-rows-[1fr] p-[8px] desktop:p-[16px]">
      <div class="grid gap-[8px] content-start">
        <div class="font-semibold desktop:text-[20px]/[32px]">
          {{ name }}
        </div>

        <div class="justify-self-start bg-neutral-100 rounded-full p-[4px_12px] font-medium desktop:hidden">
          {{ collection.name }}
        </div>
      </div>

      <ColorSelect
        :colors="colors"
        v-model="currentColor"
        @click.prevent
      />

      <div class="flex items-center justify-between max-desktop:flex-col gap-[12px] text-[14px] max-desktop:hidden">
        <div class="bg-neutral-100 rounded-full p-[4px_12px] font-medium">
          {{ collection.name }}
        </div>

        <div class="text-neutral-500">
          Арт. {{ currentColorData?.article || article }}
        </div>
      </div>

      <div class="flex items-center">
        <h4>
          {{ formatCurrency(currentColorData?.price || price) }}
        </h4>

        <button
          v-if="compareButton"
          class="button button-secondary rounded-[10px] p-[12px] desktop:py-[10px] ml-auto before:content-[url(~/assets/icons/compare-button.svg)] before:leading-0"
          @click.prevent="toggleComparison"
        >
          <span class="max-desktop:hidden">
            {{ isInComparison ? 'В сравнении' : 'Сравнить' }}
          </span>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.product-new {
  --bg: var(--color-tag-new-bg);
  --icon: url(~/assets/icons/product-new.svg);
}

.product-sale {
  --bg: var(--color-tag-sale-bg);
  --icon: url(~/assets/icons/product-sale.svg);
}

.product-coming-soon {
  --bg: var(--color-tag-coming-soon-bg);
  --icon: url(~/assets/icons/product-coming-soon.svg);
}
</style>
