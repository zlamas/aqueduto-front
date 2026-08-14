<script setup>
import ColorSelect from "@/components/ColorSelect.vue";
import {formatCurrency} from '@/assets/js/funcs';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  compareButton: {
    type: Boolean,
    default: true
  },
})

const { $api } = useNuxtApp()

const productCard = useTemplateRef('product-card')

defineExpose({productCard})

const currentColor = ref(props.product.colors?.find((color) => color.is_default))

const badge = computed(() => currentColor.value ? currentColor.value.badge : props.product.badge)
const badgeLabel = computed(() => currentColor.value ? currentColor.value.badge_label : props.product.badge_label)

const isFavorite = computed({
  get() {
    return currentColor.value?.is_favorite ?? props.product.is_favorite
  },
  set(newValue) {
    if (currentColor.value) {
      currentColor.value.is_favorite = newValue
    } else {
      props.product.is_favorite = newValue
    }
  }
})

const isInComparison = computed({
  get() {
    return currentColor.value?.is_in_comparison ?? props.product.is_in_comparison
  },
  set(newValue) {
    if (currentColor.value) {
      currentColor.value.is_in_comparison = newValue
    } else {
      props.product.is_in_comparison = newValue
    }
  }
})

function toggleFavorite() {
  $api(`/favorites/${props.product.id}`, {
    method: isFavorite.value ? 'DELETE' : 'POST',
    query: currentColor.value && { variant_id: currentColor.value.variant_id },
  })
    .then(() => isFavorite.value = !isFavorite.value)
}

function toggleComparison() {
  $api(`/comparison/${props.product.id}`, {
    method: isInComparison.value ? 'DELETE' : 'POST',
    query: currentColor.value && { variant_id: currentColor.value.variant_id },
  })
    .then(() => isInComparison.value = !isInComparison.value)
}
</script>

<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    ref="product-card"
    class="slider-item group/card gap-0 grid-rows-[auto_1fr] grid-cols-[100%] rounded-[20px] laptop:rounded-[28px] hover:shadow-md active:shadow-md">
    <div
      :class="{
        'group/image relative rounded-[16px] laptop:rounded-[28px] bg-backdrop overflow-hidden': true,
        [`product-${badge}`]: badge
      }"
    >
      <img
        :src="currentColor?.image || product.image"
        class="relative size-full object-contain z-9"
        alt=""
      >
      <img
        v-if="currentColor?.image_hover || product.image_hover"
        :src="currentColor?.image_hover || product.image_hover"
        class="absolute inset-0 size-full object-contain group-hover/image:z-19"
        alt=""
      >
      <div
        v-if="badge"
        class="absolute top-[8px] left-[8px] laptop:top-[16px] laptop:left-[16px] flex items-center gap-[4px] rounded-full bg-(--bg) text-[14px]/[20px] text-white font-semibold p-[4px_12px_4px_8px] before:content-(--icon) before:leading-0 z-99"
      >
        {{ badgeLabel }}
      </div>
      <button
        class="group absolute size-[44px] max-laptop:bottom-[8px] max-laptop:right-[8px] laptop:top-[16px] laptop:right-[16px] laptop:invisible group-hover/card:visible bg-neutral-50 rounded-full z-99"
        @click.prevent="toggleFavorite"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          :class="{
            'favorite-icon m-auto group-hover:fill-current group-hover:scale-[calc(28/24)] ': true,
            'text-neutral-400': !isFavorite,
            'active text-brand-950 group-hover:text-neutral-400': isFavorite,
          }"
          :fill="isFavorite ? 'currentColor' : 'transparent'"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.6289 6.14648C14.4826 4.28491 17.4862 4.28491 19.3398 6.14648C21.553 8.36915 21.5531 11.9736 19.3398 14.1963L18.8613 14.6777L18.8281 14.7109L18.7988 14.748C18.7798 14.7727 18.7593 14.7973 18.7363 14.8203C16.9863 16.5778 15.2323 18.3306 13.4785 20.0869C12.5972 20.9695 11.1664 20.9689 10.2871 20.0859L5.04297 14.8203C5.02016 14.7974 4.9994 14.7735 4.98047 14.749L4.95215 14.7109L4.91895 14.6777L4.66016 14.418C2.44694 12.1953 2.44693 8.59082 4.66016 6.36816C6.44974 4.57095 9.3117 4.50905 11.1748 6.18164C11.5736 6.53952 12.2149 6.56218 12.6289 6.14648Z"
            class="transition-[inherit]"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>

    <div class="grid gap-[16px] grid-rows-[1fr] grid-cols-[100%] p-[8px] laptop:p-[16px]">
      <div class="grid gap-[8px] content-start">
        <div class="font-semibold laptop:text-[20px]/[32px]">
          {{ product.name }}
        </div>

        <div class="justify-self-start bg-neutral-100 rounded-full p-[4px_12px] font-medium laptop:hidden">
          {{ product.collection.name }}
        </div>
      </div>

      <ColorSelect
        :colors="product.colors"
        v-model="currentColor"
        @click.prevent
      />

      <div class="flex items-center justify-between max-laptop:flex-col gap-[12px] text-[14px] max-laptop:hidden">
        <div class="bg-neutral-100 rounded-full p-[4px_12px] font-medium">
          {{ product.collection.name }}
        </div>

        <div class="text-neutral-500">
          Арт. {{ currentColor?.article || product.article }}
        </div>
      </div>

      <div class="flex items-center">
        <h4>
          {{ formatCurrency(currentColor?.price || product.price) }}
        </h4>

        <button
          v-if="compareButton"
          class="button button-secondary rounded-[10px] p-[12px] laptop:py-[10px] ml-auto before:content-[url(~/assets/icons/compare-button.svg)] before:leading-0"
          @click.prevent="toggleComparison"
        >
          <span class="max-laptop:hidden">
            {{ isInComparison ? 'В сравнении' : 'Сравнить' }}
          </span>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.favorite-icon {
  transition: scale cubic-bezier(0.5, 3, 0.5, 0), color linear;
  transition-duration: 0.1s;
}

.favorite-icon.active {
  animation: like-bounce cubic-bezier(0.5, 3, 0.5, 0), like-color ease-out;
  animation-duration: 0.4s;
}

.favorite-icon:not(.active) {
  animation: dislike-bounce cubic-bezier(0.5, 3, 0.5, 0), dislike-color linear;
  animation-duration: 0.5s;
}

.product-new {
  --bg: var(--color-tag-new-bg);
  --icon: url(~/assets/icons/product-new.svg);
}

.product-promo {
  --bg: var(--color-tag-promo-bg);
  --icon: url(~/assets/icons/product-promo.svg);
}

.product-soon {
  --bg: var(--color-tag-soon-bg);
  --icon: url(~/assets/icons/product-soon.svg);
}
</style>
