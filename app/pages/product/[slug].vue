<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import ColorSelect from "@/components/ColorSelect.vue";
import DownloadItem from "@/components/DownloadItem.vue";
import {useAPI} from "@/composables/useAPI.js";
import {formatCurrency} from "@/assets/js/funcs";

const route = useRoute()
const { slug } = route.params
const { variant_id } = route.query

const currentColor = ref(null)

const { data: product } = await useAPI(`/products/${slug}`)
const { data: similar } = await useAPI(`/products/${slug}/similar`)

const productData = product.value.data
const similarData = similar.value.data

const title = productData.name

useHead({ title })

currentColor.value = parseInt(variant_id) || productData.colors?.find((color) => color.is_default)?.variant_id

const currentColorData = computed(() => productData.colors?.find((color) => currentColor.value === color.variant_id))

watch(
  currentColor,
  (id) => window.history.pushState({}, '', `${window.location.pathname}?variant_id=${id}`)
)

const targetSet = ref(false)
const activeImage = ref(0)

const tabs = {
  specs: 'Характеристики',
  documents: 'Инструкции',
  features: 'Особенности'
}

const currentTab = ref(Object.keys(tabs)[0])

const attributes = Object.fromEntries(productData.attributes.map((item) => [item.group, item.items]))

const isFavorite = ref(productData.is_favorite)
const isInComparison = ref(productData.is_in_comparison)

function toggleFavorite() {
  useAPI(`/favorites/${productData.id}`, { method: isFavorite.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isFavorite.value = !isFavorite.value
    })
}

