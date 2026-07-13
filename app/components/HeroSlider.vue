<script setup>
import useSlider from "@/composables/useSlider.js";

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const container = useTemplateRef('container')
const itemRefs = ref([])

const slider = useSlider(container, itemRefs)
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
          'hero-slider-item image-gradient flex items-center max-laptop:justify-center px-[32px] laptop:px-[160px]': true,
          'hero-slider-video': item.media_type === 'video'
        }"
        :style="item.media_type === 'image' && { '--bg': `url(${item.media_url})` }"
      >
        <video
          v-if="item.media_type === 'video'"
          :src="item.media_url"
          class="absolute size-full inset-0 object-cover"
          autoplay
          playsinline
          muted
          loop
        ></video>

        <div
          v-if="item.title || item.subtitle || item.cta"
          class="grid laptop:justify-items-start gap-[16px] max-w-[904px] z-9 max-laptop:text-center max-laptop:bg-black/20 max-laptop:backdrop-blur-[10px] max-laptop:rounded-[12px] max-laptop:p-[24px_12px]"
        >
          <h1
            v-if="item.title"
            class="text-text-inverse m-0"
          >
            {{ item.title }}
          </h1>
          <p
            v-if="item.subtitle"
            class="text-white laptop:text-[20px]/[32px] max-laptop:text-[14px]/[20px]"
          >
            {{ item.subtitle }}
          </p>
          <NuxtLink
            v-if="item.cta?.text"
            :to="item.cta.url"
            class="button button-secondary"
          >
            {{ item.cta.text }}
           </NuxtLink>
        </div>
      </div>
    </div>

    <div class="hero-slider-controls">
      <div class="pill-pagination stripe-pagination">
        <button
          v-for="(_, index) in slider.scrollPointsCount.value"
          :key="index"
          :class="{
            'pill-pagination-item stripe-pagination-item': true,
            'active': slider.activeItem.value === index
          }"
          @click="slider.goToSlide(index)"
        ></button>
      </div>

      <div class="hero-slider-nav arrows max-laptop:hidden">
        <button
          class="arrow arrow-left"
          :disabled="slider.activeItem.value === 0"
          @click="slider.previousSlide"
        ></button>
        <button
          class="arrow arrow-right"
          :disabled="slider.activeItem.value === slider.scrollPointsCount.value - 1"
          @click="slider.nextSlide"
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

    @variant laptop {
      bottom: 44px;
    }
  }

  .hero-slider-nav {
    position: absolute;
    right: 160px;
  }
}
</style>
