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
  <main class="pt-[24px] laptop:pt-[64px] laptop:pb-[100px]">
    <section
      class="hero-banner image-gradient [--direction:left] [--opacity:0.6] mb-[32px] laptop:mb-[48px]"
      :style="{ '--bg': `url(${promotion.banner_image})` }"
    >
      <div class="container grid laptop:content-between">
        <Breadcrumb
          :items="[ { name: 'Акции', path: '/promotions' }, { name: title } ]"
        />

        <div class="max-laptop:place-self-center max-laptop:text-center max-laptop:bg-black/20 max-laptop:backdrop-blur-[10px] max-laptop:rounded-[12px] p-[24px_12px] laptop:p-[96px_0]">
          <h1 class="text-text-inverse">
            {{ promotion.title }}
          </h1>
          <p class="text-neutral-50 text-[14px]/[20px] laptop:text-[20px]/[32px]">
            {{ promotion.description }}
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section>
          <div class="grid laptop:grid-cols-[auto_830px] gap-[8px]">
            <h2 class="m-0">Об акции</h2>
            <p>
              {{ promotion.description }}
            </p>
          </div>

          <div class="product-grid mt-[32px]">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <button
            v-show="productsMeta.current_page < productsMeta.last_page"
            class="button button-tertiary flex mt-[32px] laptop:mx-auto"
            @click="productsParams.page += 1"
          >
            Показать еще
          </button>
        </section>

        <section>
          <div class="flex justify-center laptop:justify-between">
            <h2 class="m-0">Смотрите также</h2>
            <div class="arrows max-laptop:hidden">
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
            class="slider mt-[24px] laptop:mt-[32px]"
          >
            <NuxtLink
              v-for="promotion in promotion.related"
              :key="promotion.id"
              :to="`/promotions/${promotion.slug}`"
              class="slider-item promotion-item image-gradient zoom-hover image-link"
              :style="{ '--bg': `url(${promotion.image})` }"
            >
              <h4>{{ promotion.title }}</h4>
              <p>{{ promotion.short_description }}</p>
            </NuxtLink>
          </div>

          <NuxtLink
            to="/promotions"
            class="button button-tertiary mt-[16px] w-full laptop:hidden"
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
  @variant laptop {
    width: calc(50% - 12px);
  }
}
</style>
