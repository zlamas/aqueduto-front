<script setup>
import useSlider from "@/composables/useSlider.js";

defineProps({
  items: {
    type: Array,
    required: true,
  },
  paginationOffset: Number,
})

const container = useTemplateRef('container')
const itemRefs = ref([])

const { activeItem, scrollPointsCount, goToSlide } = useSlider(container, itemRefs)
</script>

<template>
  <div class="hero-slider">
    <div class="hero-slider-items" ref="container">
      <div
        v-for="(item, index) in items"
        :key="index"
        :ref="(el) => itemRefs[index] = el"
        :data-slide="index + 1"
        :class="{
          'hero-slider-item image-gradient flex items-center px-[32px] desktop:px-[160px]': true,
          'hero-slider-video': item.media_type === 'video'
        }"
        :style="item.media_type === 'image' && { '--bg': `url(${item.media_url})` }"
      >
        <video
          v-if="item.media_type === 'video'"
          :src="item.media_url"
          class="absolute size-full inset-0 object-cover"
        ></video>

        <div
          v-if="item.title || item.subtitle || item.cta"
          class="grid desktop:justify-items-start gap-[16px] max-w-[904px] z-9 max-desktop:text-center max-desktop:bg-[#00000033] max-desktop:backdrop-blur-[10px] max-desktop:rounded-[12px] max-desktop:p-[24px_12px]"
        >
          <h1
            v-if="item.title"
            class="text-[#FCFCFD] m-0"
          >
            {{ item.title }}
          </h1>
          <p
            v-if="item.subtitle"
            class="text-[#FCFCFD] desktop:text-[20px]/[32px] max-desktop:text-[14px]/[20px]"
          >
            {{ item.subtitle }}
          </p>
          <NuxtLink
            v-if="item.cta?.text"
            :to="item.cta.url"
            class="button-rounded"
          >
            {{ item.cta.text }}
           </NuxtLink>
        </div>
      </div>
    </div>

    <div class="hero-slider-controls">
      <div class="stripe-pagination">
        <button
          v-for="index in scrollPointsCount"
          :key="index"
          :class="{
            'stripe-pagination-item': true,
            'active': activeItem === index
          }"
          @click="goToSlide(index)"
        ></button>
      </div>

      <div class="hero-slider-nav arrows max-desktop:hidden">
        <button
          class="arrow arrow-left"
          :disabled="activeItem === 1"
          @click="goToSlide(activeItem - 1)"
        ></button>
        <button
          class="arrow arrow-right"
          :disabled="activeItem === scrollPointsCount"
          @click="goToSlide(activeItem + 1)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@layer components {
  .hero-slider {
    position: absolute;
    inset: 0;
  }

  .hero-slider-items {
    display: flex;
    height: 100%;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .hero-slider-item {
    min-width: 100%;
    object-fit: cover;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  .hero-slider-video::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
                        to var(--direction, bottom),
                        transparent,
                        rgba(0, 0, 0, var(--opacity, 0.5))
                      );
    pointer-events: none;
  }

  .hero-slider-controls {
    display: flex;
    position: absolute;
    bottom: 16px;
    width: 100%;
    align-items: center;
    justify-content: center;

    @variant desktop {
      bottom: v-bind(`${paginationOffset}px`);
    }
  }

  .hero-slider-nav {
    position: absolute;
    right: 160px;
  }
}
</style>
