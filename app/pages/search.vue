<script setup>
import ProductCard from "@/components/ProductCard.vue";
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";

const query = useRoute().query.q

const { data } = await useAPI('/search', { query: { q: query } })

const products = data.value.data

const title = `Результаты поиска “${query}”`

useHead({ title })

const page = ref(1)
const perPage = 8

const categories = [
  { name: 'Товары', slug: 'products', count: products.length },
  { name: 'Материалы', slug: 'manuals', count: 3 },
  { name: 'Коллекции', slug: 'collections', count: 2 },
]

const allCategories = [
  {
    name: 'Все',
    slug: null,
    count: categories.reduce((a, b) => a + b.count, 0)
  },
  ...categories
]

const selectedCategory = ref(null)

const manuals = ref([
  {
    type: 'manual',
    name: 'Инструкции',
    items: [
      { title: 'Инструкция по монтажу подвесных унитазов', url: '/' },
      { title: 'Инструкция по монтажу подвесных унитазов', url: '/' },
    ]
  },
  {
    type: 'model3d',
    name: '3D модели',
    items: [
      { title: '3D модели унитазов', url: '/' },
    ]
  },
])
</script>

<template>
  <main class="pt-[24px] laptop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[32px]"
        :light="true"
      />

      <h1 class="mb-[24px] laptop:mb-[32px]">{{ title }}</h1>

      <div class="flex gap-[16px] mb-[24px] laptop:mb-[32px] px-[16px] -mx-[16px] overflow-auto scrollbar-none">
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
      </div>

      <div class="layout laptop:gap-[64px]">
        <section
          v-show="(selectedCategory === null || selectedCategory === 'products') && products.length"
          class="search-section"
        >
          <h3 class="m-0">Товары</h3>

          <div class="product-grid">
            <ProductCard
              v-for="product in products.slice(0, page * perPage)"
              :key="product.id"
              :product="product"
            />
          </div>

          <button
              v-show="page * perPage < products.length"
              class="button button-tertiary laptop:mx-auto"
              @click="page += 1"
            >
            Показать еще
          </button>
        </section>

        <section
          v-show="selectedCategory === null || selectedCategory === 'collections'"
          class="search-section"
        >
          <h3 class="m-0">Коллекции</h3>
          <div class="bento">
            <NuxtLink to="/gallery" class="image-gradient zoom-hover style-item [--bg:url(/images/style-4.jpg)]">
              <span class="style-item-name">
                <span>OVO </span>
                <span class="text-neutral-500">(6 товаров)</span>
              </span>
            </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient zoom-hover style-item [--bg:url(/images/style-11.jpg)]">
              <span class="style-item-name">
                <span>MACIO </span>
                <span class="text-neutral-500">(6 товаров)</span>
              </span>
            </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient zoom-hover style-item [--bg:url(/images/style-3.jpg)]">
              <span class="style-item-name">
                <span>FORMA </span>
                <span class="text-neutral-500">(6 товаров)</span>
              </span>
            </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient zoom-hover style-item [--bg:url(/images/style-4.jpg)]">
              <span class="style-item-name">
                <span>CANO </span>
                <span class="text-neutral-500">(6 товаров)</span>
              </span>
            </NuxtLink>
            <NuxtLink to="/gallery" class="image-gradient zoom-hover style-item [--bg:url(/images/style-3.jpg)]">
              <span class="style-item-name">
                <span>CHUVA </span>
                <span class="text-neutral-500">(6 товаров)</span>
              </span>
            </NuxtLink>
          </div>
        </section>

        <section
          v-show="selectedCategory === null || selectedCategory === 'manuals'"
          class="search-section"
        >
          <h3 class="m-0">Материалы</h3>
          <div class="grid gap-[24px] content-start flex-1">
            <div
              v-for="group in manuals"
              class="grid gap-[8px]"
            >
              <h6 class="m-0 font-semibold text-neutral-700">
                {{ group.name }}
              </h6>
              <DownloadItem
                v-for="item in group.items"
                :title="item.title"
                :url="item.url"
                :type="group.type"
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
}
</style>
