<script setup>
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";

const selectedCategory = ref(null)

const { data: materialsData } = await useAPI('/materials', { query: { category: selectedCategory } })

const categories = materialsData.value.categories
const data = computed(() => materialsData.value.data)

const materials = computed(() =>
  Object.fromEntries(
    data.value
      .map((item) => [item.type, item.items])
      .filter(([type, items]) => items.length)
  )
)

const types = {
  manual: 'Инструкции',
  catalog: 'Каталоги',
  model3d: '3D модели',
}

const title = 'Инструкции'

useHead({ title })
</script>

<template>
  <main>
    <section class="hero-banner image-gradient [--bg:url(/images/catalog.jpg)] [--direction:bottom] desktop:[--direction:left] [--opacity:0.6] mb-[32px] desktop:mb-[64px]">
      <div class="container grid desktop:content-between max-desktop:p-[16px] max-desktop:backdrop-blur-[2px] max-desktop:bg-black/20">
        <Breadcrumb :items="[ { name: title } ]" />

        <div class="relative grid content-center desktop:p-[0_160px_64px]">
          <h1 class="text-text-inverse max-desktop:m-0 max-desktop:text-center">
            Каталог Aqueduto 2026
          </h1>
          <p class="text-white text-[20px]/[32px] mb-[24px] max-desktop:hidden">
            Загрузите наш полный каталог и откройте для себя мир <br> элегантной и надежной сантехники Aqueduto!
          </p>
          <NuxtLink to="/" class="button button-primary p-[14px_28px] justify-self-start max-desktop:absolute bottom-0 max-desktop:w-full">
            <img src="~/assets/icons/download.svg" alt="">
            <span>Скачать каталог</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="flex max-desktop:flex-col gap-[24px]">
        <div class="flex desktop:flex-col gap-[4px_12px] desktop:w-[342px] whitespace-nowrap overflow-x-auto scrollbar-none max-desktop:-mx-[16px] max-desktop:px-[16px]">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="{
              'rounded-full desktop:rounded-[16px] p-[10px_16px] desktop:p-[12px_16px] desktop:text-[24px]/[32px] text-left font-medium desktop:font-semibold': true,
              'text-neutral-600 max-desktop:bg-neutral-100 hover:bg-neutral-100': category.slug !== selectedCategory,
              'bg-brand-950 text-white desktop:bg-neutral-950': category.slug === selectedCategory,
            }"
            @click="selectedCategory = category.slug"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="grid gap-[24px] content-start flex-1">
          <div
            v-for="(items, type) in materials"
            :key="type"
            class="grid gap-[8px]"
          >
            <h6 class="m-0">{{ types[type] }}</h6>
            <DownloadItem
              v-for="item in items"
              :key="item.id"
              :title="item.title"
              :url="item.file_url"
              :type="type"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
