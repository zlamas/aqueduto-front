<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const { slug } = useRoute().params

const productsParams = ref({
  page: 1,
  per_page: 6,
})
const productsMeta = ref(null)
const products = ref([])

const { data: promotionData } = await useAPI(`/promotions/${slug}`, {
  query: productsParams.value,

  onResponse({ response }) {
    products.value.push(...response._data.data.products)
    productsMeta.value = response._data.data.products_meta
  }
})

const promotion = computed(() => promotionData.value.data)

products.value = promotion.value.products
productsMeta.value = promotion.value.products_meta

const title = promotion.value.title

useHead({ title })

const relatedSliderContainer = useTemplateRef('related-slider')
const relatedSlider = useSimpleSlider(relatedSliderContainer)
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section
      class="hero-banner image-gradient [--direction:left] [--opacity:0.6] mb-[32px] desktop:mb-[48px]"
      :style="{ '--bg': `url(${promotion.banner_image})` }"
    >
      <div class="container grid desktop:content-between">
        <Breadcrumb
          :items="[ { name: 'Акции', path: '/promotions' }, { name: title } ]"
        />

        <div class="max-desktop:place-self-center max-desktop:text-center max-desktop:bg-black/20 max-desktop:backdrop-blur-[10px] max-desktop:rounded-[12px] p-[24px_12px] desktop:p-[0_160px_96px]">
          <h1 class="text-text-inverse">
            {{ promotion.title }}
          </h1>
          <p class="text-neutral-50 text-[14px]/[20px] desktop:text-[20px]/[32px]">
            {{ promotion.description }}
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section>
          <div class="grid desktop:grid-cols-[auto_830px] gap-[8px]">
            <h2 class="m-0">Об акции</h2>
            <p>
              {{ promotion.description }}
            </p>
          </div>

          <div class="product-grid mt-[32px]">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              v-bind="product"
            />
          </div>

          <button
            v-show="productsMeta.current_page < productsMeta.last_page"
            class="button button-tertiary flex mt-[32px] desktop:mx-auto"
            @click="productsParams.page += 1"
          >
            Показать еще
          </button>
        </section>

        <section>
          <div class="flex justify-center desktop:justify-between">
            <h2 class="m-0">Смотрите также</h2>
            <div class="arrows max-desktop:hidden">
              <button
                class="arrow arrow-left"
                @click="relatedSlider.scrollLeft"
              ></button>
              <button
                class="arrow arrow-right"
                @click="relatedSlider.scrollRight"
              ></button>
            </div>
          </div>

          <div
            ref="related-slider"
            class="slider mt-[24px] desktop:mt-[32px]"
          >
            <NuxtLink
              v-for="promotion in promotion.related"
              :key="promotion.id"
              :to="`/promotions/${promotion.slug}`"
              class="slider-item promotion-item image-gradient image-link"
              :style="{ '--bg': `url(${promotion.image})` }"
            >
              <h4>{{ promotion.title }}</h4>
              <p>{{ promotion.short_description }}</p>
            </NuxtLink>
          </div>

          <NuxtLink
            to="/promotions"
            class="button button-tertiary mt-[16px] w-full desktop:hidden"
          >
            Посмотреть все
          </NuxtLink>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.promotion-item {
  @variant desktop {
    width: calc(50% - 12px);
  }
}
</style>
