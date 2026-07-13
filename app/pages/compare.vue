<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const onlyDifferences = ref(false)
const refreshListToggle = ref(false)
const selectedCategory = ref(null)
const items = ref([])

const { data: comparisonData } = await useAPI('/comparison', {
    query: {
      only_differences: onlyDifferences,
      category: selectedCategory
    },
    watch: [refreshListToggle],

    onResponse({ response }) {
      items.value = response._data.data
    }
})
const { data: similar } = await useAPI('comparison/similar')

items.value = comparisonData.value.data
const categories = computed(() => comparisonData.value.categories)
const similarData = similar.value.data

const title = 'Сравнение'

useHead({ title })

const allCategories = computed(() => [
  {
    name: 'Все',
    slug: null,
    count: categories.value.reduce((a, b) => a + b.count, 0)
  },
  ...categories.value
])

const attributes = computed(() =>
  items.value.map((item) => item.attributes.flatMap((group) => group.items))
)

const attributeMeta = computed(() =>
  Object.fromEntries(
    attributes.value.flat().map((attribute) => [attribute.key, attribute.name])
  )
)

const attributeValues = computed(() =>
  Object.keys(attributeMeta.value)
    .map(
      (key) => attributes.value.map(
        (item) => item.find((attribute) => attribute.key === key)?.value
      )
    )
)

function deleteFromComparison(id) {
  useAPI(`/comparison/${id}`, { method: 'DELETE' })
    .then(({data}) => {
      const index = comparisonData.value.data.findIndex((item) => item.product.id === id)
      comparisonData.value.data.splice(index, 1)
      refreshListToggle.value = !refreshListToggle.value
    })
}

const compareSliderContainer = useTemplateRef('compare-slider')
const compareSlider = useSimpleSlider(compareSliderContainer)

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)

function updateScrollWidth(element) {
  element.style.setProperty('--container-width', null)
  nextTick().then(() =>
    element.style.setProperty('--container-width', element.scrollWidth)
  )
}

onMounted(() => updateScrollWidth(compareSliderContainer.value))
onUpdated(() => updateScrollWidth(compareSliderContainer.value))

let draggedIndex = null
const dragOverIndex = ref(null)

const onDragStart = (index) => {
  draggedIndex = index
}

const onDragEnter = (index) => {
  if (index !== draggedIndex) {
    dragOverIndex.value = index
  }
}

