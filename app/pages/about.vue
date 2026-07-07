<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: aboutData } = await useAPI('/about')

const { hero, blocks, testimonials } = aboutData.value

const title = 'О нас'

useHead({ title })
</script>

<template>
  <main class="layout">
    <section
      class="hero-banner image-gradient"
      :style="{ '--bg': `url(${hero.image})` }"
    >
      <div class="container grid">
        <Breadcrumb :items="[ { name: title } ]" />

        <div class="absolute place-self-center bg-black/20 backdrop-blur-[10px] rounded-[12px] desktop:rounded-[30px] mx-[16px] p-[24px_12px] desktop:p-[32px_64px] text-center desktop:w-[836px]">
          <h1 class="text-text-inverse">
            {{ hero.title }}
          </h1>
          <p class="text-white max-desktop:text-[14px]/[20px]">
            {{ hero.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="layout">
        <section
          v-for="section in blocks"
          :key="section.key"
          class="image-aside"
        >
          <div class="flex-1">
            <h2>{{ section.title }}</h2>
            <p class="text-neutral-700 whitespace-pre-line">
              {{ section.content }}
            </p>
          </div>
          <img :src="section.image" alt="">
        </section>

        <section>
          <h2 class="text-center desktop:mb-[32px]">Отзывы наших клиентов</h2>
          <div class="grid items-center desktop:grid-cols-3 gap-[12px] desktop:gap-[24px]">
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md"
            >
              <div class="whitespace-pre-line text-neutral-600">
                {{ testimonial.review_text }}
              </div>
              <div class="flex items-center gap-[12px]">
                <img class="size-[48px] rounded-full" :src="testimonial.avatar" alt="">
                <div>
                  <div class="font-bold mb-[4px]">
                    {{ testimonial.user_name }}
                  </div>
                  <span class="flex gap-[3px]">
                    <img
                      v-for="i in 5"
                      :key="i"
                      src="~/assets/icons/star.svg"
                      alt=""
                      :class="{
                        'grayscale': i > testimonial.rating,
                      }"
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
