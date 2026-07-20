<script setup>
import {useAPI} from "@/composables/useAPI.js";
import MapList from "@/components/MapList.vue";

const { data: whereToBuyData } = await useAPI('/where-to-buy')

const { online_distributors, warning } = whereToBuyData.value

const title = 'Где купить'

const mapList = useTemplateRef('map-list')

useHead({ title })
</script>

<template>
  <main class="pt-[24px] laptop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[32px]"
        :light="true"
      />

      <div class="grid gap-[16px] laptop:gap-[64px]">
        <section>
          <h1 class="laptop:mb-[32px]">{{ title }}</h1>

          <div class="flex items-center gap-[12px] bg-warning-50 outline-2 -outline-offset-2 outline-warning-100 text-neutral-800 rounded-[16px] p-[16px] max-laptop:text-[14px]">
            <img class="size-[24px]" src="~/assets/icons/warning.svg" alt="">
            <span>
              {{ warning }}
            </span>
          </div>

          <MapList
            ref="map-list"
            endpoint="/dealers"
            :tabs="{
              list: { icon: 'tab-list', title: 'Оффлайн-партнеры' },
              online: { icon: 'tab-globe', title: 'Онлайн-партнеры' },
              map: { icon: 'tab-location', title: 'Карта' },
            }"
          />
        </section>

        <section :class="{ 'max-laptop:hidden': mapList?.currentTab !== 'online' }">
          <h2 class="mb-[32px] max-laptop:hidden">Онлайн-дистрибьюторы</h2>
          <div class="grid laptop:grid-cols-3 items-center gap-[12px] laptop:gap-[24px]">
            <div
              v-for="distributor in online_distributors"
              :key="distributor.id"
              class="distributor-item"
            >
              <div class="flex gap-[12px]">
                <img :src="distributor.logo" alt="" class="distributor-logo">

                <div class="grid gap-[4px] flex-1">
                  <div class="flex justify-between">
                    <div class="font-semibold">
                      {{ distributor.name }}
                    </div>
                    <div class="font-medium text-neutral-600 text-[14px]">
                      {{ distributor.schedule_text }}
                    </div>
                  </div>

                  <div class="flex items-baseline gap-[4px] text-[14px]">
                    <span class="font-semibold">{{ distributor.rating.toFixed(1) }}</span>
                    <span class="flex gap-[3px]">
                      <img
                        v-for="i in 5"
                        :key="i"
                        src="~/assets/icons/star.svg"
                        alt=""
                        :class="{
                          'grayscale': i > distributor.rating,
                        }"
                      >
                    </span>
                    <span class="text-neutral-500">({{ distributor.reviews_count }})</span>
                  </div>
                </div>
              </div>

              <div v-if="distributor.badges?.length" class="distributor-badges">
                <div
                  v-for="badge in distributor.badges"
                  class="distributor-badge"
                  :style="{ '--badge-color': badge.color }"
                >
                  {{ badge.text }}
                </div>
              </div>

              <NuxtLink
                :to="distributor.website"
                class="button button-secondary w-full mt-[16px] py-[10px]"
              >
                <img src="~/assets/icons/site.svg" alt="">
                <span>Перейти на сайт</span>
              </NuxtLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.distributor-item {
  background: white;
  border: 1px solid var(--color-neutral-100);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  padding: 16px;
}

.distributor-logo {
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-neutral-200);
  border-radius: 8px;
}

.distributor-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.distributor-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  background: color-mix(var(--badge-color) 10%);
  color: var(--badge-color);
  font-size: 14px;
  padding: 6px 12px;
}

.distributor-badge::before {
  line-height: 0;
}
</style>
