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

const advantagesSliderContainer = useTemplateRef('advantages-slider')
const advantagesSliderItems = ref([])
const advantagesSlider = useSlider(advantagesSliderContainer, advantagesSliderItems)

const productsSliderContainer = useTemplateRef('products-slider')
const productsSlider = useSimpleSlider(productsSliderContainer)
</script>

<template>
  <main class="layout pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section class="hero-banner image-gradient grid [--bg:url(/images/style-6.jpg)] desktop:h-[800px] desktop:rounded-[32px] desktop:p-[32px_160px] desktop:shadow-[0_4px_4px_#00000040]">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="place-self-start"
      />
      <div class="absolute place-self-center bg-[#00000033] backdrop-blur-[10px] rounded-[12px] desktop:rounded-[30px] mx-[16px] p-[24px_12px] desktop:p-[32px_64px] text-center desktop:w-[836px]">
        <h1 class="text-[#FCFCFD]">
          Смыв торнадо: чистота <br> за одно движение
        </h1>
        <p class="text-[#FCFCFD] max-desktop:text-[14px]/[20px]">
          Мощный поток воды закручивается внутри чаши, обеспечивая быстрое и равномерное очищение без лишнего шума и расхода.
        </p>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section class="image-aside">
          <div>
            <h2>Как это работает</h2>
            <p class="text-secondary">
              Система торнадо-смыва направляет поток воды по кругу, создавая вихревое движение. Вода охватывает всю поверхность чаши, эффективно удаляя загрязнения даже в труднодоступных местах.
              <br><br>
              В отличие от классического смыва, здесь нет «слепых зон» — чистота достигается быстрее и с меньшим расходом воды.
            </p>
          </div>
          <img src="/images/material-1.jpg" alt="">
        </section>

        <section class="grid gap-[24px] desktop:gap-[32px]">
          <div class="text-center">
            <h2>Почему это удобно</h2>
            <p class="text-quaternary font-medium">6 причин выбрать смыв торнадо</p>
          </div>

          <div
            ref="advantages-slider"
            class="slider desktop:flex-wrap max-desktop:gap-[16px] text-[14px] desktop:text-[16px]/[24px]"
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
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div class="dot-pagination">
            <div
              v-for="index in advantagesSlider.scrollPointsCount.value"
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
          <div class="text-center">
            <h2>Разница в работе смыва</h2>
            <p class="text-quaternary font-medium">
              Технология торнадо не просто усиливает поток — она меняет принцип работы смыва. <br> Вместо прямого потока создаётся управляемое движение, которое использует воду максимально эффективно.
            </p>
          </div>

          <div class="table-wrapper mt-[24px] desktop:mt-[32px]">
            <table class="tornado-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Обычный смыв</th>
                  <th>Смыв “Торнадо”</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Охват чаши</td>
                  <td>
                    <div class="tornado-table-point">
                      Неполное покрытие чаши
                    </div>
                  </td>
                  <td>
                    <div class="tornado-table-point">
                      Полное покрытие чаши
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Эффективность</td>
                  <td>
                    <div class="tornado-table-point">
                      Требуется повторный смыв
                    </div>
                  </td>
                  <td>
                    <div class="tornado-table-point">
                      Чистота с первого раза
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Расход воды</td>
                  <td>
                    <div class="tornado-table-point">
                      Повышенный расход воды
                    </div>
                  </td>
                  <td>
                    <div class="tornado-table-point">
                      Экономный расход воды
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Уровень шума</td>
                  <td>
                    <div class="tornado-table-point">
                      Шумный слив
                    </div>
                  </td>
                  <td>
                    <div class="tornado-table-point">
                      Слив заметно тише
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div class="flex max-desktop:flex-col justify-between items-center gap-[24px] max-desktop:mb-[16px]">
            <div class="max-desktop:text-center">
              <h2>Попробуйте в реальной жизни</h2>
              <p class="text-tertiary subtitle">
                Ознакомьтесь с моделями и выберите подходящее решение для вашей ванной комнаты
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
            class="slider desktop:py-[32px]"
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
  --border: #F1F5F9;
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  overflow: hidden;

  @variant desktop {
    --border: #E2E8F0;
  }
}

.tornado-table {
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  table-layout: fixed;

  @variant desktop {
    font-size: 16px;
  }
}

.tornado-table tr:not(tbody > :last-child) {
  border-bottom: 1px solid var(--border);
}

.tornado-table :is(th, td):not(:last-child) {
  border-right: 1px solid var(--border);
}

.tornado-table th {
  font-size: 20px;
  line-height: 32px;
  font-weight: 600;
  padding-block: 32px;

  @variant desktop {
    font-size: 24px;
  }
}

.tornado-table td {
  padding-block: 24px;

  @variant max-desktop {
    color: var(--color-tertiary);
  }
}

@variant max-desktop {
  .tornado-table :is(th, td):nth-child(1) {
    display: none;
  }
}

.tornado-table td:nth-child(1) {
  background: #F1F5F9;
  color: var(--color-tertiary);
  font-size: 20px;
  line-height: 32px;
}

.tornado-table td:nth-child(2) {
  --icon: url(~/assets/icons/compare-cross.svg);
  background: #FFFBFB;
  vertical-align: top;
}

.tornado-table td:nth-child(3) {
  --icon: url(~/assets/icons/compare-check.svg);
  background: #F5FAFF;
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
  width: 32px;
  height: 32px;

  @variant desktop {
    width: 40px;
    height: 40px;
  }
}
</style>
