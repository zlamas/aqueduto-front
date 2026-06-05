<script setup>
import {useAPI} from "@/composables/useAPI.js";
import {navigateTo} from "nuxt/app";

const { slug } = useRoute().params

const { data: pageData } = await useAPI(`/pages/${slug}`, {
  onResponseError({ response }) {
    if (response.status === 404) {
      return navigateTo('/404')
    }
  }
})

let title, content

if (pageData.value) {
  ({ title, content } = pageData.value.data)

  useHead({ title })
}
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container" v-html="content"></div>
  </main>
</template>

<style scoped>

</style>
