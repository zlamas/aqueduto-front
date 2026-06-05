<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import HeroSlider from "@/components/HeroSlider.vue";
import ProductCard from "@/components/ProductCard.vue";
import Dropdown from "@/components/Dropdown.vue";
import {useAPI} from "@/composables/useAPI.js";
import {debounce, formatCurrency, filterQuery} from "@/assets/js/funcs.js";

const title = 'Каталог'

useHead({ title })

const parameters = ref({})

const slug = useRoute().params.slug

if (slug) {
  parameters.value.category = slug
}

const selectedCategory = computed(() => parameters.value?.category)

const { data: catalogData } = await useAPI('/catalog')
const { data: productData } = await useAPI('/products', { query: parameters })
const { data: collectionData } = await useAPI('/collections')
const { data: filtersData } = await useAPI('/catalog/filters', { query: { category: selectedCategory } })

const { banners, categories } = catalogData.value
const products = computed(() => productData.value.data)
const collections = collectionData.value.data
const filters = computed(() => filtersData.value?.data)

const prices = computed(() => products.value.map((product) => parseFloat(product.price)))

const totalMinPrice = prices.value.reduce((a, b) => a < b ? a : b, 0)
const totalMaxPrice = prices.value.reduce((a, b) => a > b ? a : b, 0)

const minPrice = ref(totalMinPrice)
const maxPrice = ref(totalMaxPrice)

const collectionQuery = ref('')
const productQuery = ref('')
const colorQuery = ref('')

function updateCategory(newCategory) {
  parameters.value.category = newCategory
  window.history.pushState({}, null, `/catalog/${newCategory}`)
}

const filteredCollections = computed(
  () => filterQuery(collections, 'name', collectionQuery.value)
)

const filteredColors = computed(
  () => filterQuery(colors, 'name', colorQuery.value)
)

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

const updateProductsDebounce = debounce(
  () => Object.assign(
    parameters.value,
    { search: productQuery.value }
  )
)

watch(
  [productQuery],
  () => updateProductsDebounce(500),
)

const priceProductCount = ref(products.value.length)

const fetchProductsPriceDebounce = debounce(() => {
  const params = Object.assign({ price_min: minPrice.value, price_max: maxPrice.value }, parameters.value)
  useAPI('/products', { query: params }).then(({ data }) => {
    priceProductCount.value = data.value.data.length
  })
})

watch(
  [minPrice, maxPrice],
  () => fetchProductsPriceDebounce(500),
)

const colors = [
  {
    name: 'Черный матовый',
    value: 'black-matte',
    hex: '#2E2E2E'
  },
  {
    name: 'Белый глянцевый',
    value: 'white-glossy',
    hex: '#FFFFFF'
  },
  {
    name: 'Белый матовый',
    value: 'white-matte',
    hex: '#FFFFFF'
  },
  {
    name: 'Серый матовый',
    value: 'gray-matte',
    hex: '#6B6B6B'
  },
  {
    name: 'Хром',
    value: 'chrome',
    hex: ['#ECECEC', '#A2A2A2']
  },
  {
    name: 'Оружейная сталь',
    value: 'gun-steel',
    hex: ['#82817E', '#4A4947']
  },
  {
    name: 'Шлифованное золото',
    value: 'polished-gold',
    hex: ['#E7E3C0', '#C0B47F']
  },
]

const activeFilterBadges = [
  {
    name: 'collection',
    array: collections,
    valueKey: 'slug'
  },
  {
    name: 'color',
    array: colors,
    valueKey: 'value'
  },
]

const activeFilters = computed(
  () => Object.fromEntries(
    activeFilterBadges
      .map((filter) => [
        filter.name,
        filter.array.find((item) => item[filter.valueKey] === parameters.value[filter.name])]
      )
      .filter(([name, item]) => item)
  )
)

function filterAvailable(name) {
  return !filters.value?.length || filters.value.find((filter) => filter.key === name)
}

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

