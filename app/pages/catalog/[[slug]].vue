<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import HeroSlider from "@/components/HeroSlider.vue";
import ProductCard from "@/components/ProductCard.vue";
import Dropdown from "@/components/Dropdown.vue";
import Search from "@/components/Search.vue";
import {useAPI} from "@/composables/useAPI.js";
import {debounce, formatCurrency, filterQuery} from "@/assets/js/funcs.js";

const title = 'Каталог'

useHead({ title })

const { $api } = useNuxtApp()

const productsParams = ref({
  page: 1,
  per_page: 24,
  filters: {}
})

const { slug } = useRoute().params

if (slug) {
  productsParams.value.category = slug
}

const priceRange = ref([])
const minPrice = ref(null)
const maxPrice = ref(null)

const selectedCategory = computed(() => productsParams.value.category)

const isLoading = ref(false)

const productsMeta = ref(null)
const products = ref([])

const productWrapper = useTemplateRef('product-wrapper')

function nextPage() {
  if (productsMeta.value.current_page >= productsMeta.value.last_page || isLoading.value) return

  const wrapperBottom = productWrapper.value.getBoundingClientRect().bottom

  if (wrapperBottom < window.innerHeight) {
    productsParams.value.page += 1
    isLoading.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', nextPage)
})

onUnmounted(() => {
  window.removeEventListener('scroll', nextPage)
})

function formatQuery({ options }) {
  const filters = Object.fromEntries(
    Object.entries(options.query.filters).flatMap(
      ([key, value]) => value.map(
        (item, index) => [`filters[${key}][${index}]`, item]
      )
    )
  )

  Object.assign(options.query, filters)
  delete options.query.filters
}

const activeFilters = computed(() =>
  Object.entries(productsParams.value.filters).filter(([key, value]) => value.length)
)

const { data: productsData } = await useAPI('/products', {
  query: productsParams,

  onRequest: formatQuery,

  onResponse({ response }) {
    if (response._data.meta.current_page === 1) {
      products.value.length = 0
    }

    products.value.push(...response._data.data)
    productsMeta.value = response._data.meta
    isLoading.value = false
  }
})

products.value = productsData.value.data
productsMeta.value = productsData.value.meta

function resetProducts() {
  productsParams.value.page = productsMeta.value.current_page = 1
}

function updateCategory(newCategory) {
  delete productsParams.value.price_min
  delete productsParams.value.price_max
  productsParams.value.category = newCategory
  resetProducts()
  window.history.pushState({}, '', `/catalog/${newCategory}`)
}

function applyPriceRange() {
  Object.assign(
    productsParams.value,
    { price_min: minPrice.value, price_max: maxPrice.value }
  )
  resetProducts()
}

const { data: catalogData } = await useAPI('/catalog')
const { data: collectionData } = await useAPI('/collections')
const { data: filtersData } = await useAPI('/catalog/filters', {
  query: { category: selectedCategory },

  onResponse({ response }) {
    const range = response._data.data.find((filter) => filter.key === 'price').values
    priceRange.value = range.map(Number)
    minPrice.value = range[0]
    maxPrice.value = range[1]

    productsParams.value.filters = Object.fromEntries(
      response._data.data
        .filter((filter) => filter.key !== 'price')
        .map((filter) => [filter.key, []])
    )
  }
})

const { banners, categories } = catalogData.value
const collections = collectionData.value.data
const filters = computed(() => filtersData?.value?.data)

const range = getFilterByName('price').values
priceRange.value = range.map(Number)
minPrice.value = range[0]
maxPrice.value = range[1]

const productQuery = ref('')
const queries = ref({})

function getFilterByName(name) {
  return filters.value?.find((filter) => filter.key === name)
}

function getFilteredValues(filter) {
  return filterQuery(queries.value[filter], getFilterByName(filter)?.values)
}

