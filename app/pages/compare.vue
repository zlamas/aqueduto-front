<script setup>
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const onlyDifferences = ref(false)
const refreshListToggle = ref(false)

const { data: comparisonData } = await useAPI('/comparison', {
    query: { only_differences: onlyDifferences },
    watch: [refreshListToggle]
})
const { data: similar } = await useAPI('comparison/similar')

const items = computed(() => comparisonData.value.data)
const categories = computed(() => comparisonData.value.categories)
const similarData = similar.value.data

const title = 'Сравнение'

useHead({ title })

const itemsGrouped = computed(() =>
  items.value.map((item) =>
    Object.groupBy(
      item.attributes,
      ({ group }) => group
    )
  )
)

const attributes = computed(() =>
  itemsGrouped.value?.length ?
    Object.fromEntries(
      Object.keys(itemsGrouped.value[0])
        .map((group) => [
          group,
          itemsGrouped.value.flatMap((item) => item[group].map(({ items }) => items))]
        )
    ) : {}
)

const attributeMeta = computed(() =>
  Object.fromEntries(
    Object.entries(attributes.value)
      .map(([group, items]) => [group, items[0]])
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
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[64px]"
      />

      <div class="layout">
        <section>
          <div class="flex justify-between items-end mb-[24px]">
            <h1 class="m-0">{{ title }}</h1>

            <div class="arrows max-desktop:hidden">
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

          <div
            ref="compare-slider"
            class="slider desktop:py-[32px]"
          >
            <div class="slider-item desktop:content-start max-desktop:order-1">
              <div class="grid place-content-center justify-items-center desktop:h-[328px] max-desktop:min-h-[360px] gap-[20px] rounded-[16px] desktop:rounded-[28px] border-2 border-dashed border-[#CBD5E1] text-center text-quaternary font-semibold cursor-pointer">
                <div>Добавить товар <br> к сравнению</div>
                <img src="~/assets/icons/compare-add.svg" alt="">
              </div>

              <label class="flex items-center justify-between text-tertiary max-desktop:hidden">
                <span>Показать только различия</span>
                <input v-model="onlyDifferences" type="checkbox" class="hidden">
                <span class="switch">
                  <span class="switch-knob"></span>
                </span>
              </label>
            </div>

            <div
              v-for="item in items"
              :key="item.product.id"
              class="compare-item slider-item"
            >
              <div class="compare-controls">
                <button
                  class="p-[8px]"
                  @click="deleteFromComparison(item.product.id)"
                >
                  <img src="~/assets/icons/compare-remove.svg" alt="">
                </button>
                <button class="p-[8px] cursor-grab active:cursor-grabbing">
                  <img src="~/assets/icons/drag.svg" alt="">
                </button>
              </div>

              <ProductCard
                v-bind="item.product"
                class="w-full"
                :compare-button="false"
              />
            </div>
          </div>

          <label class="flex items-center justify-between text-tertiary mt-[18px] desktop:hidden">
            <span>Показать только различия</span>
            <input v-model="onlyDifferences" type="checkbox" class="hidden">
            <span class="switch">
              <span class="switch-knob"></span>
            </span>
          </label>

          <details
            v-if="'main' in attributes"
            class="compare-group"
            open
          >
            <summary class="compare-group-title">
              <h5>Основные характеристики</h5>
            </summary>
            <div class="slider compare-slider">
              <div class="compare-col slider-item">
                <div v-for="meta in attributeMeta.main">{{ meta.name }}</div>
              </div>

              <div
                v-for="(product, index) in items"
                :key="product.id"
                class="compare-col slider-item"
              >
                <div
                  v-for="attribute in attributes.main[index]"
                  class="grid gap-[8px]"
                >
                  <div class="desktop:hidden text-quaternary font-normal">{{ attribute.name }}</div>
                  <div>{{ attribute.value }}</div>
                </div>
              </div>
            </div>
          </details>
        </section>

        <section v-if="similarData?.length">
          <div class="flex max-desktop:flex-col items-center justify-between gap-[24px] max-desktop:mb-[16px]">
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
            class="slider desktop:py-[32px]"
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

.compare-item {
  display: grid;
  gap: 8px;

  @variant max-desktop {
    grid-template-rows: auto 1fr;
  }
}

.compare-controls {
  display: flex;
  justify-content: space-between;
}

.compare-group {
  margin-top: 32px;
}

@variant max-desktop {
  .compare-group-title {
    justify-content: space-between;
  }

  .compare-group-title::after {
    content: url(~/assets/icons/arrow-collapse.svg);
    line-height: 0;
  }

  [open] > .compare-group-title::after {
    rotate: 180deg;
  }
}

.compare-slider {
  margin-top: 16px;
}

.compare-col {
  display: grid;
  gap: 0;
  font-weight: 600;
}

.compare-col:first-child {
  color: var(--color-quaternary);
  font-weight: 400;

  @variant max-desktop {
    display: none;
  }
}

.compare-col > div {
  padding-block: 14px;
}
</style>
