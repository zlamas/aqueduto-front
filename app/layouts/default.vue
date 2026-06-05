<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: settings } = await useAPI('/settings')
const { data: categoriesData } = await useAPI('/categories')
const { data: galleryData } = await useAPI('/gallery')

const categories = categoriesData.value.data
const { styles } = galleryData.value
</script>

<template>
  <Header
    :settings="settings"
    :categories="categories"
    :styles="styles"
  />
  <slot />
  <Footer
    :settings="settings"
    :categories="categories"
    :styles="styles"
  />
</template>