// const banners = [
//   {
//     media_url: '/images/promotion-1.png',
//     media_type: 'image',
//     title: 'Специальная цена на сантехнику из коллекции Esteta!',
//     subtitle: 'Ванная комната в скандинавском стиле — это пространство света, уюта и природной гармонии. Нежно-голубые акценты, тёплое дерево и живые растения создают атмосферу спокойствия и домашнего тепла.'
//   },
//   {
//     media_url: '/images/promotion-1.png',
//     media_type: 'image',
//     title: 'Специальная цена на сантехнику из коллекции Esteta!',
//     subtitle: 'Ванная комната в скандинавском стиле — это пространство света, уюта и природной гармонии. Нежно-голубые акценты, тёплое дерево и живые растения создают атмосферу спокойствия и домашнего тепла.'
//   },
//   {
//     media_url: '/images/promotion-1.png',
//     media_type: 'image',
//     title: 'Специальная цена на сантехнику из коллекции Esteta!',
//     subtitle: 'Ванная комната в скандинавском стиле — это пространство света, уюта и природной гармонии. Нежно-голубые акценты, тёплое дерево и живые растения создают атмосферу спокойствия и домашнего тепла.'
//   },
//   {
//     media_url: '/images/promotion-1.png',
//     media_type: 'image',
//     title: 'Специальная цена на сантехнику из коллекции Esteta!',
//     subtitle: 'Ванная комната в скандинавском стиле — это пространство света, уюта и природной гармонии. Нежно-голубые акценты, тёплое дерево и живые растения создают атмосферу спокойствия и домашнего тепла.'
//   },
//   {
//     media_url: '/images/promotion-1.png',
//     media_type: 'image',
//     title: 'Специальная цена на сантехнику из коллекции Esteta!',
//     subtitle: 'Ванная комната в скандинавском стиле — это пространство света, уюта и природной гармонии. Нежно-голубые акценты, тёплое дерево и живые растения создают атмосферу спокойствия и домашнего тепла.'
//   }
// ]

