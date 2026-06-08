<script setup>
import HeroSlider from "@/components/HeroSlider.vue";
import ProductCard from "@/components/ProductCard.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: homeData } = await useAPI('/home')

useHead({
  title: 'Главная'
})

// const sliderItems = [
//   {
//     media_type: 'video',
//     media_url: '/media/Aqueduto_15sec.mp4'
//   },
//   {
//     media_type: 'video',
//     media_url: '/media/Aqueduto_15sec.mp4'
//   },
//   {
//     media_type: 'video',
//     media_url: '/media/Aqueduto_15sec.mp4'
//   },
//   {
//     media_type: 'video',
//     media_url: '/media/Aqueduto_15sec.mp4'
//   },
//   {
//     media_type: 'video',
//     media_url: '/media/Aqueduto_15sec.mp4'
//   },
// ]

const currentAdvantagesSlide = ref(1)
</script>

<template>
  <main class="layout pt-[24px] desktop:pt-[64px]">
    <section>
      <h1 class="index-title">
        Частица Португалии <br> в вашей ванной
      </h1>

      <div class="hero-banner desktop:rounded-[60px] desktop:h-[917px] [--opacity:1]">
        <HeroSlider
          :items="homeData.sliders"
          :pagination-offset="81"
        />
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section
          v-for="section in homeData.sections"
          :key="section.id"
          class="image-aside"
        >
          <div class="flex-1">
            <h2>{{ section.title }}</h2>
            <p class="text-secondary whitespace-pre-line">
              {{ section.content }}
            </p>
          </div>
          <img :src="section.image" alt="">
        </section>

<!--        <section class="image-aside">-->
<!--          <div class="flex-1">-->
<!--            <h2>-->
<!--              Красота формы. Точность инженерии-->
<!--            </h2>-->
<!--            <p class="text-secondary">-->
<!--              В Aqueduto дизайн не существует отдельно от функции. Современные технологии, качественные материалы и продуманная конструкция делают сантехнику эстетичной, долговечной и удобной в использовании на годы вперед.-->
<!--            </p>-->
<!--          </div>-->
<!--          <img src="/images/index-1.png" alt="">-->
<!--        </section>-->

<!--        <section class="image-aside desktop:flex-row-reverse">-->
<!--          <div class="flex-1">-->
<!--            <h2>-->
<!--              За пределами одного решения-->
<!--            </h2>-->
<!--            <p class="text-secondary">-->
<!--              Модели из наших коллекций легко находят своё место в самых разных интерьерных стилях — от строгого минимализма до тёплой классики. Всё благодаря спокойной геометрии и выверенным формам, которые гармонично дополняют интерьер.-->
<!--            </p>-->
<!--          </div>-->
<!--          <img src="/images/index-2.png" alt="">-->
<!--        </section>-->

        <section class="grid gap-[24px] desktop:gap-[32px]">
          <div class="text-center">
            <h2>Наши преимущества</h2>
            <p class="text-quaternary subtitle">6 причин выбрать Aqueduto</p>
          </div>

          <div class="slider desktop:flex-wrap max-desktop:gap-[16px] text-[14px] desktop:text-[16px]/[24px]">
            <div
              v-for="item in homeData.advantages"
              :key="item.id"
              class="slider-item advantage-item"
            >
              <img class="advantage-icon" :src="item.icon" alt="">
              <div>
                <h6>{{ item.title }}</h6>
                <p>{{ item.description }}</p>
              </div>
            </div>

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Долговечность</h6>-->
<!--                <p>Прочные материалы и современные технологии обеспечивают стабильную работу на долгие годы вперед</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Эстетика и дизайн</h6>-->
<!--                <p>Сантехника выглядит аккуратно и уместно в интерьере ванной комнаты любого стиля —-->
<!--                  от минимализма до классики</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Экологичность</h6>-->
<!--                <p>Технологии Aqueduto снижают потребление воды и энергии, делая изделия более практичными и экологичными</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Контроль качества</h6>-->
<!--                <p>Строгая проверка изделий гарантирует герметичность, надежность механизмов и безупречную работу</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Простота обслуживания</h6>-->
<!--                <p>Благодаря продуманной конструкции монтаж проходит быстрее, а уход и обслуживание становятся значительно проще</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="slider-item advantage-item">-->
<!--              <img class="advantage-icon" src="~/assets/icons/hourglass.svg" alt="">-->
<!--              <div>-->
<!--                <h6>Гарантия</h6>-->
<!--                <p>Долгосрочная гарантия на все изделия служит дополнительным подтверждением надежности нашей продукции</p>-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <div class="dot-pagination">
            <div
              v-for="index in homeData.advantages.length"
              :key="index"
              :class="{
                'dot-pagination-item': true,
                'active': currentAdvantagesSlide === index
              }"
            ></div>
          </div>
        </section>
      </div>
    </div>

    <section class="bg-[#7195B5] py-[48px] desktop:py-[40px]">
      <div class="container">
        <div class="grid gap-[16px] items-center desktop:grid-cols-2 max-desktop:text-center">
          <h2 class="text-white m-0">
            Наша философия
          </h2>
          <p class="text-white font-semibold">
            Мы верим в то, что сантехника — это не фурнитура, а часть архитектуры дома. Поэтому делаем её для тех, кто строит пространство надолго — и ценит, когда вещи работают тихо и точно, и выглядят красиво.
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section class="text-center">
          <h2>Готовые решения</h2>
          <p class="text-quaternary subtitle">
            Интерьер вашей ванной в едином стиле
          </p>
          <div class="flex flex-wrap gap-[12px] desktop:gap-[24px] mt-[24px] desktop:mt-[40px]">
            <NuxtLink
              v-for="style in homeData.styles"
              :key="style.id"
              class="image-gradient style-item"
              :style="{ '--bg': `url(${style.thumbnail})` }"
              :to="`/gallery/${style.slug}`"
              :data-name="style.title"
            > </NuxtLink>
