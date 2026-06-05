<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";
import {formatCurrency} from "@/assets/js/funcs.js";

const { slug } = useRoute().params

const { data: style } = await useAPI(`/gallery/${slug}`)

const styleData = style.value.data

const title = styleData.title

useHead({ title })

const slideIndex = ref(null)
const selectedHotspot = ref(null)
const activeHotspot = ref(null)
let hoverTimeout = null

const slides = [
  { image: '/images/style-page-1.png', flexGrow: 3, flexBasis: '40%' },
  { image: '/images/style-page-2.png', flexGrow: 1, flexBasis: '40%' },
  { image: '/images/style-page-3.png', flexGrow: 2, flexBasis: '20%' },
  { image: '/images/style-page-4.png', flexGrow: 1, flexBasis: '20%' },
  { image: '/images/style-page-5.png', flexGrow: 2, flexBasis: '20%' },
]

const hotspots = [
  [
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '65.5%', left: '2.9%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '57.5%', left: '7.8%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '66.9%', left: '13.6%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '46.7%', left: '35.0%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '63.3%', left: '36.6%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '71.8%', left: '63.1%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '61.9%', left: '70.1%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '73.0%', left: '76.0%' }
    },
  ],
  [
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '60.2%', left: '27.7%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '77.5%', left: '41.4%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '58.3%', left: '51.2%' }
    },
  ],
  [
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '68.1%', left: '54.0%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '32.4%', left: '60.3%' }
    },
  ],
  [
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '61.4%', left: '22.1%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '51.9%', left: '39.7%' }
    },
  ],
  [
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '68.3%', left: '33.8%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '26.4%', left: '48.6%' }
    },
    {
      name: 'Унитаз напольный',
      collection: 'OVO Tornado Light',
      price: 28000,
      style: { top: '38.1%', left: '79.4%' }
    },
  ],
]

function onHotspotHover(hotspot, index) {
  if (activeHotspot.value === null) {
    hoverTimeout = setTimeout(
      () => {
        selectedHotspot.value = hotspot
        slideIndex.value = index
      },
      1000
    )
  }
}

function onHotspotLeave() {
  if (activeHotspot.value === null) {
    selectedHotspot.value = null
    slideIndex.value = null
  }

  clearTimeout(hoverTimeout)
}

function onHotspotClick(hotspot, i, j) {
  selectedHotspot.value = hotspot
  slideIndex.value = i
  activeHotspot.value = `${i}.${j}`
}
</script>