// const categories = [
//   { name: 'Унитазы', image: 'images/category-1.png', },
//   { name: 'Писсуары', image: 'images/category-2.png', },
//   { name: 'Биде', image: 'images/category-3.png', },
//   { name: 'Панели смыва', image: 'images/category-4.png', },
//   { name: 'Гигиенические души', image: 'images/category-5.png', },
//   { name: 'Раковины', image: 'images/category-6.png', },
// ]
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section class="hero-banner grid desktop:h-[600px] desktop:rounded-[32px] desktop:p-[32px_160px] [--direction:left] [--opacity:0.6] mb-[32px] desktop:mb-[64px]">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="place-self-start z-9"
      />
      <HeroSlider
        :items="banners"
        :pagination-offset="81"
      />
    </section>

    <div class="container">
      <div class="relative flex items-center -mx-[16px] mb-[24px] desktop:mb-[48px]">
        <div class="absolute left-0 bg-linear-to-l to-white w-[15%] h-full pointer-events-none"></div>
        <button
          class="arrow arrow-left absolute left-[16px] max-desktop:hidden"
        ></button>

        <div class="grid grid-flow-col auto-cols-[140px] desktop:auto-cols-[220px] h-[180px] gap-[8px] desktop:gap-[24px] text-center px-[16px] overflow-x-auto scrollbar-none py-[4px]">
          <div
            v-for="(category, index) in categories"
            :key="index"
            :class="{
              'category': true,
              'selected': parameters.category === category.slug,
            }"
            @click="updateCategory(category.slug)"
          >
            <img :src="category.image" alt="">
            <span>{{ category.name }}</span>
          </div>
        </div>

        <div class="absolute right-0 bg-linear-to-r to-white w-[15%] h-full pointer-events-none"></div>
        <button
          class="arrow arrow-right absolute right-[16px] max-desktop:hidden"
        ></button>
      </div>

      <div class="flex max-desktop:flex-col justify-between gap-[24px] mb-[24px] desktop:mb-[32px]">
        <div class="flex gap-[16px] desktop:gap-[24px] -mx-[16px] px-[16px] scrollbar-none overflow-x-auto overflow-y-hidden">
          <Dropdown
            bg-color="var(--color-quaternary)"
            text-color="#FCFCFD"
            label="Сортировка"
            icon-left="sort"
            icon-right="arrow-down-white"
          >
            <div class="grid gap-[12px]">
              <label
                v-for="(label, value) in sortingOptions"
                :key="value"
                class="flex items-center gap-[9px]"
              >
                <input
                  type="radio"
                  name="sorting"
                  v-model="parameters.sorting"
                  :value="value"
                >
                <span>{{ label }}</span>
              </label>
            </div>
          </Dropdown>

          <div class="flex gap-[8px] desktop:gap-[12px]">
            <Dropdown
              v-show="filterAvailable('price')"
              label="Цена"
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
                        class="absolute bottom-full flex justify-center bg-[#3C3C3C] rounded-[5px] text-[12px]/[16px] text-white p-[4px_7px] mb-[7px] after:absolute after:bottom-0 after:transform-[translateY(20%)_scaleX(1.5)_rotate(45deg)] after:size-[16px] after:rounded-[3px] after:bg-inherit"
                      >
                        <span class="z-9">{{ formatCurrency(3900) }}</span>
                      </div>
                      <div
                        :class="{
                          'w-[6px] rounded-full': true,
                          'bg-[#3C3C3C]': percent === 100,
                          'bg-[#999999]': percent < 100
                        }"
                        :style="{
                          height: `${percent}%`
                        }"
                      ></div>
                    </div>
                  </div>

                  <div class="relative mt-[12px]">
                    <input
                      type="range"
                      v-model="minPrice"
                      :min="totalMinPrice"
                      :max="totalMaxPrice"
                      class="range-slider"
                    >
                    <input
                      type="range"
                      v-model="maxPrice"
                      :min="totalMinPrice"
                      :max="totalMaxPrice"
                      class="range-slider"
                    >
                  </div>
                </div>

                <div class="flex justify-between text-[#999999]">
                  <label class="grid gap-[2px]">
                    <span>Мин. цена</span>
                    <input
                      class="price-input"
                      type="text"
                      v-model="minPrice"
                    >
                  </label>
                  <label class="grid gap-[2px]">
                    <span>Макс. цена</span>
                    <input
                      class="price-input"
                      type="text"
                      v-model="maxPrice"
                    >
                  </label>
                </div>

                <div class="flex gap-[4px] items-center">
                  <button
                    class="button-rounded bg-[#E6E6E6] p-[10px]"
                    @click="() => {
                      minPrice = totalMinPrice
                      maxPrice = totalMaxPrice
                    }"
                  >
                    <img src="~/assets/icons/filter-clear.svg" alt="">
                  </button>
                  <button
                    class="button-rounded bg-[#2563EB] text-white flex-1"
                    @click="() => {
                      Object.assign(
                        parameters,
                { price_min: minPrice, price_max: maxPrice }
                      )
                    }"
                  >
                    Показать {{ priceProductCount }} товаров
                  </button>
                </div>
              </div>
            </Dropdown>

            <Dropdown
              v-show="filterAvailable('collection')"
              label="Коллекция"
            >
              <div class="grid gap-[18px] min-w-[235px] max-h-[330px]">
                <label class="search-field p-[8px_12px]">
                  <input
                    v-model="collectionQuery"
                    class="search-input"
                    type="text"
                    placeholder="Поиск"
                  >
                </label>

                <div class="grid gap-[12px] overflow-y-auto">
                  <label
                    v-for="collection in filteredCollections"
                    :key="collection.id"
                    class="flex items-center gap-[9px]"
                  >
                    <input
                      type="radio"
                      name="collections"
                      v-model="parameters.collection"
                      :value="collection.slug"
                    >
                    <span>{{ collection.name }}</span>
                  </label>
                </div>
              </div>
            </Dropdown>

            <Dropdown
              v-show="filterAvailable('color')"
              label="Цвет"
            >
              <div class="grid gap-[18px] min-w-[235px] max-h-[330px]">
                <label class="search-field p-[8px_12px]">
                  <input
                    v-model="colorQuery"
                    class="search-input"
                    type="text"
                    placeholder="Поиск"
                  >
                </label>

                <div class="grid gap-[12px] overflow-y-auto">
                  <label
                    v-for="color in filteredColors"
                    :key="color.value"
                    class="flex items-center gap-[9px]"
                  >
                    <input
                      type="radio"
                      name="collections"
                      v-model="parameters.color"
                      :value="color.value"
                      class="hidden"
                    >
                    <span
                      :class="{
                        'flex size-[24px] rounded-full': true,
                        'border border-[#CBD5E1]': color.hex === '#FFFFFF'
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
                          'hidden': color.value !== parameters.color
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
              v-show="filterAvailable('material')"
              label="Материал"
            >
            </Dropdown>

            <Dropdown
              v-show="filterAvailable('room')"
              label="Комната"
            >
            </Dropdown>
          </div>
        </div>

        <label class="search-field w-full desktop:w-[320px] p-[10px_12px]">
          <input
            v-model="productQuery"
            class="search-input"
            type="text"
            placeholder="Поиск"
          >
        </label>
      </div>

      <div
        v-show="Object.keys(activeFilters).length"
        class="flex gap-[12px] mb-[24px] desktop:mb-[32px] -mx-[16px] px-[16px] whitespace-nowrap scrollbar-none overflow-x-auto"
      >
        <div
          v-for="(item, filter) in activeFilters"
          :key="filter"
          class="filter"
        >
          <div
            v-show="filter === 'color'"
            :class="{
              'flex size-[20px] rounded-full': true,
              'border border-[#CBD5E1]': item.hex === '#FFFFFF'
            }"
            :style="{
              background: Array.isArray(item.hex) ?
                `linear-gradient(to right, ${ item.hex.join(',') })` :
                item.hex
            }"
          ></div>
          <div>{{ item.name }}</div>
          <button
            class="cursor-pointer"
            @click="delete parameters[filter]"
          >
            <img src="~/assets/icons/delete.svg" alt="">
          </button>
        </div>
      </div>

      <div>
        <h2 class="mb-[24px] desktop:hidden">Товары</h2>
        <div class="product-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            v-bind="product"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.category {
  display: grid;
  gap: 8px;
  border-radius: 20px;
  color: var(--color-tertiary);
  padding: 8px 4px;
  cursor: pointer;
}

.category img {
  min-height: 112px;
  border-radius: 16px;
  object-fit: contain;

  @variant max-desktop {
    background: #F8F8FA;
  }
}

.category:hover {
  background: #F2F4F7;
  color: var(--color-secondary);
}

.category:active {
  color: #1D4ED8;
}

.category.selected {
  outline: 1px solid;
  outline-offset: -1px;
  color: #8CB0C8;
  box-shadow: var(--shadow-sm);
}

.filter {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #CBD5E1;
  border-radius: 9999px;
  color: var(--color-secondary);
  padding: 10px 16px;
  flex-shrink: 0;
}

.price-input {
  width: 88px;
  background: #E6E6E6;
  border-radius: 10px;
  color: #2E2E2E;
  font-weight: 700;
  padding: 10px;
}

.range-slider {
  position: absolute;
  inset: 0;
}

.range-slider::-webkit-slider-thumb,
.range-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid #2E2E2E;
  border-radius: 50%;
}

.range-slider:first-child::-webkit-slider-runnable-track,
.range-slider:first-child::-moz-range-track {
  height: 2px;
  background: #3C3C3C;
  border-radius: 9999px;
}
</style>
