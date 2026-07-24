<script setup>
import HeroSlider from "@/components/HeroSlider.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";
import useSlider from "@/composables/useSlider.js";
import useSimpleSlider from "@/composables/useSimpleSlider.js";

const { data: homeData } = await useAPI('/home')

const styleParams = ref({
  page: 1,
  per_page: 5,
})
const styleMeta = ref(null)
const styles = ref([])

const { data: styleData } = await useAPI('/gallery', {
  query: styleParams.value,

  onResponse({ response }) {
    styles.value.push(...response._data.styles)
    styleMeta.value = response._data.meta
  }
})

styles.value = styleData.value.styles
styleMeta.value = styleData.value.meta

useHead({
  title: 'Главная'
})

const advantagesSliderContainer = useTemplateRef('advantages-slider')
const advantagesSliderItems = ref([])
const advantagesSlider = useSlider(advantagesSliderContainer, advantagesSliderItems)

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)
</script>

<template>
  <main class="layout">
    <section class="hero-banner hero-banner-large [--opacity:1]">
      <HeroSlider :items="homeData.sliders" />
    </section>

    <div class="container">
      <div class="layout">
        <section
          v-for="(section, index) in homeData.sections"
          :key="section.id"
          class="image-aside"
        >
          <div class="flex-1">
            <h2>{{ section.title }}</h2>
            <p class="text-neutral-600 whitespace-pre-line">
              {{ section.content }}
            </p>
          </div>
          <img :src="section.image" alt="">
        </section>

        <section>
          <div class="text-center mb-[24px] laptop:mb-[32px]">
            <h2 class="mb-[12px]">Наши преимущества</h2>
            <p class="subtitle">6 причин выбрать Aqueduto</p>
          </div>

          <div
            ref="advantages-slider"
            class="slider laptop:flex-wrap max-laptop:gap-[16px] text-[14px] laptop:text-[16px]/[24px]"
          >
            <div
              v-for="(item, index) in homeData.advantages"
              :key="item.id"
              :ref="(el) => advantagesSliderItems[index] = el"
              class="slider-item advantage-item"
            >
              <img class="advantage-icon" :src="item.icon" alt="">
              <div>
                <h6>{{ item.title }}</h6>
                <div class="advantage-text">{{ item.description }}</div>
              </div>
            </div>
          </div>

          <div class="dot-pagination mt-[12px]">
            <div
              v-for="(_, index) in advantagesSlider.scrollPointsCount.value"
              :key="index"
              :class="{
                'dot-pagination-item': true,
                'active': advantagesSlider.activeItem.value === index
              }"
              @click="advantagesSlider.goToSlide(index)"
            ></div>
          </div>
        </section>
      </div>
    </div>

    <section class="bg-brand-600 py-[48px] laptop:py-[40px]">
      <div class="container">
        <div class="grid gap-[16px] items-center laptop:grid-cols-2 max-laptop:text-center">
          <h2 class="text-white m-0">
            Наша философия
          </h2>
          <p class="text-white font-semibold">
            Мы верим в то, что сантехника — это не фурнитура, а часть архитектуры дома. Поэтому делаем её для тех, кто строит пространство надолго — и ценит, когда вещи работают тихо и точно, и выглядят красиво.
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section class="grid text-center">
          <h2>Готовые решения</h2>
          <p class="subtitle">
            Интерьер вашей ванной в едином стиле
          </p>

          <div class="bento slider flex-row mt-[24px] laptop:mt-[32px]">
            <NuxtLink
              v-for="style in styles"
              :key="style.id"
              class="image-gradient zoom-hover style-item"
              :style="{ '--bg': `url(${style.thumbnail})` }"
              :to="`/gallery/${style.slug}`"
            >
              <span class="style-item-name">
                {{ style.title }}
              </span>
            </NuxtLink>
          </div>

          <NuxtLink
            to="/gallery"
            class="button button-tertiary mt-[16px] laptop:mt-[32px] laptop:mx-auto"
          >
            Посмотреть все
          </NuxtLink>
        </section>

        <section>
          <div class="flex max-laptop:flex-col justify-between items-center gap-[24px] max-laptop:mb-[16px]">
            <div class="max-laptop:text-center">
              <h2>Новинки</h2>
              <p class="subtitle">
                Свежие решения для вашей ванной
              </p>
            </div>

            <div class="arrows self-end">
              <button
                class="arrow arrow-left"
                @click="productsSlider.scrollLeft"
              ></button>
              <button
                class="arrow arrow-right"
                @click="productsSlider.scrollRight"
              ></button>
           </div>
          </div>

          <div
            ref="products-slider"
            class="slider laptop:py-[32px]"
          >
            <ProductCard
              v-for="product in homeData.new_products"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>

        <section>
          <h2 class="text-center">Каталог</h2>
          <div class="grid laptop:grid-cols-2 gap-[12px_24px] mt-[24px] laptop:mt-[32px]">
            <NuxtLink
              v-for="item in homeData.materials"
              :key="item.id"
              class="material-item image-gradient zoom-hover image-link"
              :to="item.url"
              :style="{ '--bg': `url(${item.image})` }"
              :target="item.download ? '_blank' : ''"
            >
              <h4>{{ item.title }}</h4>
              <p>{{ item.text }}</p>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .index-title {
    font-size: 28px;
    text-align: center;
    line-height: 1.2;

    @variant laptop {
      font-size: 80px;
      margin-bottom: 64px;
      letter-spacing: -0.02em;
    }
  }

  .material-item {
    display: grid;
    min-height: 216px;
    align-content: end;
    border-radius: 20px;
    color: white;
    padding: 12px 16px;

    @variant laptop {
      height: 336px;
      border-radius: 32px;
      padding: 20px 24px;
    }

    @variant desktop {
      height: 400px;
    }
  }
}
</style>