const onDragLeave = (index) => {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

const onDrop = (targetIndex) => {
  if (draggedIndex === null || draggedIndex === targetIndex) return

  const [moved] = items.value.splice(draggedIndex, 1)
  items.value.splice(targetIndex, 0, moved)

  draggedIndex = null
  dragOverIndex.value = null
}
</script>

<template>
  <main class="pt-[24px] laptop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[32px]"
        :light="true"
      />

      <div class="layout">
        <section>
          <div class="flex justify-between items-end mb-[16px] laptop:mb-[32px]">
            <h1 class="m-0">{{ title }}</h1>

            <div class="arrows max-laptop:hidden">
              <button
                class="arrow arrow-left"
                @click="compareSlider.scrollLeft"
              ></button>
              <button
                class="arrow arrow-right"
                @click="compareSlider.scrollRight"
              ></button>
            </div>
          </div>

          <div class="flex flex-wrap gap-[16px] mb-[24px] laptop:mb-[32px]">
            <button
              v-for="category in allCategories"
              :key="category.slug"
              :class="{
                'group flex items-center gap-[8px] rounded-full p-[6px] pr-[16px] font-medium': true,
                'button-secondary hover:bg-neutral-200 active:bg-neutral-300': category.slug !== selectedCategory,
                'bg-brand-950': category.slug === selectedCategory,
              }"
                  @click="selectedCategory = category.slug"
                >
              <span
                :class="{
                  'p-[4px_12px] bg-white border rounded-full font-bold': true,
                  'text-neutral-600 border-neutral-300 group-hover:text-neutral-700 group-hover:border-neutral-400 group-active:text-neutral-800 group-active:border-neutral-500': category.slug !== selectedCategory,
                  'border-transparent text-brand-950': category.slug === selectedCategory
                }"
              >
                {{ category.count }}
              </span>
                  <span
                    :class="{
                  'text-neutral-600 group-hover:text-neutral-700 group-active:text-neutral-800': category.slug !== selectedCategory,
                  'text-neutral-25 font-bold': category.slug === selectedCategory
                }"
                  >
                {{ category.name }}
              </span>
            </button>
          </div>

          <div
            ref="compare-slider"
            class="slider compare-slider"
          >
            <div class="compare-col slider-item max-laptop:order-1">
              <div class="compare-item gap-[32px] content-start mt-[44px]">
                <NuxtLink
                  to="/catalog"
                  class="grid place-content-center justify-items-center laptop:h-[328px] max-laptop:min-h-[360px] gap-[20px] rounded-[16px] laptop:rounded-[28px] border-2 border-dashed border-neutral-300 text-center text-neutral-400 font-semibold cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 hover:text-neutral-500 active:bg-neutral-100 active:border-neutral-500 active:text-neutral-600"
                >
                  <div>Добавить товар <br> к сравнению</div>
                  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="currentColor"/>
                    <path d="M32.4958 24.0009H15.5252M24.0105 15.5156V32.4862" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </NuxtLink>

                <div class="show-differences">
                  <input v-model="onlyDifferences" id="show-differences" type="checkbox" class="hidden">
                  <label for="show-differences" class="label show-differences-label">
                    <span>Показать только различия</span>
                    <span class="switch">
                      <span class="switch-knob"></span>
                    </span>
                  </label>
                </div>
              </div>

              <div
                v-for="name in attributeMeta"
                class="max-laptop:hidden"
              >
                {{ name }}
              </div>
            </div>

            <div
              v-for="(item, itemIndex) in items"
              :key="item.product.id"
              class="compare-col slider-item"
              draggable="true"
              @dragstart="onDragStart(itemIndex)"
              @dragenter.prevent="onDragEnter(itemIndex)"
              @dragover.prevent
              @dragleave="onDragLeave(itemIndex)"
              @drop="onDrop(itemIndex)"

            >
              <div class="compare-item">
                <div class="compare-controls">
                  <button class="compare-button cursor-grab active:cursor-grabbing">
                    <img src="~/assets/icons/drag.svg" alt="">
                  </button>

                  <button
                    class="group compare-button"
                    @click="deleteFromComparison(item.product.id)"
                  >
                    <img class="group-hover:hidden" src="~/assets/icons/compare-remove.svg" alt="">
                    <img class="not-group-hover:hidden" src="~/assets/icons/compare-remove-full.svg" alt="">
                  </button>
                </div>

                <ProductCard
                  v-bind="item.product"
                  class="w-full"
                  :compare-button="false"
                />
              </div>

              <div
                v-for="(name, key, attrIndex) in attributeMeta"
                class="flex flex-col gap-[8px]"
              >
                <div class="laptop:hidden text-neutral-500 font-normal">
                  {{ name }}
                </div>
                <div>
                  {{ attributeValues[attrIndex][itemIndex] || '-' }}
                </div>
              </div>
            </div>
        </div>
        </section>

        <section v-if="similarData?.length">
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
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.compare-slider {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc(50% - 6px);
  overflow-wrap: anywhere;

  @variant laptop {
    grid-auto-columns: calc(25% - 18px);
  }
}

.compare-col {
  display: grid;
  gap: 28px;
  font-weight: 600;
  width: auto;
  grid-template-rows: subgrid;
  grid-template-columns: 100%;
  grid-row: span v-bind(Object.keys(attributeMeta).length + 1);
}

.compare-col:first-child {
  color: var(--color-neutral-500);
  font-weight: 400;
}

.compare-item {
  display: grid;
  margin-bottom: 64px;
}

.compare-col:not(:first-child) .compare-item {
  grid-template-rows: auto 1fr;
}

.compare-controls {
  display: flex;
  justify-content: space-between;
}

.compare-button {
  border-radius: 8px;
  padding: 10px;
}

.compare-button:hover {
  background: var(--color-neutral-100);
}

.show-differences {
  @variant max-laptop {
    position: absolute;
    left: 0;
    width: calc(var(--container-width, 0) * 1px);
    align-self: end;
    translate: 0 calc(100% + 24px);
    padding-inline: 16px;
    z-index: 9;
  }
}

.show-differences-label {
  justify-content: space-between;

  @variant max-laptop {
    position: sticky;
    left: 0;
    width: calc(100vw - 32px);
    padding-inline: 8px;
  }
}
</style>
