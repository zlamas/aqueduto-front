<script setup>
defineProps({
  settings: Object,
  navigation: Object,
})
</script>

<template>
  <footer class="container">
    <div class="grid laptop:grid-cols-[337px_1fr] gap-[16px] laptop:gap-[64px_120px] items-start pt-[32px] laptop:pt-[64px] pb-[27px] max-laptop:text-[14px]">
      <div class="grid gap-[24px] text-neutral-600 laptop:p-[16px] max-laptop:mb-[32px]">
        <img src="~/assets/icons/logo.svg" alt="" class="h-[30px]">

        <div class="text-neutral-500">
          {{ settings.footer_text }}
        </div>

        <div class="flex items-center gap-[14px]">
          <NuxtLink
            v-for="(link, id) in settings.social"
            :key="id"
            :to="link"
            class="shrink-0"
          >
            <img
              class="max-laptop:h-[44px]"
              :src="`/images/social-${id}.svg`"
              alt=""
            >
           </NuxtLink>

          <NuxtLink
            class="font-medium"
            :to="`mailto:${settings.email}`"
          >
            {{ settings.email }}
           </NuxtLink>
        </div>

        <div class="font-medium">
          {{ settings.working_hours }}
        </div>
      </div>

      <nav class="grid grid-cols-2 laptop:grid-cols-[repeat(auto-fill,_220px)] max-w-[830px] gap-[32px] justify-between items-start">
        <div class="grid gap-[24px]">
          <h5>Галерея</h5>

          <ul class="grid gap-[12px] text-neutral-600">
            <li v-for="style in navigation.gallery.slice(0, 8)">
              <NuxtLink :to="`/gallery/${style.slug}`">
                {{ style.title }}
               </NuxtLink>
            </li>
            <li>
              <NuxtLink class="font-semibold" to="/gallery">
                Все стили
               </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="grid gap-[24px]">
          <h5>Каталог</h5>

          <ul class="grid gap-[12px] text-neutral-600">
            <li v-for="category in navigation.catalog.slice(0, 8)">
              <NuxtLink :to="`/catalog/${category.slug}`">
                {{ category.name }}
               </NuxtLink>
            </li>
            <li>
              <NuxtLink class="font-semibold" to="/catalog">
                Все категории
               </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="grid gap-[24px]">
          <h5>Навигация</h5>

          <ul class="grid gap-[12px] text-neutral-600">
            <li>
              <NuxtLink to="/about">
                О нас
               </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/where-to-buy">
                Где купить
               </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/materials">
                Инструкции
               </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact">
                Контакты
               </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/smuv-tornado">
                Смыв “Торнадо”
               </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/promotions">
                Акции
               </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="flex max-laptop:flex-col justify-between col-span-full pt-[33px] border-t border-neutral-50 text-[14px]/[20px] text-neutral-500 laptop:flex-row-reverse gap-[24px]">
        <div class="flex max-laptop:flex-col gap-[12px_32px]">
          <NuxtLink to="/privacy">Политика конфиденциальности </NuxtLink>
          <NuxtLink to="/cookies">Cookies </NuxtLink>
        </div>

        <div class="text-center">© Aqueduto 2026. Все права защищены.</div>
      </div>
    </div>
  </footer>
</template>
