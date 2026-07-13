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
    <section class="hero-banner image-gradient grid [--bg:url(/images/catalog.jpg)] [--direction:bottom] laptop:[--direction:left] [--opacity:0.6] mb-[32px] laptop:mb-[64px]">
      <div class="container grid laptop:content-between max-laptop:p-[16px] max-laptop:backdrop-blur-[2px] max-laptop:bg-black/20">
        <Breadcrumb :items="[ { name: title } ]" />

        <div class="relative grid content-center laptop:p-[0_160px_64px]">
          <h1 class="text-text-inverse max-laptop:m-0 max-laptop:text-center">
            Каталог Aqueduto 2026
          </h1>
          <p class="text-white text-[20px]/[32px] mb-[24px] max-laptop:hidden">
            Загрузите наш полный каталог и откройте для себя мир <br> элегантной и надежной сантехники Aqueduto!
          </p>
          <NuxtLink to="/" class="button button-primary p-[14px_28px] justify-self-start max-laptop:absolute bottom-0 max-laptop:w-full">
            <img src="~/assets/icons/download.svg" alt="">
            <span>Скачать каталог</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="flex max-laptop:flex-col gap-[24px]">
        <div class="flex laptop:flex-col gap-[4px_12px] laptop:w-[342px] whitespace-nowrap overflow-x-auto scrollbar-none max-laptop:-mx-[16px] max-laptop:px-[16px]">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="{
              'rounded-full laptop:rounded-[16px] p-[10px_16px] laptop:p-[12px_16px] laptop:text-[24px]/[32px] text-left font-medium laptop:font-semibold': true,
              'text-neutral-600 max-laptop:bg-neutral-100 hover:bg-neutral-100': category.slug !== selectedCategory,
              'bg-brand-950 text-white laptop:bg-neutral-950': category.slug === selectedCategory,
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
