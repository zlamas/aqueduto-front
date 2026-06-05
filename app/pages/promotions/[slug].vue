<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const { slug } = useRoute().params

const { data: promotionData } = await useAPI(`/promotions/${slug}`)

const promotion = promotionData.value.data

const title = promotion.title

useHead({ title })
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section
      class="hero-banner image-gradient grid desktop:content-between desktop:h-[500px] desktop:rounded-[32px] desktop:p-[32px_160px_96px] [--direction:left] [--opacity:0.6] mb-[32px] desktop:mb-[64px]"
      :style="{ '--bg': `url(${promotion.image})` }"
    >
      <Breadcrumb
        :items="[ { name: 'Акции', path: '/promotions' }, { name: title } ]"
        class="place-self-start z-9"
      />

      <div class="max-w-[904px] text-[#FCFCFD] max-desktop:place-self-center max-desktop:text-center max-desktop:bg-[#00000033] max-desktop:backdrop-blur-[10px] max-desktop:rounded-[12px] max-desktop:mx-[32px] max-desktop:p-[24px_12px]">
        <h1>
          {{ promotion.title }}
        </h1>
        <p class="text-[14px]/[20px] desktop:text-[20px]/[32px]">
          {{ promotion.description }}
        </p>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section>
          <div class="product-grid">
            <ProductCard
              v-for="product in promotion.products"
              :key="product.id"
              v-bind="product"
            />
          </div>

          <button class="button-rounded flex mt-[32px] mx-auto max-desktop:w-full">
            Показать еще
          </button>
        </section>

        <section>
          <div class="flex justify-center desktop:justify-between">
            <h2 class="m-0">Смотрите также</h2>
            <div class="arrows max-desktop:hidden">
              <button
                class="arrow arrow-left"
              ></button>
              <button
                class="arrow arrow-right"
              ></button>
            </div>
          </div>

          <div class="flex flex-col desktop:grid grid-flow-col auto-cols-[calc(50%-12px)] gap-[12px] desktop:gap-[24px]  mt-[24px] desktop:mt-[32px] scrollbar-none overflow-x-auto scroll-smooth snap-x snap-mandatory">
            <NuxtLink
              v-for="promotion in promotion.related"
              :key="promotion.id"
              :to="`/promotions/${promotion.slug}`"
              class="promotion-item image-gradient"
              :style="{ '--bg': `url(${promotion.image})` }"
            >
              <h4>{{ promotion.title }}</h4>
              <p>{{ promotion.short_description }}</p>
             </NuxtLink>
<!--            <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-13.jpg)]">-->
<!--              <h4>Название</h4>-->
<!--              <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--             </NuxtLink>-->
<!--            <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-3.jpg)]">-->
<!--              <h4>Название</h4>-->
<!--              <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--             </NuxtLink>-->
<!--            <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-9.jpg)] max-desktop:hidden">-->
<!--              <h4>Название</h4>-->
<!--              <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--             </NuxtLink>-->
<!--            <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-10.jpg)] max-desktop:hidden">-->
<!--              <h4>Название</h4>-->
<!--              <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--             </NuxtLink>-->
<!--            <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-4.jpg)] max-desktop:hidden">-->
<!--              <h4>Название</h4>-->
<!--              <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--             </NuxtLink>-->
          </div>
          <button class="button-rounded mt-[16px] w-full desktop:hidden">
            Посмотреть все
          </button>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
