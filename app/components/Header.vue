<script setup>
import Dropdown from "@/components/Dropdown.vue";
import Search from "./Search.vue";

defineProps({
  settings: Object,
  navigation: Object,
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="font-medium laptop:shadow-md">
    <div class="bg-neutral-900 text-white text-[14px] max-laptop:hidden">
      <div class="container flex justify-between items-center py-[8px]">
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

    <nav class="text-neutral-700 py-[16px]">
      <div class="container">
        <div class="flex justify-between max-laptop:flex-col gap-[16px_64px]">
          <div class="flex items-center gap-[60px]">
            <NuxtLink to="/" class="shrink-0">
              <img src="~/assets/icons/logo.svg" alt="">
            </NuxtLink>
            <ul
              :class="{
                'flex gap-[24px_36px] desktop:gap-x-[40px] list-none max-laptop:fixed max-laptop:inset-0  max-laptop:flex-col max-laptop:bg-white max-laptop:z-999 max-laptop:p-[16px]': true,
                'max-laptop:hidden': !mobileMenuOpen,
              }"
            >
              <button
                class="absolute top-0 right-0 p-[16px] laptop:hidden"
                @click="mobileMenuOpen = false"
              >
                <img src="~/assets/icons/delete.svg" alt="">
              </button>
              <li>
                <NuxtLink to="/about" data-title="О нас">
                  О нас
                </NuxtLink>
              </li>
              <li>
                <Dropdown
                  content-class="grid grid-cols-5 gap-[24px] rounded-[20px] p-[64px_96px] text-neutral-600 max-laptop:hidden"
                  :hover="true"
                >
                  <template #button>
                    <NuxtLink
                      to="/gallery"
                      class="header-dropdown"
                    >
                      <span data-title="Галерея">Галерея</span>
                    </NuxtLink>
                  </template>

                  <NuxtLink
                    v-for="style in navigation.gallery"
                    :key="style.id"
                    :to="`/gallery/${style.slug}`"
                    class="grid justify-items-center text-center gap-[8px]"
                  >
                    <img
                      :src="style.thumbnail"
                      class="size-[186px] object-cover rounded-[15px]"
                      alt=""
                    >
                    <span>{{ style.title }}</span>
                  </NuxtLink>
                </Dropdown>
              </li>
              <li>
                <Dropdown
                  content-class="grid grid-rows-4 grid-flow-col auto-cols-[276px] gap-[24px] rounded-[20px] p-[64px_96px] max-laptop:hidden"
                  :hover="true"
                >
                  <template #button>
                    <NuxtLink
                      to="/catalog"
                      class="header-dropdown"
                    >
                      <span data-title="Каталог">Каталог</span>
                    </NuxtLink>
                  </template>

                  <NuxtLink
                    v-for="category in navigation.catalog"
                    :key="category.id"
                    :to="`/catalog/${category.slug}`"
                    class="flex items-center gap-[12px] rounded-[12px] p-[4px]"
                  >
                    <img
                      :src="category.icon"
                      class="size-[56px] rounded-[8px]"
                      alt=""
                    >
                    <div class="grid gap-[8px]">
                      <div class="font-semibold">{{ category.name }}</div>
                      <div class="text-neutral-500">{{ category.product_count }} товаров</div>
                    </div>
                  </NuxtLink>
                </Dropdown>
              </li>
              <li>
                <NuxtLink to="/promotions" data-title="Акции">
                  Акции
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/where-to-buy" data-title="Где купить">
                  Где купить
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" data-title="Контакты">
                  Контакты
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="flex gap-[8px] laptop:gap-[24px] desktop:gap-[32px] justify-end flex-1">
            <button
              class="header-button laptop:hidden"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <img src="~/assets/icons/menu.svg" alt="">
            </button>

            <form action="/search" class="header-search">
              <Search name="q" placeholder="Поиск" />
            </form>

            <div class="flex gap-[4px] laptop:gap-[12px]">
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
  li:hover {
    color: var(--color-neutral-800);
    font-weight: 700;
  }

  li:active {
    color: var(--color-brand-950);
    font-weight: 700;
  }

  [data-title]::before {
    content: attr(data-title);
    display: block;
    color: transparent;
    font-weight: 700;
    height: 0;
  }

  .header-search {
    flex: 1;
    max-width: 280px;

    @variant laptop {
      font-size: 14px;
    }
  }

  .header-button {
    display: flex;
    width: 40px;
    height: 40px;
    background: var(--color-neutral-100);
    border-radius: 8px;
    flex-shrink: 0;

    @variant laptop {
      background: none;
    }
  }

  .header-button img {
    margin: auto;
    width: 20px;
    height: 20px;

    @variant laptop {
      width: 24px;
      height: 24px;
    }
  }

  .header-dropdown {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-dropdown::after {
    content: url("/images/arrow-down.svg");
    line-height: 0;
  }

  .header-dropdown:hover::after {
    rotate: 180deg;
  }
}
</style>
