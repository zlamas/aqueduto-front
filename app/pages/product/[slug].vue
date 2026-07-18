<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";
import {formatCurrency} from "@/assets/js/funcs";

const route = useRoute()
const { slug } = route.params
const { variant_id } = route.query

const currentColor = ref(null)
const productData = ref(null)

const { data: product } = await useAPI(`/products/${slug}`, {
  query: currentColor,

  onRequest({ options }) {
    if (options.query) {
      options.query = { variant_id: options.query.variant_id }
    }
  },

  onResponse({ response }) {
    productData.value = response._data.data
  }
})
const { data: similar } = await useAPI(`/products/${slug}/similar`)

productData.value = product.value.data
const similarData = similar.value.data

const title = productData.value.name

useHead({ title })

if (productData.value.colors && !currentColor.value) {
  if (variant_id != null) {
    currentColor.value = productData.value.colors.find((color) => color.variant_id === Number(variant_id))
  } else {
    currentColor.value = productData.value.colors.find((color) => color.is_default)
  }
}

watch(
  currentColor,
  (color) => {
    if (color.variant_id) {
      window.history.pushState({}, '', `${window.location.pathname}?variant_id=${color.variant_id}`)
    }
  }
)

const tabs = {
  specs: 'Характеристики',
  documents: 'Материалы',
  features: 'Комплектация'
}

const currentTab = ref(Object.keys(tabs)[0])

const attributes = productData.value.attributes.flatMap((group) => group.items)

const isFavorite = ref(productData.value.is_favorite)
const isInComparison = ref(productData.value.is_in_comparison)

function toggleFavorite() {
  useAPI(`/favorites/${productData.value.id}`, { method: isFavorite.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isFavorite.value = !isFavorite.value
    })
}

function toggleComparison() {
  useAPI(`/comparison/${productData.value.id}`, { method: isInComparison.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isInComparison.value = !isInComparison.value
    })
}

const imagesSliderContainer = useTemplateRef('images-slider')
const imagesSliderItems = ref([])
const imagesSlider = useSlider(imagesSliderContainer, imagesSliderItems)

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)
</script>

