<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: promotionsData } = await useAPI('/promotions')

const title = 'Акции'

useHead({ title })
</script>

<template>
  <main class="pt-[32px] laptop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[36px]"
        :light="true"
      />

      <h1 class="laptop:mb-[32px]">{{ title }}</h1>
      <div class="bento">
        <NuxtLink
          v-for="promotion in promotionsData.data"
          :key="promotion.id"
          :to="`/promotions/${promotion.slug}`"
          class="promotion-item image-gradient zoom-hover image-link"
          :style="{ '--bg': `url(${promotion.image})` }"
        >
          <h4>{{ promotion.title }}</h4>
          <p>{{ promotion.short_description }}</p>
         </NuxtLink>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