watch(
  minPrice,
  () => {
    if (minPrice.value > maxPrice.value) {
      minPrice.value = maxPrice.value
    }
  }
)

watch(
  maxPrice,
  () => {
    if (maxPrice.value < minPrice.value) {
      maxPrice.value = minPrice.value
    }
  }
)

watch(
  productQuery,
  (value) => Object.assign(
    productsParams.value,
    { search: value }
  ),
)

const priceProductCount = ref(products.value.length)

const fetchProductsPriceDebounce = debounce(() => {
  const params = Object.assign(
    {},
    productsParams.value,
    { price_min: minPrice.value, price_max: maxPrice.value }
  )

  $api('/products', {
    query: params,
    onRequestOverride: formatQuery,
  }).then(({ data }) => {
    priceProductCount.value = data.length
  })
})

watch(
  [minPrice, maxPrice],
  () => fetchProductsPriceDebounce(500),
)

const sortingOptions = {
  price_asc: 'Сначала дешевые',
  price_desc: 'Сначала дорогие',
  popularity: 'По популярности',
  name_asc: 'По названию (A-Z)',
  name_desc: 'По названию (Z-A)',
}

const priceGraphPoints = [
   16.9,
    5.0,
   25.0,
   29.4,
    7.5,
    5.0,
   21.3,
   40.0,
   16.9,
   48.1,
   10.0,
   27.5,
   16.9,
   48.1,
   16.9,
   25.0,
   10.0,
   12.5,
   16.9,
   27.5,
   12.5,
   36.9,
  100.0,
   16.9,
   16.9,
]

const categorySliderContainer = useTemplateRef('category-slider')
const categorySlider = useSimpleSlider(categorySliderContainer)
</script>

