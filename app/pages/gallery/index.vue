<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: galleryData } = await useAPI('/gallery')

const { styles } = galleryData.value

const title = 'Галерея'

useHead({ title })

const sliderPosition = ref(50)

const sliderImages = ref([
  [ '/images/gallery-1-1.png', '/images/gallery-1-2.png' ],
  [ '/images/gallery-2-1.png', '/images/gallery-2-2.png' ],
  [ '/images/gallery-3-1.png', '/images/gallery-3-2.png' ],
])

const currentImageIndex = ref(0)
</script>

<template>
  <main class="layout pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section>
      <div class="hero-banner flex justify-center h-[746px] desktop:h-[1024px] mb-[32px] desktop:mb-[64px] text-center desktop:rounded-[60px]">
        <div
          class="absolute inset-0 bg-center bg-cover pt-[46px] desktop:pt-[94px]"
          :style="{
            backgroundImage: `url(${sliderImages[currentImageIndex][1]})`,
          }"
        >
          <h1 class="text-[24px]/[36px] desktop:text-[64px]/[72px] text-white">
            Стиль ванной в вашем <br> характере
          </h1>
        </div>
        <div
          class="absolute inset-0 bg-center bg-cover pt-[46px] desktop:pt-[94px] overflow-clip"
          :style="{
            backgroundImage: `url(${sliderImages[currentImageIndex][0]})`,
            mask: `linear-gradient(to right, white ${sliderPosition}%, transparent ${sliderPosition}%)`,
          }"
        >
          <h1 class="text-[24px]/[36px] desktop:text-[64px]/[72px] text-black">
            Стиль ванной в вашем <br> характере
          </h1>
        </div>
        <div
          class="absolute flex items-center justify-center bg-white w-[4px] desktop:w-[10px] h-full top-0 -translate-x-1/2 cursor-col-resize"
          :style="{ left: `${sliderPosition}%` }"
        >
          <div class="size-[40px] desktop:size-[80px] shrink-0 rounded-full bg-white bg-center bg-size-[50%] bg-no-repeat bg-[url(~/assets/icons/slider-arrows.svg)]"></div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="any"
          v-model="sliderPosition"
          class="slider"
        />
        <div class="absolute bottom-0 rounded-t-[40px] desktop:bg-white p-[16px]">
          <button
            class="button-rounded rounded-full text-[#7195B5] before:content-[url(~/assets/icons/rotate.svg)] before:leading-0"
            @click="currentImageIndex = (currentImageIndex + 1) % sliderImages.length"
          >
            Сменить стили
          </button>

          <div class="absolute bottom-0 right-full size-[40px] overflow-hidden before:absolute before:inset-0 before:outline-white before:outline-[40px] before:rounded-br-full max-desktop:hidden"></div>
          <div class="absolute bottom-0 left-full size-[40px] overflow-hidden before:absolute before:inset-0 before:outline-white before:outline-[40px] before:rounded-bl-full max-desktop:hidden"></div>
        </div>
      </div>
      <p class="max-w-[708px] text-tertiary text-center desktop:font-medium m-auto px-[16px]">
        У каждой ванной — своя интонация. Утренняя тишина минимализма, глубина классических линий, лёгкость скандинавской геометрии — Aqueduto чувствует себя дома в каждом из этих миров.
      </p>
    </section>

    <div class="container">
      <section>
        <h2 class="text-center">Наши интерьеры</h2>
        <div class="flex max-desktop:flex-col desktop:flex-wrap justify-center gap-[12px] desktop:gap-[24px] mt-[24px] desktop:mt-[40px]">
          <NuxtLink
            v-for="style in styles"
            :key="style.id"
            class="image-gradient style-item"
            :style="{ '--bg': `url(${style.thumbnail})` }"
            :to="`/gallery/${style.slug}`"
            :data-name="style.title"
          > </NuxtLink>
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-1.jpg)]" data-name="Современная классика"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-2.jpg)]" data-name="Скандинавский уют"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-3.jpg)]" data-name="Неомодерн"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-4.jpg)]" data-name="Минимализм с характером"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-5.jpg)]" data-name="Эко-модерн"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-6.jpg)]" data-name="Базовая гармония"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-7.jpg)]" data-name="Скандинавская геометрия"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-8.jpg)]" data-name="Модерн"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-9.jpg)]" data-name="Классика"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-10.jpg)]" data-name="Минимализм"> </NuxtLink>-->
<!--          <NuxtLink to="/gallery/style" class="image-gradient style-item [&#45;&#45;bg:url(/images/style-11.jpg)]" data-name="Традиции"> </NuxtLink>-->
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .slider {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .style-item {
    max-width: 708px;
    border-radius: 20px;
    flex: 1 40%;

    @variant desktop {
      height: 360px;
      border-radius: 32px;
    }
  }
}
</style>
