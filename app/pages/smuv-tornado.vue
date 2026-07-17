<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: homeData } = await useAPI('/home')

const title = 'Смыв торнадо'

useHead({ title })

const advantages = [
  {
    title: 'Мощное очищение',
    description: 'Вихревой поток равномерно очищает всю поверхность чаши',
  },
  {
    title: 'Экономия воды',
    description: 'Эффективный смыв требует меньше воды без потери результата',
  },
  {
    title: 'Тихая работа',
    description: 'Направленный поток снижает уровень шума при смыве',
  },
  {
    title: 'Чистая поверхность',
    description: 'Поток воды уменьшает брызги и следы на чаше',
  },
  {
    title: 'Один смыв',
    description: 'Загрязнения удаляются с первого раза без повторов',
  },
  {
    title: 'Продуманная форма',
    description: 'Геометрия чаши усиливает эффект вихревого потока',
  },
]

const tableData = {
  'Охват чаши': [ 'Неполное покрытие чаши', 'Полное покрытие чаши' ],
  'Эффективность': [ 'Требуется повторный смыв', 'Чистота с первого раза' ],
  'Расход воды': [ 'Повышенный расход воды', 'Экономный расход воды' ],
  'Уровень шума': [ 'Шумный слив', 'Слив заметно тише' ],
}

const advantagesSliderContainer = useTemplateRef('advantages-slider')
const advantagesSliderItems = ref([])
const advantagesSlider = useSlider(advantagesSliderContainer, advantagesSliderItems)

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)
</script>

<template>
  <main>
    <section class="hero-banner hero-banner-large image-gradient grid [--bg:url(/images/style-6.jpg)] mb-[32px] laptop:mb-[128px]">
      <div class="container grid">
        <Breadcrumb :items="[ { name: title } ]" />

        <div class="absolute place-self-center bg-black/20 backdrop-blur-[10px] rounded-[12px] laptop:rounded-[30px] mx-[16px] p-[24px_12px] laptop:p-[32px_64px] text-center laptop:w-[836px]">
          <h1 class="text-text-inverse">
            Смыв торнадо: чистота <br> за одно движение
          </h1>
          <p class="text-text-inverse max-laptop:text-[14px]/[20px]">
            Мощный поток воды закручивается внутри чаши, обеспечивая быстрое и равномерное очищение без лишнего шума и расхода.
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section class="image-aside">
          <div>
            <h2 class="max-laptop:text-center">Как это работает</h2>
            <p class="text-neutral-600">
              Система торнадо-смыва направляет поток воды по кругу, создавая вихревое движение. Вода охватывает всю поверхность чаши, эффективно удаляя загрязнения даже в труднодоступных местах.
              <br><br>
              В отличие от классического смыва, здесь нет «слепых зон» — чистота достигается быстрее и с меньшим расходом воды.
            </p>
          </div>
          <img src="/images/material-1.jpg" alt="">
        </section>

        <section>
          <h2 class="mb-[24px] laptop:mb-[32px] text-center">Почему это удобно</h2>

          <div
            ref="advantages-slider"
            class="slider laptop:flex-wrap max-laptop:gap-[16px] text-[14px] laptop:text-[16px]/[24px]"
          >
            <div
              v-for="(item, index) in advantages"
              :key="index"
              :ref="(el) => advantagesSliderItems[index] = el"
              class="slider-item advantage-item"
            >
              <div class="advantage-icon">
                {{ index + 1 }}
              </div>
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

        <section>
          <div class="text-center mb-[24px] laptop:mb-[32px]">
            <h2 class="mb-[8px]">Разница в работе смыва</h2>
            <p class="text-neutral-500 font-medium">
              Технология “Торнадо” не просто усиливает поток — она меняет принцип работы смыва
            </p>
          </div>

          <div class="grid gap-[24px] laptop:hidden">
            <div
              v-for="(row, header) in tableData"
              class="grid gap-[8px]"
            >
              <h4>{{ header }}</h4>
              <div class="tornado-row-point old">
                <div>
                  <span class="font-semibold">Обычный: </span>
                  <span class="text-neutral-600">{{ row[0] }}</span>
                </div>
              </div>
              <div class="tornado-row-point new">
                <div>
                  <span class="font-semibold">“Торнадо”: </span>
                  <span class="text-neutral-600">{{ row[1] }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="table-wrapper max-laptop:hidden">
            <table class="tornado-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Обычный смыв</th>
                  <th>Смыв “Торнадо”</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, header) in tableData">
                  <td>{{ header }}</td>
                  <td>
                    <div class="tornado-table-point">
                      {{ row[0] }}
                    </div>
                  </td>
                  <td>
                    <div class="tornado-table-point">
                      {{ row[1] }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div class="flex max-laptop:flex-col justify-between items-center gap-[16px] max-laptop:mb-[16px]">
            <h3 class="m-0">Товары со смывом “Торнадо”</h3>

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

.table-wrapper {
  --border: var(--color-neutral-200);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.tornado-table {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  table-layout: fixed;
}

.tornado-table tr:not(tbody > :last-child) {
  border-bottom: 1px solid var(--border);
}

.tornado-table :is(th, td):not(:last-child) {
  border-right: 1px solid var(--border);
}

.tornado-table th {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  padding-block: 24px;
}

.tornado-table td {
  padding-block: 24px;
}

.tornado-table td:nth-child(1) {
  color: var(--color-neutral-600);
  font-size: 20px;
  line-height: 32px;
}

.tornado-table td:nth-child(2) {
  --icon: url(~/assets/icons/compare-cross.svg);
  background: var(--color-error-25);
  vertical-align: top;
}

.tornado-table td:nth-child(3) {
  --icon: url(~/assets/icons/compare-check.svg);
  background: var(--color-brand-25);
  vertical-align: top;
}

.tornado-table-point {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding-inline: 8px;
}

.tornado-table-point::before {
  content: '';
  background: var(--icon) center / cover;
  width: 40px;
  height: 40px;
}

.tornado-row-point {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
}

.tornado-row-point::before {
  content: '';
  background: var(--icon) center / cover;
  width: 24px;
  height: 24px;
}

.tornado-row-point.old {
  --border: var(--color-error-100);
  --background: var(--color-error-25);
  --icon: url(~/assets/icons/compare-cross-sm.svg);
}

.tornado-row-point.new {
  --border: var(--color-brand-200);
  --background: var(--color-brand-50);
  --icon: url(~/assets/icons/compare-check-sm.svg);
}
</style>
