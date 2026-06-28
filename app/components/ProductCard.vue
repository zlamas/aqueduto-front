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
  <div
    ref="product-card"
    class="slider-item group grid-rows-[auto_1fr] text-primary rounded-[28px] hover:shadow-[0_6px_24px_#0000001F]">
    <div
      :class="{
        'relative desktop:h-[334px] rounded-[16px] desktop:rounded-[28px] max-desktop:bg-[#F8F8FA] overflow-hidden': true,
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
        class="absolute inset-0 size-full object-contain group-hover:z-19"
        alt=""
      >
      <div v-if="badge" class="absolute top-[8px] left-[8px] desktop:top-[16px] desktop:left-[16px] flex items-center gap-[4px] rounded-full bg-(--bg) text-[12px]/[16px] desktop:text-[14px]/[20px] text-[#FCFCFD] font-semibold p-[4px_10px] desktop:p-[6px_12px] before:content-(--icon) before:leading-0 z-99">
        {{ badge_label }}
      </div>
      <button
        class="absolute max-desktop:bottom-[8px] max-desktop:right-[8px] desktop:top-[16px] desktop:right-[16px] desktop:invisible group-hover:visible bg-[#F8FAFC] rounded-full p-[8px] z-99"
        @click="toggleFavorite"
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
      <button
        v-if="compareButton"
        class="button-rounded absolute bottom-[16px] right-[16px] invisible group-hover:visible bg-[#1E293B] text-[#FCFCFD] p-[8px_16px] before:content-[url(~/assets/icons/compare-white.svg)] before:leading-0 z-99"
        @click="toggleComparison"
      >
        {{ isInComparison ? 'В сравнении' : 'Сравнить' }}
      </button>
    </div>

    <div class="grid gap-[12px] grid-rows-[1fr] desktop:p-[16px] max-desktop:text-center">
      <NuxtLink :to="`/product/${slug}`" class="self-center font-semibold hover:text-[#2563EB] active:text-[#1D4ED8]">
        {{ name }}
       </NuxtLink>

      <div class="flex items-center justify-between max-desktop:flex-col gap-[12px] text-[14px]">
        <div class="bg-[#F1F5F9] rounded-full p-[4px_12px] font-medium">
          {{ collection.name }}
        </div>

        <div class="text-quaternary">
          Арт. {{ currentColorData?.article || article }}
        </div>
      </div>

      <div class="flex items-center justify-center max-desktop:px-[8px]">
        <h6 class="m-0">
          {{ formatCurrency(currentColorData?.price || price) }}
        </h6>

        <ColorSelect
          :colors="colors"
          v-model="currentColor"
          class="ml-auto max-desktop:hidden"
        />

        <button
          v-if="compareButton"
          class="bg-[#E9F4F6] rounded-[8px] p-[10px] ml-auto shrink-0 desktop:hidden"
          @click="toggleComparison"
        >
          <img
            v-if="isInComparison"
            src="~/assets/icons/trash.svg"
            alt=""
          >
          <img
            v-else
            src="~/assets/icons/compare.svg"
            alt=""
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-new {
  --bg: #EC4899;
  --icon: url(~/assets/icons/product-new.svg);
}

.product-promo {
  --bg: #F43F5E;
  --icon: url(~/assets/icons/product-promo.svg);
}

.product-soon {
  --bg: #7F56D9;
  --icon: url(~/assets/icons/product-soon.svg);
}
</style>
