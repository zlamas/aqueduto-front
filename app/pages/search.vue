<script setup>
import ProductCard from "@/components/ProductCard.vue";
import Dropdown from "@/components/Dropdown.vue";
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";

const query = useRoute().query.q

const { data } = await useAPI('/search', { query: { q: query } })

const products = data.value.data

const title = `Результаты поиска “${query}”`

useHead({ title })

const categories = {
  all: { name: 'Все', count: products.length },
  products: { name: 'Товары', count: products.length },
  manuals: { name: 'Материалы', count: 3 },
  collections: { name: 'Коллекции', count: 2 },
}

const selectedCategory = ref('all')

const manuals = ref([
  {
    name: 'Инструкции',
    items: [
      { title: 'Инструкция по монтажу подвесных унитазов', url: '/' },
      { title: 'Инструкция по монтажу подвесных унитазов', url: '/' },
    ]
  },
  {
    name: '3D модели',
    items: [
      { title: '3D модели унитазов', url: '/' },
    ]
  },
])
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <h1 class="mb-[24px] desktop:mb-[40px]">{{ title }}</h1>

      <div class="flex max-desktop:flex-col justify-between gap-[24px] mb-[24px] desktop:mb-[32px]">
        <div class="flex gap-[16px] desktop:gap-[24px] -mx-[16px] px-[16px] scrollbar-none overflow-x-auto overflow-y-hidden">
          <button
            v-for="(category, id) in categories"
            :class="{
              'flex gap-[6px] rounded-full p-[10px_20px] font-medium': true,
              'bg-[#F1F5F9]': id !== selectedCategory,
              'bg-[#7195B5]': id === selectedCategory,
            }"
            @click="selectedCategory = id"
          >
            <span
              :class="{
                'text-tertiary': id !== selectedCategory,
                'text-white': id === selectedCategory
              }"
            >
              {{ category.name }}
            </span>
            <span
              :class="{
                'text-quaternary': id !== selectedCategory,
                'text-[#F1F5F9]': id === selectedCategory
              }"
            >
              {{ category.count }}
            </span>
          </button>
        </div>

        <Dropdown
          v-show="(selectedCategory === 'all' || selectedCategory === 'products') && products.length"
          label="Тип товара"
        />
      </div>

      <div class="layout">
        <section
          v-show="(selectedCategory === 'all' || selectedCategory === 'products') && products.length"
          class="search-section"
        >
          <h5>Товары</h5>
          <div class="product-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              v-bind="product"
            />
          </div>
        </section>

        <section
          v-show="selectedCategory === 'all' || selectedCategory === 'collections'"
          class="search-section"
        >
          <h5>Коллекции</h5>
          <div class="flex max-desktop:flex-col desktop:flex-wrap justify-center gap-[12px] desktop:gap-[24px]">
            <NuxtLink to="/gallery" class="image-gradient style-item [--bg:url(/images/style-4.jpg)]" data-name="OVO
(6 товаров)"> </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient style-item [--bg:url(/images/style-11.jpg)]" data-name="MACIO
(6 товаров)"> </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient style-item [--bg:url(/images/style-3.jpg)]" data-name="FORMA
(6 товаров)"> </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient style-item [--bg:url(/images/style-4.jpg)]" data-name="CANO
(6 товаров)"> </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient style-item [--bg:url(/images/style-3.jpg)]" data-name="CHUVA
(6 товаров)"> </NuxtLink>
          </div>
        </section>

        <section
          v-show="selectedCategory === 'all' || selectedCategory === 'manuals'"
          class="search-section"
        >
          <h5>Материалы</h5>
          <div class="grid gap-[24px] content-start flex-1">
            <div
              v-for="group in manuals"
              class="grid gap-[8px]"
            >
              <h6 class="m-0 font-semibold text-secondary">
                {{ group.name }}
              </h6>
              <DownloadItem
                v-for="item in group.items"
                :title="item.title"
                :url="item.url"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.search-section {
  display: grid;
  gap: 24px;

  @variant desktop {
    gap: 40px;
  }
}
</style>
