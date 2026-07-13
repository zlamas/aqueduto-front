<script setup>
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";
import Dropdown from "../components/Dropdown.vue";

const selectedCategory = ref(null)

const { data: favoritesData } = await useAPI('/favorites', { query: { category: selectedCategory } })

const title = 'Избранное'

useHead({ title })

const favorites = computed(() => favoritesData.value.data)
const categories = computed(() => favoritesData.value.categories)

const allCategories = computed(() => [
  {
    name: 'Все',
    slug: null,
    count: categories.value.reduce((a, b) => a + b.count, 0)
  },
  ...categories.value
])
</script>

<template>
  <main class="pt-[24px] laptop:pt-[120px]">
    <div class="container">
      <h1 class="mb-[16px] laptop:mb-[32px]">{{ title }}</h1>

      <div class="flex flex-wrap gap-[16px]">
        <button
          v-for="category in allCategories"
          :key="category.slug"
          :class="{
            'group flex items-center gap-[8px] rounded-full p-[6px] pr-[16px] font-medium': true,
            'button-secondary hover:bg-neutral-200 active:bg-neutral-300': category.slug !== selectedCategory,
            'bg-brand-950': category.slug === selectedCategory,
          }"
          @click="selectedCategory = category.slug"
        >
          <span
            :class="{
              'p-[4px_12px] bg-white border rounded-full font-bold': true,
              'text-neutral-600 border-neutral-300 group-hover:text-neutral-700 group-hover:border-neutral-400 group-active:text-neutral-800 group-active:border-neutral-500': category.slug !== selectedCategory,
              'border-transparent text-brand-950': category.slug === selectedCategory
            }"
          >
            {{ category.count }}
          </span>
          <span
            :class="{
              'text-neutral-600 group-hover:text-neutral-700 group-active:text-neutral-800': category.slug !== selectedCategory,
              'text-neutral-25 font-bold': category.slug === selectedCategory
            }"
          >
            {{ category.name }}
          </span>
        </button>

        <Dropdown
          class="ml-auto max-laptop:hidden"
          label="Скачать"
          icon-left="download"
          button-class="rounded-[10px]! px-[12px]"
          content-class="dropdown-content"
          :close-on-click="true"
        >
          <div class="dropdown-item">
            <img src="/images/file-pdf-sm.svg" alt="">
            <span>PDF</span>
          </div>
          <div class="dropdown-item">
            <img src="/images/file-xls-sm.svg" alt="">
            <span>XLSX</span>
          </div>
        </Dropdown>
      </div>

      <div class="grid grid-cols-2 gap-[18px] mt-[24px] laptop:hidden">
        <button class="button button-secondary">
          <img src="/images/file-xls-sm.svg" alt="">
          <span>Скачать Excel</span>
        </button>

        <button class="button button-secondary">
          <img src="/images/file-pdf-sm.svg" alt="">
          <span>Скачать PDF</span>
        </button>
      </div>

      <div class="product-grid mt-[32px]">
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