<template>
  <main class="pt-[24px]">
    <div class="max-laptop:px-[16px]">
      <section
        v-if="banners?.length"
        class="hero-banner max-laptop:rounded-[20px] max-laptop:h-[256px] [--direction:left] [--opacity:0.6] mb-[32px] laptop:mb-[64px]"
      >
        <div class="container relative z-9">
          <Breadcrumb :items="[ { name: title } ]" />
        </div>

        <HeroSlider :items="banners" />
      </section>
    </div>

    <div class="container">
      <div class="relative flex items-center -mx-[16px] mb-[24px] laptop:mb-[48px]">
        <div class="absolute left-0 bg-linear-to-l to-white w-[6%] h-full pointer-events-none"></div>
        <button
          class="arrow arrow-left absolute left-[16px] max-laptop:hidden"
          :disabled="categorySlider.scrollEdge.value === 'left'"
          @click="categorySlider.scrollLeft"
        ></button>

        <div
          ref="category-slider"
          class="slider gap-[8px] laptop:gap-[12px] pb-[20px] -mb-[20px] m-0 text-neutral-700 text-[18px] text-center font-medium"
        >
          <div
            v-for="(category, index) in categories"
            :key="index"
            :class="{
              'category slider-item': true,
              'selected': productsParams.category === category.slug,
            }"
            @click="updateCategory(category.slug)"
          >
            <img
              class="w-full bg-backdrop rounded-[20px] laptop:h-[192px] object-contain"
              :src="category.icon"
              alt=""
            >
            <span class="grid items-center h-[64px] laptop:h-[72px]">
              {{ category.name }}
            </span>
          </div>
        </div>

        <div class="absolute right-0 bg-linear-to-r to-white w-[6%] h-full pointer-events-none"></div>
        <button
          class="arrow arrow-right absolute right-[16px] max-laptop:hidden"
          :disabled="categorySlider.scrollEdge.value === 'right'"
          @click="categorySlider.scrollRight"
        ></button>
      </div>

      <div class="flex max-laptop:flex-col items-start justify-between gap-[24px]">
        <div class="flex laptop:flex-wrap max-w-[100vw] gap-[8px] laptop:gap-x-[12px] -mx-[16px] px-[16px] scrollbar-none overflow-x-auto overflow-y-hidden">
          <Dropdown
            class="mr-[8px] laptop:mr-[12px]"
            label="Сортировка"
            icon-left="sort"
            content-class="rounded-[20px] p-[16px]"
          >
            <div class="grid gap-[12px]">
              <label
                v-for="(label, value) in sortingOptions"
                :key="value"
                class="flex items-center gap-[9px]"
              >
                <input
                  type="radio"
                  name="sort"
                  v-model="productsParams.sort"
                  :value="value"
                  @change="resetProducts"
                >
                <span>{{ label }}</span>
              </label>
            </div>
          </Dropdown>

          <Dropdown
            v-show="getFilterByName('price')"
            label="Цена"
            content-class="rounded-[20px] p-[16px]"
          >
            <div class="grid gap-[35px] w-[274px]">
              <div>
                <div class="flex justify-center gap-[4px] h-[160px] mt-[32px]">
                  <div
                    v-for="(percent, index) in priceGraphPoints"
                    :key="index"
                    class="relative flex flex-col justify-end items-center"
                  >
                    <div
                      v-if="percent === 100"
                      class="absolute bottom-full flex justify-center bg-neutral-950 rounded-[5px] text-[12px]/[16px] text-white p-[4px_7px] mb-[7px] after:absolute after:bottom-0 after:transform-[translateY(20%)_scaleX(1.5)_rotate(45deg)] after:size-[16px] after:rounded-[3px] after:bg-inherit"
                    >
                      <span class="z-9">{{ formatCurrency(3900) }}</span>
                    </div>
                    <div
                      :class="{
                        'w-[6px] rounded-full': true,
                        'bg-brand-600': percent === 100,
                        'bg-neutral-300': percent < 100
                      }"
                      :style="{
                        height: `${percent}%`
                      }"
                    ></div>
                  </div>
                </div>

                <div class="range-slider">
                  <input
                    type="range"
                    v-model.number="minPrice"
                    :min="priceRange[0]"
                    :max="priceRange[1]"
                    class="range-input"
                  >
                  <input
                    type="range"
                    v-model.number="maxPrice"
                    :min="priceRange[0]"
                    :max="priceRange[1]"
                    class="range-input"
                  >
                </div>
              </div>

              <div class="flex justify-between text-neutral-500">
                <label class="grid gap-[2px]">
                  <span>Мин. цена</span>
                  <input
                    class="price-input"
                    type="number"
                    v-model.number="minPrice"
                  >
                </label>
                <label class="grid gap-[2px]">
                  <span>Макс. цена</span>
                  <input
                    class="price-input"
                    type="number"
                    v-model.number="maxPrice"
                  >
                </label>
              </div>

              <div class="flex gap-[4px] items-center">
                <button
                  class="button button-secondary p-[12px]"
                  @click="[minPrice, maxPrice] = priceRange"
                >
                  <img src="~/assets/icons/trash.svg" alt="">
                </button>
                <button
                  class="button button-primary py-[14px] flex-1"
                  @click="applyPriceRange"
                >
                  Показать {{ priceProductCount }} товаров
                </button>
              </div>
            </div>
          </Dropdown>

          <Dropdown
            v-show="getFilterByName('color')"
            label="Цвет"
            content-class="w-[300px] rounded-[20px] p-[16px]"
          >
            <div class="grid gap-[18px] min-w-[235px] max-h-[330px]">
              <Search v-model="queries.color" />

              <div class="grid gap-[12px] overflow-y-auto">
                <label
                  v-for="color in getFilteredValues('color')"
                  :key="color.value"
                  class="flex items-center gap-[9px]"
                >
                  <input
                    type="radio"
                    name="collections"
                    v-model="productsParams.color"
                    :value="color.value"
                    class="hidden"
                  >
                  <span
                    :class="{
                      'flex size-[24px] rounded-full': true,
                      'border border-neutral-300': color.hex === '#FFFFFF'
                    }"
                    :style="{
                      background: Array.isArray(color.hex) ?
                        `linear-gradient(to right, ${ color.hex.join(',') })` :
                        color.hex
                    }"
                  >
                    <img
                      :class="{
                        'size-[16px] m-auto': true,
                        'hidden': color.value !== productsParams.color
                      }"
                      src="~/assets/icons/checkmark.svg"
                      alt=""
                    >
                  </span>
                  <span>{{ color.name }}</span>
                </label>
              </div>
            </div>
          </Dropdown>

          <Dropdown
            v-for="filter in filters.filter((item) => item.key !== 'price')"
            :label="filter.name"
            content-class="w-[300px] rounded-[20px] p-[16px]"
          >
            <div class="flex flex-col max-h-[332px] gap-[18px]">
              <Search v-model="queries[filter.key]" />

              <div class="grid gap-[12px] flex-1 overflow-y-auto">
                <label
                  v-for="(option, index) in getFilteredValues(filter.key)"
                  :key="index"
                  class="flex items-center gap-[9px]"
                >
                  <input
                    type="checkbox"
                    v-model="productsParams.filters[filter.key]"
                    :value="option"
                  >
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>
          </Dropdown>
        </div>

        <Search
          class="laptop:w-[320px]"
          v-model="productQuery"
          :debounce="500"
        />
      </div>

      <div
        v-show="activeFilters.length"
        class="flex laptop:flex-wrap gap-[12px] mt-[16px] -mx-[16px] px-[16px] whitespace-nowrap scrollbar-none overflow-x-auto"
      >
        <div
          v-for="[filter, value] in activeFilters"
          :key="filter"
          class="filter-badge"
          :title="value.join(', ')"
          @click="productsParams.filters[filter].length = 0"
        >
          <span class="filter-text">
            {{ value.join(', ') }}
          </span>
          <button class="filter-delete">
            <img class="m-auto" src="~/assets/icons/filter-delete.svg" alt="">
          </button>
        </div>
      </div>

      <div
        ref="product-wrapper"
        class="product-grid mt-[32px]"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.category {
  gap: 0;
  width: 140px;
  border-radius: 20px;
  color: var(--color-neutral-600);
  cursor: pointer;

  @variant laptop {
    width: 220px;
    scroll-margin-inline: 60px;
  }
}

