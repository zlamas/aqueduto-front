<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
</script>

<template>
  <NuxtLink
    :to="url"
    download
    class="flex justify-between bg-bg-secondary rounded-[14px] p-[8px_10px_8px_16px]"
  >
    <div class="flex items-center gap-[8px]">
      <img src="~/assets/icons/file-pdf.svg" alt="">
      <span class="text-secondary font-medium">
        {{ title }}
      </span>
    </div>
    <div class="flex items-center gap-[12px] shrink-0">
      <span class="text-[14px]/[20px] text-quaternary max-desktop:hidden">
        размер файла
      </span>
      <button class="bg-[#E9F4F6] rounded-[8px] p-[8px]">
        <img src="~/assets/icons/download.svg" alt="">
      </button>
    </div>
   </NuxtLink>
</template>

<style scoped>

</style>
