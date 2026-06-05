<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  }
})
</script>

<template>
  <nav class="max-desktop:hidden">
    <ul class="inline-flex items-center gap-[8px] bg-[#F1F5F9] rounded-[8px] p-[10px_12px] text-[14px] text-tertiary">
      <li>
        <NuxtLink :to="{ name: 'index' }">
          Главная
        </NuxtLink>
      </li>
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <NuxtLink v-if="item.path" :to="item.path">
          {{ item.name }}
        </NuxtLink>
        <span v-else>
          {{ item.name }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 10px;
}

li:not(:last-child)::after {
  content: url(~/assets/icons/breadcrumb-arrow.svg);
}

li:last-child {
  color: var(--color-secondary);
}
</style>