.category:hover {
  color: var(--color-neutral-950);
  box-shadow: var(--shadow-md);
}

.category:active,
.category.selected {
  outline: 1px solid var(--color-info-500);
  outline-offset: -1px;
  color: var(--color-brand-950);
  box-shadow: var(--shadow-lg);
}

.filter-badge {
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-info-50);
  border-radius: 9999px;
  color: var(--color-info-600);
  padding: 8px 12px;
  font-weight: 500;
  flex-shrink: 0;
  cursor: pointer;
}

.filter-badge:hover {
  color: var(--color-info-700);
  outline: 1px solid var(--color-info-500);
  outline-offset: -1px;
}

.filter-badge:active {
  background: var(--color-info-100);
  outline: none;
}

.filter-text {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-delete {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.filter-badge:hover .filter-delete {
  background: var(--color-info-25);
}

.price-input {
  width: 88px;
  background: var(--color-neutral-100);
  border-radius: 10px;
  color: var(--color-neutral-950);
  font-weight: 700;
  padding: 10px;
}

.range-slider {
  position: relative;
  height: 2px;
  background: var(--color-neutral-950);
  margin-top: 10px;
}

.range-input {
  position: absolute;
  inset: 0;
  appearance: none;
  pointer-events: none;
}

.range-input::-webkit-slider-thumb {
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid var(--color-neutral-950);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  appearance: none;
}

.range-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid var(--color-neutral-950);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-sizing: border-box;
}
</style>
