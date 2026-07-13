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
  type: String,
})

const icon = {
  manual: 'pdf',
  pdf: 'pdf',
  catalog: 'xls',
  model3d: 'zip',
  model: 'zip',
}
</script>

<template>
  <NuxtLink
    :to="url"
    download
    class="group flex justify-between bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 hover:border-neutral-200 rounded-[14px] p-[8px_10px_8px_16px]"
  >
    <div class="flex items-center gap-[8px]">
      <img :src="`/images/file-${icon[type]}.svg`" alt="">
      <span class="text-neutral-600 group-hover:text-brand-950 font-medium">
        {{ title }}
      </span>
    </div>
    <div class="flex items-center gap-[8px] shrink-0">
      <span class="text-[14px]/[20px] text-neutral-500 group-hover:text-neutral-600 max-laptop:hidden">
        размер файла
      </span>
      <button class="bg-brand-600 group-hover:bg-brand-700 rounded-[8px] p-[8px]">
        <img src="~/assets/icons/download.svg" alt="">
      </button>
    </div>
   </NuxtLink>
</template>

<style scoped>

</style>
