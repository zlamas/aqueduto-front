<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProductCard from "@/components/ProductCard.vue";
import {formatCurrency} from "@/assets/js/funcs.js";
import {useAPI} from "@/composables/useAPI.js";
import useSimpleSlider from "@/composables/useSimpleSlider.js";

const { slug } = useRoute().params

const { data: style } = await useAPI(`/gallery/${slug}`)

const styleData = style.value.data

const title = styleData.title

useHead({ title })

const page = ref(1)
const perPage = 8

const hotspotCard = useTemplateRef('hotspot-card')

const slideIndex = ref(null)
const selectedHotspot = ref(null)
const activeHotspot = ref(null)
let hoverTimeout = null

const cardHotspotOffset = 8
const cardEdgeOffset = 16

function positionProductCard(button, slideIndex) {
  nextTick().then(() => {
    const slideRect = imagesSliderItems.value[slideIndex].getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const cardRect = hotspotCard.value.$el.getBoundingClientRect()
    let style = {
      bottom: null,
      left: null,
      top: null,
      right: null,
    }

    if (buttonRect.left + cardRect.width > slideRect.right - cardEdgeOffset) {
      style.right = `${cardEdgeOffset}px`
    } else {
      style.left = `${buttonRect.left - slideRect.left}px`
    }

    if (buttonRect.top - cardHotspotOffset - cardRect.height < slideRect.top + cardEdgeOffset) {
      style.top = `${buttonRect.bottom - slideRect.top + cardHotspotOffset}px`
    } else {
      style.bottom = `${slideRect.bottom - buttonRect.top + cardHotspotOffset}px`
    }

    Object.assign(hotspotCard.value.$el.style, style)
  })
}

function closeHotspot() {
  selectedHotspot.value = null
  activeHotspot.value = null
}

function onHotspotHover(button, hotspot, index) {
  if (!activeHotspot.value) {
    hoverTimeout = setTimeout(
      () => {
        selectedHotspot.value = hotspot
        slideIndex.value = index
        positionProductCard(button, index)
      },
      1000
    )
  }
}

function onHotspotLeave() {
  if (!activeHotspot.value) {
    closeHotspot()
  }

  clearTimeout(hoverTimeout)
}

function onHotspotClick(button, hotspot, i, j) {
  if (activeHotspot.value !== `${i}.${j}`) {
    selectedHotspot.value = hotspot
    slideIndex.value = i
    activeHotspot.value = `${i}.${j}`
    positionProductCard(button, i)
  } else {
    closeHotspot()
  }
}

const imagesSliderContainer = useTemplateRef('images-slider')
const imagesSliderItems = ref([])
const imagesSlider = useSlider(imagesSliderContainer, imagesSliderItems)

const relatedSliderContainer = useTemplateRef('related-slider')
const relatedSlider = useSimpleSlider(relatedSliderContainer)

function createImageSliderRef(el, i, url) {
  imagesSliderItems.value[i] = el

  let img = new Image()

  img.onload = () => {
    let { width, height } = img
    el.style.setProperty('--width', width)
    el.style.setProperty('--height', height)
  }

  img.src = url
}

let autoScrollInterval

onMounted(() => autoScrollInterval = setInterval(imagesSlider.nextSlide, 5000))
onUnmounted(() => clearInterval(autoScrollInterval))
</script>

