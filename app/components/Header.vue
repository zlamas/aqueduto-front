<script setup>
import Dropdown from "@/components/Dropdown.vue";

defineProps({
  settings: Object,
  navigation: Object,
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="font-medium desktop:shadow-md">
    <div class="bg-[#29333D] text-[#FCFCFD] text-[14px] max-desktop:hidden">
      <div class="container flex justify-between items-center py-[8px]">
        <div>
          <div class="flex items-center gap-[4px] cursor-pointer">
            <img src="~/assets/icons/location.svg" alt="">
            <span>
              Москва
            </span>
          </div>
        </div>

        <div class="flex gap-[24px]">
          <div class="flex items-center gap-[4px]">
            <img src="~/assets/icons/clock.svg" alt="">
            <span>
              {{ settings.working_hours }}
            </span>
          </div>
          <NuxtLink
            class="flex items-center gap-[4px]"
            :to="`mailto:${settings.email}`"
          >
            <img src="~/assets/icons/email.svg" alt="">
            <span>
              {{ settings.email }}
            </span>
           </NuxtLink>
        </div>
      </div>
    </div>

    <nav class="text-secondary py-[16px]">
      <div class="container">
        <div class="flex justify-between max-desktop:flex-col gap-[16px]">
          <div class="flex items-center gap-[60px]">
            <NuxtLink to="/" class="">
              <img src="~/assets/icons/logo.svg" alt="">
             </NuxtLink>
            <ul
              :class="{
                'flex gap-[24px_40px] list-none max-desktop:fixed max-desktop:inset-0  max-desktop:flex-col max-desktop:bg-white max-desktop:z-999 max-desktop:p-[16px]': true,
                'max-desktop:hidden': !mobileMenuOpen,
              }"
            >
              <button
                class="absolute top-0 right-0 p-[16px]"
                @click="mobileMenuOpen = false"
              >
                <img src="~/assets/icons/delete.svg" alt="">
              </button>
              <li>
                <NuxtLink to="/about">
                  О нас
                </NuxtLink>
              </li>
              <li>
                <Dropdown
                  label="Галерея"
                  class="p-0! text-inherit! [--bg:none]!"
                  content-class="max-desktop:hidden"
                >
                  <div class="grid grid-rows-4 grid-flow-col auto-cols-[276px] gap-[24px] p-[48px_80px]">
                    <NuxtLink
                      v-for="style in navigation.gallery"
                      :key="style.id"
                      :to="`/gallery/${style.slug}`"
                      class="flex items-center gap-[12px] rounded-[12px] p-[4px]"
                    >
                      <img
                        :src="style.thumbnail"
                        class="size-[56px] rounded-[8px] bg-[#E6E6E6]"
                        alt=""
                      >
                      <div class="font-semibold">{{ style.title }}</div>
                     </NuxtLink>
                  </div>
                </Dropdown>
              </li>
              <li>
                <Dropdown
                  label="Каталог"
                  class="p-0! text-inherit! [--bg:none]!"
                  content-class="max-desktop:hidden"
                >
                  <div class="grid grid-rows-4 grid-flow-col auto-cols-[276px] gap-[24px] p-[48px_80px]">
                    <NuxtLink
                      v-for="category in navigation.catalog"
                      :key="category.id"
                      :to="`/catalog/${category.slug}`"
                      class="flex items-center gap-[12px] rounded-[12px] p-[4px]"
                    >
                      <img
                        :src="category.image"
                        class="size-[56px] rounded-[8px] bg-[#E6E6E6]"
                        alt=""
                      >
                      <div class="grid gap-[8px]">
                        <div class="font-semibold">{{ category.name }}</div>
                        <div class="text-quaternary">{{ category.product_count }} товаров</div>
                      </div>
                     </NuxtLink>
                  </div>
                </Dropdown>
              </li>
              <li>
                <NuxtLink to="/promotions">
                  Акции
                 </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/where-to-buy">
                  Где купить
                 </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact">
                  Контакты
                 </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="flex gap-[8px] desktop:gap-[32px]">
            <button
              class="header-button desktop:hidden"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <img src="~/assets/icons/menu.svg" alt="">
            </button>

            <form action="/search" class="header-search">
              <label class="search-field h-full">
                <input name="q" class="search-input" type="text" placeholder="Поиск">
              </label>
            </form>

            <div class="flex gap-[4px] desktop:gap-[12px]">
              <NuxtLink class="header-button"  to="/favorites">
                <img src="~/assets/icons/favorite.svg" alt="">
               </NuxtLink>
              <NuxtLink class="header-button"  to="/compare">
                <img src="~/assets/icons/compare.svg" alt="">
               </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .header-button {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F1F5F9;
    border-radius: 8px;
    flex-shrink: 0;

    @variant desktop {
      background: none;
    }
  }

  .header-button img {
    margin: auto;
    width: 20px;
    height: 20px;

    @variant desktop {
      width: 24px;
      height: 24px;
    }
  }

  .dropdown {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dropdown::after {
    content: url(/images/arrow-down.svg);
    line-height: 0;
  }
}
</style>
