<script setup>
import {useAPI} from "@/composables/useAPI.js";
import Dropdown from "@/components/Dropdown.vue";
import MapList from "@/components/MapList.vue";

const { data: contactsData } = await useAPI('/contacts')

const { general, regions, services } = contactsData.value

const title = 'Контакты'

useHead({ title })

const selectedLocation = ref(null)
const activeLocation = ref(null)
let hoverTimeout = null

const selectedLocationDropdown = ref(0)

function clearLocation() {
  selectedLocation.value = null
  activeLocation.value = null
}

function onLocationHover(location) {
  if (activeLocation.value === null) {
    hoverTimeout = setTimeout(
      () => { selectedLocation.value = location },
      1000
    )
  }
}

function onLocationLeave() {
  if (activeLocation.value === null) {
    clearLocation()
  }

  clearTimeout(hoverTimeout)
}

function onLocationClick(location, index) {
  selectedLocation.value = location
  activeLocation.value = index
}
</script>

<template>
  <main class="container laptop:pt-[48px]">
    <Breadcrumb
      :items="[ { name: title } ]"
      class="mb-[32px]"
      :light="true"
    />

    <div class="layout">
      <section>
        <div class="text-center">
          <h1 class="mb-[12px]">{{ title }}</h1>
          <p class="subtitle">
            Готовы помочь вам в любой точке России!
          </p>

          <div class="relative max-w-[1200px] mx-auto mt-[64px] max-laptop:hidden">
            <img
              class="w-full"
              src="/images/map.svg"
              alt=""
              @click="clearLocation"
            >

            <button
              v-for="(location, index) in regions"
              :class="{
              'map-location': true,
              'active': activeLocation === index,
            }"
              :style="{ left: `${location.map_x}%`, top: `${location.map_y}%` }"
              @pointerover="onLocationHover(location)"
              @pointerleave="onLocationLeave()"
              @click="onLocationClick(location, index)"
            ></button>

            <div
              v-show="selectedLocation"
              class="absolute grid gap-[8px] justify-items-center bg-white border border-neutral-200 rounded-[8px] p-[12px_24px] text-[14px] shadow-lg -translate-x-1/2 -translate-y-[calc(100%+36px)]"
              :style="{ left: `${selectedLocation?.map_x}%`, top: `${selectedLocation?.map_y}%` }"
            >
              <img width="20" :src="selectedLocation?.icon" alt="">
              <div class="font-semibold">
                {{ selectedLocation?.name }}
              </div>
              <div class="grid gap-[4px] text-neutral-700 text-[12px]/[18px]">
                <div v-for="phone in selectedLocation?.phones">
                  {{ phone }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex max-laptop:grid items-start gap-[16px_24px] mt-[24px] laptop:mt-[64px]">
          <div class="contact-block">
            <div class="flex justify-between items-start">
              <img src="~/assets/icons/contact-phone.svg" alt="" class="contact-icon">

              <Dropdown
                class="ml-auto"
                :label="regions[selectedLocationDropdown].name"
                button-class="rounded-[10px]! px-[12px]"
                content-class="dropdown-content"
                :close-on-click="true"
              >
                <div
                  v-for="(location, index) in regions"
                  class="dropdown-item"
                  @click="selectedLocationDropdown = index"
                >
                  {{ location.name }}
                </div>
              </Dropdown>
            </div>

            <h6 class="mb-[4px]">
              Позвоните нам
            </h6>
            <div class="text-neutral-500">
              {{ general.working_hours }}
            </div>

            <div class="grid gap-[8px] mt-[20px]">
              <NuxtLink
                v-for="phone in regions[selectedLocationDropdown].phones"
                :to="`tel:${phone}`"
                class="button button-secondary text-neutral-700 py-[10px]"
              >
                {{ phone }}
              </NuxtLink>
            </div>
          </div>

          <div class="contact-block">
            <img src="~/assets/icons/contact-email.svg" alt="" class="contact-icon">

            <h6 class="mb-[4px]">
              Почтовый адрес
            </h6>
            <div class="text-neutral-500">
              Получите ответы на почту
            </div>

            <div class="grid gap-[8px] mt-[20px]">
              <NuxtLink :to="`mailto:${general.email}`" class="button button-secondary text-neutral-700 py-[10px]">
                {{ general.email }}
              </NuxtLink>
            </div>
          </div>

          <div class="contact-block">
            <img src="~/assets/icons/contact-social.svg" alt="" class="contact-icon">

            <h6 class="mb-[4px]">
              Соц. сети
            </h6>
            <div class="text-neutral-500">
              Наши каналы в мессенджерах
            </div>

            <div class="grid gap-[8px] mt-[20px]">
              <NuxtLink
                v-for="link in general.social_links"
                :key="link.type"
                :to="link.url"
                class="button button-secondary text-neutral-700 py-[10px]"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="contact-block">
            <img src="~/assets/icons/contact-service.svg" alt="" class="contact-icon">

            <h6 class="mb-[4px]">
              {{ general.service_label }}
            </h6>
            <div class="text-neutral-500">
              По вопросам эксплуатации
            </div>

            <div class="grid gap-[8px] mt-[20px]">
              <NuxtLink :to="`tel:${general.service_phone}`" class="button button-secondary text-neutral-700 py-[10px]">
                {{ general.service_phone }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="text-center mb-[32px]">
          <h1 class="mb-[12px]">
            {{ services.title }}
          </h1>
          <p class="subtitle">
            {{ services.subtitle }}
          </p>
        </div>

        <MapList endpoint="/services" />
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.map-location {
  --inner-size: 12px;
  --middle-size: 7px;
  --outer-size: 14px;
  --middle-opacity: 25%;
  --outer-opacity: 10%;

  position: absolute;
  width: var(--inner-size);
  height: var(--inner-size);
  background: var(--color-info-500);
  box-shadow:
          0 0 0 var(--middle-size) color-mix(in oklab, var(--color-info-500) var(--middle-opacity), transparent),
          0 0 0 var(--outer-size) color-mix(in oklab, var(--color-info-500) var(--outer-opacity), transparent);
  border-radius: 50%;
  translate: -50% -50%;
  transition: 0.2s;
}

.map-location:hover {
  --inner-size: 16px;
  --middle-size: 8px;
  --middle-opacity: 30%;
  --outer-opacity: 12%;
}

.map-location.active {
  --inner-size: 16px;
  --middle-size: 14px;
  --middle-opacity: 30%;
  --outer-opacity: 15%;
  background: var(--color-info-600);
}

.contact-block {
  background: white;
  border: 1px solid var(--color-neutral-100);
  border-radius: 32px;
  box-shadow: var(--shadow-md);
  padding: 16px;
  flex: 1;

  @variant laptop {
    padding: 24px;
  }
}

.contact-icon {
  background: var(--color-brand-600);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 32px;
}
</style>
