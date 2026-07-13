<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  light: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <nav class="max-laptop:hidden">
    <ul :class="{
      'inline-flex items-center gap-[8px] text-[14px] py-[8px]': true,
      'bg-neutral-900/50 backdrop-blur-lg rounded-[8px] px-[12px] text-white [&>li]:opacity-80 [&>li]:hover:opacity-90 [&>li]:active:opacity-100': !light,
      'text-neutral-500 [&>li]:hover:text-neutral-700 [&>li]:active:text-neutral-800 [&>li:last-child]:text-neutral-700': light,
    }">
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
  gap: 8px;
}

li:not(:last-child)::after {
  content: url(~/assets/icons/breadcrumb-arrow.svg);
  line-height: 0;
}

li:last-child {
  font-weight: 600;
  opacity: 1;
}
</style>