function toggleComparison() {
  useAPI(`/comparison/${productData.id}`, { method: isInComparison.value ? 'DELETE' : 'POST' })
    .then(({data}) => {
      isInComparison.value = !isInComparison.value
    })
}

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: 'Каталог', path: '/catalog' }, { name: title } ]"
        class="mb-[48px]"
      />

      <div class="flex flex-col desktop:grid desktop:grid-cols-[auto_1fr] gap-[24px] mb-[32px] desktop:mb-[80px]">
        <div class="flex justify-center relative rounded-[24px] desktop:hidden">
          <div class="slider">
            <template v-for="media in productData.gallery">
              <img
                v-if="media.media_type === 'image'"
                class="slider-item size-full"
                :src="media.url"
                alt=""
              >
              <video
                v-else-if="media.media_type === 'video'"
                class="slider-item size-full"
                :src="media.url"
              ></video>
            </template>
          </div>

          <button
            class="absolute top-[16px] right-[16px] bg-[#F8FAFC] rounded-full p-[8px]"
            @click="toggleFavorite"
          >
            <img
              v-if="isFavorite"
              src="~/assets/icons/favorite-full.svg"
              alt=""
            >
            <img
              v-else
              src="~/assets/icons/favorite.svg"
              alt=""
            >
          </button>

          <div class="stripe-pagination absolute bottom-[16px]">
            <div
              v-for="index in productData.gallery.length"
              :key="index"
              :class="{
                'stripe-pagination-item': true,
                'active': activeImage === index - 1
              }"
              @click="() => { targetSet = true; activeImage = index - 1; }"
            ></div>
          </div>
        </div>

        <div class="flex gap-[12px] desktop:h-[622px] max-desktop:hidden">
          <div class="relative flex flex-col h-full shrink-0">
            <button class="gallery-arrow gallery-arrow-up"></button>
            <div class="absolute top-[50px] bg-linear-to-t to-white h-[32px] w-full pointer-events-none"></div>

            <div class="flex flex-col flex-1 p-[8px_4px] gap-[8px] overflow-y-auto scrollbar-none">
              <template v-for="(media, index) in productData.gallery">
                <img
                  v-if="media.media_type === 'image'"
                  :key="index"
                  :class="{
                     'gallery-preview': true,
                     'selected': activeImage === index
                   }"
                  @click="activeImage = index" :src="media.url" alt="">
                <video
                  v-else-if="media.media_type === 'video'"
                  class="slider-item size-full"
                  :src="media.url"
                ></video>
              </template>
            </div>

            <div class="absolute bottom-[50px] bg-linear-to-b to-white h-[32px] w-full pointer-events-none"></div>
            <button class="gallery-arrow gallery-arrow-down"></button>
          </div>

          <div class="relative">
            <img class="size-full" :src="productData.gallery[activeImage].url" alt="">
            <div class="absolute top-[16px] right-[16px] flex gap-[8px]">
              <button
                class="bg-primary rounded-[8px] p-[8px] shadow-[0_2px_8px_#00000014] shrink-0"
                @click="toggleComparison"
              >
                <img
                  v-if="isInComparison"
                  class="size-[24px]"
                  src="~/assets/icons/trash-white.svg"
                  alt=""
                >
                <img
                  v-else
                  class="size-[24px]"
                  src="~/assets/icons/compare-white.svg"
                  alt=""
                >
              </button>
              <button
                class="bg-primary rounded-[8px] p-[8px] shadow-[0_2px_8px_#00000014] shrink-0"
                @click="toggleFavorite"
              >
                <img
                  v-if="isFavorite"
                  class="size-[24px]"
                  src="~/assets/icons/favorite-full-white.svg"
                  alt=""
                >
                <img
                  v-else
                  class="size-[24px]"
                  src="~/assets/icons/favorite-white.svg"
                  alt=""
                >
              </button>
            </div>
          </div>
        </div>

        <div class="grid gap-[24px] desktop:gap-[8px] self-start">
          <div class="product-block grid gap-[12px_18px]">
            <h3 class="m-0">
              {{ productData.name }}
            </h3>
            <div class="flex items-center justify-between gap-[12px] text-[14px]">
              <div class="bg-[#F1F5F9] rounded-full p-[4px_12px] font-medium">
                {{ productData.collection.name }}
              </div>
              <div class="text-quaternary">
                Артикул {{ currentColorData?.article || productData.article }}
              </div>
            </div>
          </div>

          <div
            v-if="productData.colors?.length"
            class="product-block flex items-center justify-between"
          >
            <h5 class="m-0">Цветовая гамма</h5>
            <ColorSelect
              :colors="productData.colors"
              v-model="currentColor"
              size="40"
              gap="8"
            />
          </div>

          <div class="product-block grid gap-[24px] desktop:gap-[14px] text-tertiary">
            <div>
              <h5 class="mb-[7px]">Описание</h5>
              <div>
                {{ productData.description }}
              </div>
            </div>
            <div>
              <h5 class="mb-[7px]">Комплектация</h5>
              <ul class="grid gap-[4px] list-inside list-disc">
                <li>Унитаз подвесной</li>
                <li>Сиденье</li>
                <li>Комплект креплений для сиденья и монтажа унитаза</li>
                <li>Гарантийный талон</li>
                <li>Инструкция</li>
              </ul>
            </div>
          </div>

          <div class="product-block flex items-center justify-between max-desktop:hidden">
            <div>
              <h4>
                {{ formatCurrency(currentColorData?.price || productData.price) }}
              </h4>
              <div class="text-[14px]/[20px] text-quaternary">
                Рекоменд. розничная цена
              </div>
            </div>
            <NuxtLink
              :to="productData.buy_url"
              class="button-rounded w-[260px] bg-[#8CB0C8] text-[#FCFCFD]"
            >
              Купить у партнеров
             </NuxtLink>
          </div>
        </div>
      </div>

      <section class="grid gap-[24px] mb-[64px]">
        <div class="flex gap-[8px] desktop:gap-[32px] -mx-[16px] px-[16px] scrollbar-none overflow-x-auto">
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
          class="grid gap-[24px] desktop:grid-cols-2 items-start"
        >
          <div class="grid gap-[24px]">
            <div
              v-if="'main' in attributes"
              class="specs-block"
            >
              <h5>Основные характеристики</h5>
              <div class="spec-rows">
                <div
                  v-for="(spec, i) in attributes.main"
                  :key="spec.key"
                  class="spec-row"
                >
                  <span class="spec-name">{{ spec.name }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Артикул</span>-->
<!--                  <span class="spec-value">OVO0110</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Коллекция</span>-->
<!--                  <span class="spec-value">OVO</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Цвет</span>-->
<!--                  <span class="spec-value">Белый глянцевый</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Форма</span>-->
<!--                  <span class="spec-value">Округлая</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Материал корпуса</span>-->
<!--                  <span class="spec-value">Санфарфор</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Покрытие</span>-->
<!--                  <span class="spec-value">Антибактериальное</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Тип установки</span>-->
<!--                  <span class="spec-value">Подвесной</span>-->
<!--                </div>-->
<!--                <div class="spec-row">-->
<!--                  <span class="spec-name">Гарантия</span>-->
<!--                  <span class="spec-value">15 лет</span>-->
<!--                </div>-->
              </div>
            </div>

            <div class="specs-block">
              <h5>Размеры и вес</h5>
              <div class="spec-rows">
                <div class="spec-row">
                  <span class="spec-name">Размеры товара <span class="max-desktop:hidden">(Д x Ш x В)</span></span>
                  <span class="spec-value">525x360x320 мм</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Вес товара</span>
                  <span class="spec-value">26.5 кг</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Размеры упаковки <span class="max-desktop:hidden">(Д x Ш  В)</span></span>
                  <span class="spec-value">545x450x420 мм</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Вес в упаковке</span>
                  <span class="spec-value">30.5 кг</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-[24px]">
            <div class="specs-block">
              <h5>Смыв и функции</h5>
              <div class="spec-rows">
                <div class="spec-row">
                  <span class="spec-name">Организация сливного потока</span>
                  <span class="spec-value">Традиционная</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Смыв</span>
                  <span class="spec-value">Прямой</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Режим слива</span>
                  <span class="spec-value">Определяется инсталляцией</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Функции</span>
                  <span class="spec-value">Антивсплеск, микролифт</span>
                </div>
              </div>
            </div>

            <div class="specs-block">
              <h5>Монтаж и подключение</h5>
              <div class="spec-rows">
                <div class="spec-row">
                  <span class="spec-name">Выпуск в канализацию</span>
                  <span class="spec-value">Горизонтальный</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Подвод воды</span>
                  <span class="spec-value">Определяется инсталляцией</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Смывной бачок</span>
                  <span class="spec-value">Скрытый</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Инсталляция в комплекте</span>
                  <span class="spec-value">Нет</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="currentTab === 'documents'"
          class="grid gap-[8px] max-w-[941px]"
        >
          <DownloadItem
            v-for="document in productData.documents"
            :title="document.title"
            :url="document.url"
          />
        </div>

        <div v-show="currentTab === 'features'">
          <ul class="grid gap-[4px] list-inside list-disc text-secondary">
            <li>Безободковая конструкция для максимальной гигиены и лёгкой очистки</li>
            <li>Быстросъёмное сиденье из высококачественного дюропласта с функцией плавного закрывания (микролифт)</li>
            <li>Антигрязевое покрытие, которое отталкивает загрязнения и сохраняет белизну надолго</li>
            <li>Повышенная устойчивость к царапинам и механическим повреждениям</li>
            <li>Тихий и мощный смыв с регулируемой силой потока</li>
          </ul>
        </div>
      </section>

      <section>
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
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.product-block {
  @variant desktop {
    border: 1px solid #F8FAFC;
    border-radius: 24px;
    box-shadow: 0 2px 4px #0000000F;
    padding: 18px 24px;
  }
}

.gallery-preview {
  width: 90px;
  height: 90px;
  border-radius: 13px;
  background: #E6E6E6;
}

.gallery-preview.selected {
  outline: 3px solid #A1A1A1;
  outline-offset: -3px;
}

.gallery-arrow {
  width: 100%;
  height: 50px;
  background: url(~/assets/icons/button-down.svg) center no-repeat;
  flex-shrink: 0;
}

.gallery-arrow-up {
  rotate: 180deg;
}

.tab {
  @variant max-desktop {
    background: #F1F5F9;
    border-radius: 9999px;
    color: var(--color-tertiary);
    padding: 10px 20px;
  }

  @variant desktop {
    font-size: 28px;
    line-height: 36px;
    font-weight: 700;
    color: var(--color-quaternary);
  }
}

.tab.selected {
  @variant max-desktop {
    background: #7195B5;
    color: white;
  }

  @variant desktop {
    color: var(--color-primary);
  }
}

.specs-block {
  display: grid;
  gap: 16px;

  @variant desktop {
    background: #F1F5F9;
    border-radius: 24px;
    padding: 24px;
  }
}

.spec-rows {
  display: grid;
  gap: 16px;

  @variant desktop {
    gap: 12px;
  }
}

.spec-row {
  display: flex;
  justify-content: space-between;
}

.spec-name {
  color: var(--color-quaternary);
}

.spec-value {
  font-weight: 600;

  @variant max-desktop {
    color: var(--color-secondary);
  }
}
</style>
