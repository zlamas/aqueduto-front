<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: promotionsData } = await useAPI('/promotions')

const title = 'Акции'

useHead({ title })
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[64px]"
      />

      <h1 class="desktop:mb-[40px]">{{ title }}</h1>
      <div class="flex max-desktop:flex-col flex-wrap gap-[12px] desktop:gap-[24px]">
        <NuxtLink
          v-for="promotion in promotionsData.data"
          :key="promotion.id"
          :to="`/promotions/${promotion.slug}`"
          class="promotion-item image-gradient"
          :style="{ '--bg': `url(${promotion.image})` }"
        >
          <h4>{{ promotion.title }}</h4>
          <p>{{ promotion.short_description }}</p>
         </NuxtLink>
<!--        <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-13.jpg)]">-->
<!--          <h4>Название</h4>-->
<!--          <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--         </NuxtLink>-->
<!--        <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-3.jpg)]">-->
<!--          <h4>Название</h4>-->
<!--          <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--         </NuxtLink>-->
<!--        <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-9.jpg)]">-->
<!--          <h4>Название</h4>-->
<!--          <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--         </NuxtLink>-->
<!--        <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-10.jpg)]">-->
<!--          <h4>Название</h4>-->
<!--          <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--         </NuxtLink>-->
<!--        <NuxtLink to="/promotions/promotion" class="promotion-item image-gradient [&#45;&#45;bg:url(/images/style-4.jpg)]">-->
<!--          <h4>Название</h4>-->
<!--          <p>Крутое описание, которое четко доносит выгоду покупателю</p>-->
<!--         </NuxtLink>-->
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
