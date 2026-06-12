<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: settings } = await useAPI('/settings')
const { data: navigationData } = await useAPI('/navigation')

const navigation = navigationData.value
</script>

<template>
  <Header
    :settings="settings"
    :navigation="navigation"
  />
  <slot />
  <Footer
    :settings="settings"
    :navigation="navigation"
  />
</template>
