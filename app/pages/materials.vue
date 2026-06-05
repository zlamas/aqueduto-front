<script setup>
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: materialsData } = await useAPI('/materials');

const title = 'Инструкции'

useHead({ title })

const categories = [
  'Унитазы',
  'Писсуары',
  'Биде',
  'Панели смыва',
  'Гигиенические души',
  'Души',
  'Раковины',
  'Смесители для ванной',
  'Смесители для кухни',
  'Инсталляции',
  'Аксессуары',
  'Комплектующие',
]

const types = {
  'manual': 'Инструкции',
  'catalog': 'Каталоги',
  '3d': '3D модели',
}

const selectedCategory = ref(0)

const materials = Object.fromEntries(materialsData.value.data.map((item) => [item.type, item.items]))

// const manuals = ref([
//   {
//     name: 'Инструкции',
//     items: [
//       { name: 'Инструкция по монтажу подвесных унитазов', url: '/' },
//       { name: 'Инструкция по монтажу подвесных унитазов', url: '/' },
//     ]
//   },
//   {
//     name: '3D модели',
//     items: [
//       { name: '3D модели унитазов', url: '/' },
//     ]
//   },
// ])
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="max-desktop:px-[16px]">
      <section class="hero-banner image-gradient grid content-end desktop:content-between h-[220px] desktop:h-[460px] rounded-[20px] desktop:rounded-[32px] p-[16px] desktop:p-[32px_160px_96px] [--bg:url(/images/catalog.jpg)] [--direction:left] [--opacity:0.6] mb-[32px] desktop:mb-[128px]">
        <Breadcrumb
          :items="[ { name: title } ]"
          class="place-self-start z-9"
        />

        <div class="max-w-[904px] text-[#FCFCFD]">
          <h1 class="max-desktop:mb-[36px]">
            Каталог Aqueduto 2026
          </h1>
          <p class="text-[20px]/[32px] mb-[24px] max-desktop:hidden">
            Загрузите наш полный каталог и откройте для себя мир <br> элегантной и надежной сантехники Aqueduto!
          </p>
          <NuxtLink to="/" class="button-rounded bg-[#7195B5] text-white max-desktop:w-full">
            Скачать каталог
           </NuxtLink>
        </div>
      </section>
    </div>

    <div class="container">
      <div class="flex max-desktop:flex-col gap-[16px_24px]">
        <div class="flex desktop:flex-col gap-[4px_12px] desktop:w-[342px] whitespace-nowrap overflow-x-auto scrollbar-none max-desktop:-mx-[16px] max-desktop:px-[16px]">
          <button
            v-for="(category, index) in categories"
            :class="{
              'rounded-full desktop:rounded-[12px] p-[10px_20px] desktop:p-[12px] desktop:text-[24px]/[32px] text-left font-medium': true,
              'bg-[#F1F5F9] text-tertiary desktop:bg-white desktop:text-secondary desktop:font-semibold': index !== selectedCategory,
              'bg-[#7195B5] text-white desktop:bg-[#F3F9FA] desktop:text-[#7195B5] desktop:font-bold': index === selectedCategory,
            }"
            @click="selectedCategory = index"
          >
            {{ category }}
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
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