<template>
  <main class="layout pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section
      class="hero-banner image-gradient grid desktop:h-[800px] desktop:rounded-[32px] desktop:p-[32px_160px] desktop:shadow-[0_4px_4px_#00000040]"
      :style="{ '--bg': `url(${styleData.hero_image})` }"
    >
      <Breadcrumb
        :items="[ { name: 'Галерея', path: '/gallery' }, { name: title } ]"
        class="place-self-start"
      />
      <div class="absolute place-self-center bg-[#00000033] backdrop-blur-[10px] rounded-[12px] desktop:rounded-[30px] mx-[16px] p-[24px_12px] desktop:p-[32px_64px] text-center desktop:w-[836px]">
        <h1 class="text-[#FCFCFD]">
          {{ styleData.title }}
        </h1>
        <p class="text-[#FCFCFD] max-desktop:text-[14px]/[20px]">
          {{ styleData.description }}
        </p>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section>
          <div class="grid desktop:grid-cols-2">
            <h2 class="max-w-[500px]">Используемые коллекции</h2>
            <p>
              {{ styleData.intro_text }}
            </p>
          </div>

          <div class="grid gap-[16px] mt-[32px] desktop:mt-[40px]">
            <div class="justify-self-end flex gap-[8px] desktop:hidden">
              <button
                class="arrow arrow-left"
              ></button>
              <button
                class="arrow arrow-right"
              ></button>
            </div>

            <div class="slider desktop:flex-wrap">
              <div
                v-for="(slide, i) in slides"
                class="slider-item style-page-item"
                :style="{
                  '--bg': `url(${slide.image})`,
                  '--flex-grow': slide.flexGrow,
                  '--flex-basis': slide.flexBasis,
                }"
              >
                <button
                  v-for="(hotspot, j) in hotspots[i]"
                  :class="{
                    'hotspot': true,
                    'active': activeHotspot === `${i}.${j}`,
                  }"
                  :style="hotspot.style"
                  @pointerover="onHotspotHover(hotspot, i)"
                  @pointerleave="onHotspotLeave()"
                  @click="onHotspotClick(hotspot, i, j)"
                ></button>

                <div
                  v-if="i === slideIndex"
                  v-show="selectedHotspot"
                  class="absolute grid justify-items-start min-w-[176px] bg-white rounded-[16px] p-[8px_12px] -translate-x-[8px] -translate-y-[calc(100%+16px)]"
                  :style="selectedHotspot?.style"
                >
                  <div class="font-semibold mb-[8px]">
                    {{ selectedHotspot?.name }}
                  </div>
                  <div class="bg-[#F1F5F9] rounded-full p-[4px_12px] text-[12px]/[16px] font-medium mb-[12px]">
                    {{ selectedHotspot?.collection }}
                  </div>
                  <h6 class="m-0">
                    {{ formatCurrency(selectedHotspot?.price) }}
                  </h6>
                </div>
              </div>

            </div>

            <div class="dot-pagination">
              <div
                v-for="index in 5"
                :class="{
                  'dot-pagination-item': true,
                  'active': 1 === index
                }"
              ></div>
            </div>
          </div>
        </section>

        <section class="grid gap-[24px] desktop:gap-[40px]">
          <h2 class="m-0">Используемые товары</h2>

          <div class="grid grid-cols-2 grid-rows-[auto_auto] grid-flow-col gap-[4px] bg-[#F1F5F9] p-[12px_16px] desktop:p-[16px_32px] rounded-[16px]">
            <div class="text-quaternary">Позиций</div>
            <div class="text-[20px]/[32px] desktop:text-[24px] font-bold">
              {{ styleData.products_summary.count }}
            </div>
            <div class="text-quaternary">Общая стоимость</div>
            <div class="text-[20px]/[32px] desktop:text-[24px] font-bold">
              {{ formatCurrency(styleData.products_summary.total_price) }}
            </div>
          </div>

          <div class="product-grid">
            <ProductCard
              v-for="product in styleData.products"
              :key="product.id"
              v-bind="product"
            />
          </div>
        </section>

        <section>
          <div class="flex justify-center desktop:justify-between">
            <h2 class="m-0">Смотрите также</h2>
            <div class="arrows max-desktop:hidden">
              <button
                class="arrow arrow-left"
              ></button>
              <button
                class="arrow arrow-right"
              ></button>
            </div>
          </div>
          <div class="slider max-desktop:flex-wrap mt-[24px] desktop:mt-[40px]">
            <NuxtLink
              v-for="style in styleData.related_styles"
              :key="style.id"
              class="slider-item image-gradient style-item"
              :style="{ '--bg': `url(${style.thumbnail})` }"
              :to="`/gallery/${style.slug}`"
              :data-name="style.title"
            > </NuxtLink>
<!--            <NuxtLink to="/gallery/style" class="slider-item style-item image-gradient [&#45;&#45;bg:url(/images/style-4.jpg)] max-desktop:basis-full" data-name="Минимализм с характером"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="slider-item style-item image-gradient [&#45;&#45;bg:url(/images/style-11.jpg)]" data-name="Традиции"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="slider-item style-item image-gradient [&#45;&#45;bg:url(/images/style-3.jpg)]" data-name="Неомодерн"> </NuxtLink>-->
          </div>
          <button class="button-rounded mt-[16px] w-full desktop:hidden">
            Посмотреть все
          </button>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .style-item {
    flex-basis: calc(50% - 12px);
  }

  .style-page-item {
    position: relative;
    height: 380px;
    background: var(--bg) center / cover;
    border-radius: 36px;
    scroll-snap-align: start;
    scroll-snap-stop: always;

    @variant max-desktop {
      min-width: 100%;
    }

    @variant desktop {
      height: 480px;
      flex: var(--flex-grow) var(--flex-basis);
    }
  }

  .hotspot {
    --color: 140, 176, 200;
    --opacity-inner: 0.6;
    --opacity-outer: 0.3;
    position: absolute;
    width: 24px;
    height: 24px;
    background: rgba(var(--color), var(--opacity-inner)) url(~/assets/icons/hotspot.svg) center / 16px no-repeat;
    border-radius: 50%;
    box-shadow: 0 0 0 8px rgba(var(--color), var(--opacity-outer));
    cursor: pointer;
  }

  .hotspot.active {
    --opacity-inner: 0.8;
    --opacity-outer: 0.5;
    rotate: 45deg;
  }
}
</style>