<template>
  <main class="layout">
    <section
      class="hero-banner hero-banner-large grid max-laptop:h-[314px] image-gradient"
      :style="{ '--bg': `url(${styleData.hero_image})` }"
    >
      <div class="container grid">
        <Breadcrumb :items="[ { name: 'Галерея', path: '/gallery' }, { name: title } ]" />

        <div class="absolute place-self-center bg-black/20 backdrop-blur-[10px] rounded-[12px] laptop:rounded-[30px] mx-[16px] p-[24px_12px] laptop:p-[32px_64px] text-center laptop:w-[836px]">
          <h1 class="text-text-inverse">
            {{ styleData.title }}
          </h1>
          <p class="text-text-inverse max-laptop:text-[14px]/[20px]">
            {{ styleData.description }}
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section>
          <div class="grid laptop:grid-cols-[auto_830px] gap-[8px]">
            <h2 class="m-0">Используемые коллекции</h2>
            <p>
              {{ styleData.intro_text }}
            </p>
          </div>

          <div class="grid mt-[32px]">
            <div class="justify-self-end flex gap-[8px] mb-[16px] laptop:hidden">
              <button
                class="arrow arrow-left"
                @click="imagesSlider.previousSlide"
              ></button>
              <button
                class="arrow arrow-right"
                @click="imagesSlider.nextSlide"
              ></button>
            </div>

            <div class="relative flex items-center">
              <div
                ref="images-slider"
                class="slider flex-1"
              >
                <div
                  v-for="(slide, i) in styleData.images"
                  :key="slide.id"
                  :ref="(el) => createImageSliderRef(el, i, slide.url)"
                  class="slider-item style-page-item"
                  @click="closeHotspot"
                >
                  <div
                    class="hotspot-wrapper"
                    :style="{ '--bg': `url(${slide.url})` }"
                  >
                    <button
                      v-for="(hotspot, j) in slide.hotspots"
                      :class="{
                        'hotspot': true,
                        'active': activeHotspot === `${i}.${j}`,
                      }"
                      :style="{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }"
                      @pointerover="onHotspotHover($event.target, hotspot, i)"
                      @pointerleave="onHotspotLeave()"
                      @click.stop="onHotspotClick($event.target, hotspot, i, j)"
                    ></button>
                  </div>
                </div>

                <Teleport
                  :to="imagesSliderItems[slideIndex]"
                  :disabled="!imagesSliderItems[slideIndex]"
                >
                  <NuxtLink
                    ref="hotspot-card"
                    :to="`/product/${selectedHotspot?.product.slug}`"
                    :class="{
                      'absolute w-max flex gap-[12px] bg-white rounded-[16px] p-[8px]': true,
                      'invisible': !selectedHotspot,
                    }"
                    :style="{
                      maxWidth: `min(calc(100% - ${cardEdgeOffset * 2}px), 320px)`
                    }"
                  >
                    <img
                      class="size-[96px] laptop:size-[116px] bg-backdrop rounded-[8px]"
                      :src="selectedHotspot?.product.image"
                      alt=""
                    >

                    <div>
                      <div class="font-semibold mb-[8px]">
                        {{ selectedHotspot?.product.name }}
                      </div>
                      <div class="w-max bg-neutral-100 rounded-full p-[4px_12px] text-[12px]/[16px] font-medium mb-[12px]">
                        {{ selectedHotspot?.product.collection.name }}
                      </div>
                      <h6 class="m-0">
                        {{ formatCurrency(selectedHotspot?.product.price) }}
                      </h6>
                    </div>

                    <button class="button button-secondary p-[8px] rounded-[8px] ml-[12px]">
                      <img src="~/assets/icons/arrow-right.svg" alt="">
                    </button>
                  </NuxtLink>
                </Teleport>
              </div>

              <button
                class="arrow arrow-left absolute left-0 -translate-x-1/2 max-laptop:hidden"
                @click="imagesSlider.previousSlide"
              ></button>
              <button
                class="arrow arrow-right absolute right-0 translate-x-1/2 max-laptop:hidden"
                @click="imagesSlider.nextSlide"
              ></button>
            </div>

            <div class="dot-pagination mt-[12px]">
              <div
                v-for="(_, index) in imagesSlider.scrollPointsCount.value"
                :class="{
                  'dot-pagination-item': true,
                  'active': imagesSlider.activeItem.value === index
                }"
                @click="imagesSlider.goToSlide(index)"
              ></div>
            </div>
          </div>
        </section>

        <section class="grid gap-[24px] laptop:gap-[32px]">
          <h2 class="m-0">Используемые товары</h2>

          <div class="grid grid-cols-2 grid-rows-[auto_auto] grid-flow-col gap-[4px] bg-neutral-100 p-[12px_16px] laptop:p-[16px_32px] rounded-[16px]">
            <div class="text-neutral-500">Позиций</div>
            <div class="text-[20px]/[32px] laptop:text-[24px] font-bold">
              {{ styleData.products_summary.count }}
            </div>
            <div class="text-neutral-500">Общая стоимость</div>
            <div class="text-[20px]/[32px] laptop:text-[24px] font-bold">
              {{ formatCurrency(styleData.products_summary.total_price) }}
            </div>
          </div>

          <div class="grid gap-[16px]">
            <div class="product-grid">
              <ProductCard
                v-for="product in styleData.products.slice(0, page * perPage)"
                :key="product.id"
                v-bind="product"
              />
            </div>

            <button
              v-show="page * perPage < styleData.products_summary.count"
              class="button button-tertiary laptop:mx-auto"
              @click="page += 1"
            >
              Показать еще
            </button>
          </div>
        </section>

        <section>
          <div class="flex justify-center laptop:justify-between">
            <h2 class="m-0">Смотрите также</h2>
            <div class="arrows max-laptop:hidden">
              <button
                class="arrow arrow-left"
                @click="relatedSlider.scrollLeft"
              ></button>
              <button
                class="arrow arrow-right"
                @click="relatedSlider.scrollRight"
              ></button>
            </div>
          </div>

          <div
            ref="related-slider"
            class="slider mt-[24px] laptop:mt-[32px]"
          >
            <NuxtLink
              v-for="style in styleData.related_styles"
              :key="style.id"
              class="slider-item image-gradient zoom-hover style-item image-link"
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
            class="button button-tertiary mt-[16px] w-full laptop:hidden"
          >
            Посмотреть все
          </NuxtLink>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  @variant laptop {
    .style-item {
      width: calc(50% - 12px);
    }
  }

  .style-page-item {
    position: relative;
    height: 380px;
    width: 100%;
    border-radius: 32px;
    overflow: hidden;
    scroll-snap-align: start;
    scroll-snap-stop: always;

    @variant laptop {
      height: 472px;
      width: calc(50% - 12px);
    }
  }

  .hotspot-wrapper {
    position: relative;
    aspect-ratio: var(--width) / var(--height);
    background: var(--bg) center / cover;
    min-width: 100%;
    min-height: 100%;
    place-self: center;
  }

  .hotspot {
    --opacity-inner: 0.1;
    --opacity-outer: 0.7;
    --border: 1px;
    --size: 12px;
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, var(--opacity-inner));
    border: var(--border) solid rgba(255, 255, 255, var(--opacity-outer));
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
    translate: -50% -50%;
  }

  .hotspot::after {
    content: "";
    display: block;
    width: var(--size);
    height: var(--size);
    background: white;
    border-radius: 50%;
    margin: auto;
    transition: 0.2s;
  }

  .hotspot:hover,
  .hotspot.active {
    --opacity-inner: 0.3;
    --opacity-outer: 1;
    --size: 16px;
  }

  .hotspot.active {
    --border: 2px;
  }
}
</style>