<!--            <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-8.jpg)]" data-name="Стиль"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-12.png)]" data-name="Минимализм"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-3.jpg)]" data-name="Стиль"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-11.jpg)] max-desktop:hidden" data-name="Традиции"> </NuxtLink>-->
<!--            <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-1.jpg)] max-desktop:hidden" data-name="Современная классика"> </NuxtLink>-->
          </div>
          <button class="button-rounded mt-[16px] desktop:mt-[32px] mx-auto max-desktop:w-full">
            Посмотреть все
          </button>
        </section>

        <section>
          <div class="max-desktop:text-center">
            <h2>Новинки</h2>
            <p class="text-tertiary subtitle">
              Свежие решения для вашей ванной
            </p>
          </div>

          <div class="relative grid gap-[16px] max-desktop:mt-[24px]">
            <div class="arrows desktop:absolute bottom-[100%] justify-self-end">
              <button
                class="arrow arrow-left"
              ></button>
              <button
                class="arrow arrow-right"
              ></button>
            </div>

            <div class="slider desktop:py-[32px]">
              <ProductCard
                v-for="product in homeData.new_products"
                :key="product.id"
                v-bind="product"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-center">Полезные материалы</h2>
          <div class="flex max-desktop:flex-col gap-[12px_24px] mt-[24px] desktop:mt-[32px]">
            <NuxtLink
              v-for="item in homeData.materials"
              :key="item.id"
              class="material-item image-gradient"
              :to="`/${item.slug}`"
              :style="{ '--bg': `url(${item.cover})` }"
            >
              <h4>{{ item.title }}</h4>
             </NuxtLink>
<!--            <NuxtLink to="/tornado" class="material-item image-gradient [&#45;&#45;bg:url(/images/material-1.jpg)]">-->
<!--              <h4>Смыв “Торнадо”</h4>-->
<!--             </NuxtLink>-->
<!--            <NuxtLink to="/materials" class="material-item image-gradient [&#45;&#45;bg:url(/images/material-2.jpg)]">-->
<!--              <h4>Инструкции</h4>-->
<!--             </NuxtLink>-->
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .index-title {
    font-size: 28px;
    text-align: center;
    line-height: 1.2;

    @variant desktop {
      font-size: 80px;
      margin-bottom: 64px;
      letter-spacing: -0.02em;
    }
  }

  .material-item {
    display: grid;
    min-height: 180px;
    align-content: end;
    border-radius: 20px;
    color: #FCFCFD;
    padding: 12px 16px;
    flex: 1;

    @variant desktop {
      height: 436px;
      border-radius: 32px;
      padding: 32px;
    }
  }
}
</style>