<template>
  <main class="laptop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: 'Каталог', path: '/catalog' }, { name: title } ]"
        class="mb-[48px]"
        :light="true"
      />

      <div class="flex flex-col laptop:grid laptop:grid-cols-2 items-start gap-[24px] mb-[48px] laptop:mb-[64px]">
        <div class="flex items-center justify-center relative rounded-[24px] laptop:rounded-[40px] overflow-hidden">
          <button
            class="arrow arrow-left absolute left-[12px] max-laptop:hidden"
            :disabled="imagesSlider.activeItem.value === 0"
            @click="imagesSlider.previousSlide"
          ></button>
          <button
            class="arrow arrow-right absolute right-[12px] max-laptop:hidden"
            :disabled="imagesSlider.activeItem.value === imagesSlider.scrollPointsCount.value - 1"
            @click="imagesSlider.nextSlide"
          ></button>

          <div
            class="slider"
            ref="images-slider"
          >
            <template v-for="(media, i) in productData.gallery">
              <img
                v-if="media.media_type === 'image'"
                :ref="(el) => imagesSliderItems[i] = el"
                class="slider-item size-full"
                :src="media.url"
                alt=""
              >
              <video
                v-else-if="media.media_type === 'video'"
                :ref="(el) => imagesSliderItems[i] = el"
                class="slider-item size-full"
                :src="media.url"
              ></video>
            </template>
          </div>

          <div class="pill-pagination absolute bottom-[16px]">
            <div
              v-for="(_, index) in imagesSlider.scrollPointsCount.value"
              :class="{
                'pill-pagination-item': true,
                'active': imagesSlider.activeItem.value === index
              }"
              @click="imagesSlider.goToSlide(index)"
            ></div>
          </div>
        </div>

        <div class="grid gap-[24px] laptop:gap-[44px]">
          <div class="grid gap-[24px] laptop:gap-[32px]">
            <div>
              <h3 class="mb-[8px]">
                {{ productData.name }}
              </h3>

              <div class="flex laptop:flex-col-reverse items-center laptop:items-start justify-between gap-[16px] text-[14px]">
                <div class="bg-neutral-100 rounded-full p-[4px_12px] font-medium">
                  {{ productData.collection.name }}
                </div>
                <div class="text-neutral-500">
                  Артикул {{ currentColor?.article || productData.article }}
                </div>
              </div>
            </div>

            <div
              v-if="productData.colors?.length"
            >
              <div>
                <span class="text-neutral-500">Цвет: </span>
                <span>{{ currentColorData?.name }}</span>
              </div>

              <div class="flex gap-[8px] overflow-x-auto scrollbar-none mt-[12px] max-laptop:-mx-[16px] max-laptop:px-[16px]">
                <img
                  v-for="color in productData.colors"
                  :key="color.id"
                  :class="{
                    'color-preview': true,
                    'selected': currentColor.id === color.id
                  }"
                  :src="color.image"
                  :alt="color.name"
                  :title="color.name"
                  @click="currentColor = color"
                >
              </div>
            </div>

            <div>
              <h5 class="mb-[8px]">Описание</h5>
              <div class="text-neutral-500">
                {{ productData.description }}
              </div>
            </div>
          </div>

          <div>
            <h3 class="m-0">
              {{ formatCurrency(currentColor?.price || productData.price) }}
            </h3>
            <div class="text-[14px]/[20px] text-neutral-500">
              Рекоменд. розничная цена
            </div>

            <div class="flex flex-wrap gap-[8px] mt-[16px]">
              <NuxtLink
                :to="productData.buy_url"
                class="button button-primary py-[12px] leading-[24px] w-full"
              >
                Купить у партнеров
              </NuxtLink>

              <button
                class="button button-secondary py-[12px] leading-[24px] flex-1 whitespace-nowrap"
                @click="toggleFavorite"
              >
                <img class="size-[20px]" src="~/assets/icons/favorite.svg" alt="">
                <span>
                  {{ isFavorite ? 'В избранном' : 'В “Избранное”' }}
                </span>
              </button>

              <button
                class="button button-secondary py-[12px] leading-[24px] flex-1 whitespace-nowrap"
                @click="toggleComparison"
              >
                <img class="size-[20px]" src="~/assets/icons/compare.svg" alt="">
                <span class="max-laptop:hidden">
                  {{ isInComparison ? 'В сравнении' : 'Добавить к сравнению' }}
                </span>
                <span class="laptop:hidden">
                  {{ isInComparison ? 'В сравнении' : 'К сравнению' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section :class="{
        'grid gap-[16px] laptop:gap-[32px] mx-auto mb-[64px] laptop:mb-[128px]': true,
        'w-max max-w-full': currentTab === 'documents'
      }">
        <div class="flex laptop:justify-center gap-[8px] laptop:gap-[24px] -mx-[16px] px-[16px] scrollbar-none overflow-x-auto">
          <button
            v-for="(name, id) in tabs"
            :key="id"
            :class="{
              'tab': true,
              'selected': id === currentTab,
            }"
            @click="currentTab = id"
          >
            {{ name }}
          </button>
        </div>

        <div
          v-show="currentTab === 'specs'"
          class="spec-list"
        >
          <div
            v-for="spec in attributes"
            :key="spec.key"
            class="spec-row"
          >
            <span class="spec-name">{{ spec.name }}</span>
            <span class="spec-value">{{ spec.value }}</span>
          </div>
        </div>

        <div
          v-show="currentTab === 'documents'"
          class="grid gap-[8px]"
        >
          <DownloadItem
            v-for="document in productData.documents"
            :title="document.title"
            :url="document.url"
            :type="document.type"
          />
        </div>

        <div v-show="currentTab === 'features'">
          <ul class="grid gap-[4px] list-inside list-disc text-neutral-700">
            <li>Безободковая конструкция для максимальной гигиены и лёгкой очистки</li>
            <li>Быстросъёмное сиденье из высококачественного дюропласта с функцией плавного закрывания (микролифт)</li>
            <li>Антигрязевое покрытие, которое отталкивает загрязнения и сохраняет белизну надолго</li>
            <li>Повышенная устойчивость к царапинам и механическим повреждениям</li>
            <li>Тихий и мощный смыв с регулируемой силой потока</li>
          </ul>
        </div>
      </section>

      <section>
        <div class="flex max-laptop:flex-col items-center justify-between gap-[24px] max-laptop:mb-[16px]">
          <h3 class="m-0">Похожие товары</h3>

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
            v-for="product in similarData"
            :key="product.id"
            v-bind="product"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.color-preview {
  width: 80px;
  height: 80px;
  border: 2px solid var(--color-neutral-200);
  border-radius: 12px;
  background: var(--color-backdrop);
  padding: 12px;
  cursor: pointer;
}

.color-preview.selected {
  background: var(--color-brand-25);
  border-color: var(--color-brand-600);
}

.tab {
  @variant max-laptop {
    background: var(--color-neutral-100);
    border-radius: 9999px;
    color: var(--color-neutral-600);
    padding: 10px 16px;
  }

  @variant laptop {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: var(--color-neutral-500);
    padding: 10px 12px;
  }
}

.tab.selected {
  @variant max-laptop {
    background: var(--color-neutral-300);
    color: var(--color-neutral-800);
  }

  @variant laptop {
    position: relative;
    color: var(--color-brand-950);
  }
}

@variant laptop {
  .tab.selected::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: var(--color-brand-500);
  }
}

.spec-list {
  @variant laptop {
    columns: 2;
    gap: 80px;
  }
}

.spec-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--color-neutral-300);
  padding-block: 16px;
}

.spec-name {
  color: var(--color-neutral-500);
}

.spec-value {
  font-weight: 600;
  text-align: right;

  @variant max-laptop {
    color: var(--color-neutral-700);
  }
}
</style>
