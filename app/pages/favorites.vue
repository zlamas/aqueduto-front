<script setup>
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: favoritesData } = await useAPI('/favorites')

const { data: favorites, categories } = favoritesData.value

const title = 'Избранное'

useHead({ title })

const selectedCategory = ref(0)
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[64px]"
      />

      <h1 class="mb-[24px] desktop:mb-[40px]">{{ title }}</h1>

      <div class="flex flex-wrap gap-[16px] mb-[32px]">
        <button
          v-for="(category, index) in categories"
          :key="category.slug"
          :class="{
            'flex gap-[6px] rounded-full p-[10px_20px] font-medium': true,
            'bg-[#F1F5F9]': index !== selectedCategory,
            'bg-[#7195B5]': index === selectedCategory,
          }"
          @click="selectedCategory = index"
        >
          <span
            :class="{
              'text-tertiary': index !== selectedCategory,
              'text-white': index === selectedCategory
            }"
          >
            {{ category.name }}
          </span>
          <span
            :class="{
              'text-quaternary': index !== selectedCategory,
              'text-[#F1F5F9]': index === selectedCategory
            }"
          >
            {{ category.count }}
          </span>
        </button>
      </div>

      <div class="product-grid">
        <ProductCard
          v-for="product in favorites"
          :key="product.id"
          v-bind="product"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
