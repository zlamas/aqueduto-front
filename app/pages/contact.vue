<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: contactsData } = await useAPI('/contacts')

const { general, regions } = contactsData.value

const title = 'Контакты'

useHead({ title })

const selectedLocation = ref(null)
const activeLocation = ref(null)
let hoverTimeout = null

const selectedLocationDropdown = ref(0)

// const locations = [
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '58.0%', left: '12.3%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '80.8%', left:  '6.2%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '78.4%', left: '11.8%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '75.1%', left: '23.0%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '53.2%', left: '28.3%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '68.2%', left: '38.0%' }
//   },
//   {
//     name: 'Москва и МО',
//     icon: '/images/coat-of-arms.png',
//     phones: [ '+7 968 765 83 87', '+7 903 725 20 91' ],
//     style: { top: '55.6%', left: '69.8%' }
//   },
// ]

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
    selectedLocation.value = null
  }

  clearTimeout(hoverTimeout)
}

function onLocationClick(location, index) {
  selectedLocation.value = location
  activeLocation.value = index
}
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[64px]"
      />

      <section class="text-center">
        <h1>{{ title }}</h1>
        <p class="text-tertiary subtitle">
          Готовы помочь вам в любой точке России!
        </p>

        <div class="relative max-w-[1200px] mx-auto mt-[64px] max-desktop:hidden">
          <img class="w-full pointer-events-none" src="/images/map.svg" alt="">

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
            class="absolute grid gap-[8px] justify-items-center bg-white border border-[#E2E8F0] rounded-[8px] p-[12px_24px] text-[14px] shadow-lg -translate-x-1/2 -translate-y-[calc(100%+36px)]"
            :style="{ left: `${selectedLocation?.map_x}%`, top: `${selectedLocation?.map_y}%` }"
          >
            <img width="20" :src="selectedLocation?.icon" alt="">
            <div class="font-semibold">
              {{ selectedLocation?.name }}
            </div>
            <div class="grid gap-[4px] text-secondary text-[12px]/[18px]">
              <div v-for="phone in selectedLocation?.phones">
                {{ phone }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="flex max-desktop:grid items-start gap-[16px_24px] mt-[24px] desktop:mt-[80px]">
        <div class="contact-block">
          <div class="flex justify-between items-start">
            <img src="~/assets/icons/contact-phone.svg" alt="" class="contact-icon">
            <select v-model="selectedLocationDropdown">
              <option
                v-for="(location, index) in regions"
                :value="index"
              >
                {{ location.name }}
              </option>
            </select>
          </div>

          <h6 class="mb-[4px]">
            Позвоните нам
          </h6>
          <div class="text-quaternary">
            ПН-ПТ: 10.00 - 19.00
          </div>

          <div class="grid gap-[8px] mt-[20px]">
            <NuxtLink
              v-for="phone in regions[selectedLocationDropdown].phones"
              :to="`tel:${phone}`"
              class="button-rounded"
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
          <div class="text-quaternary">
            Если вам больше нравится писать
          </div>

          <div class="grid gap-[8px] mt-[20px]">
            <NuxtLink :to="`mailto:${general.email}`" class="button-rounded">
              {{ general.email }}
             </NuxtLink>
          </div>
        </div>
        <div class="contact-block">
          <img src="~/assets/icons/contact-social.svg" alt="" class="contact-icon">

          <h6 class="mb-[4px]">
            Соц. сети
          </h6>
          <div class="text-quaternary">
            Наши каналы в мессенджерах
          </div>

          <div class="grid gap-[8px] mt-[20px]">
            <NuxtLink
              v-for="link in general.social_links"
              :key="link.type"
              :to="link.url"
              class="button-rounded"
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
          <div class="text-quaternary">
            Поможем с любыми вопросами
          </div>

          <div class="grid gap-[8px] mt-[20px]">
            <NuxtLink :to="`tel:${general.service_phone}`" class="button-rounded">
              {{ general.service_phone }}
             </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.map-location {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #8CB0C8;
  box-shadow: 0 0 0 8px #8CB0C833, 0 0 0 16px #8CB0C81A;
  border-radius: 50%;
  translate: -50% -50%;
}

.map-location:hover,
.map-location.active {
  width: 16px;
  height: 16px;
  box-shadow: 0 0 0 6px #8CB0C833, 0 0 0 12px #8CB0C81A;
}

.contact-block {
  background: white;
  border: 1px solid #F3F9FA;
  border-radius: 32px;
  box-shadow: var(--shadow-md);
  padding: 16px;
  flex: 1;

  @variant desktop {
    padding: 24px;
  }
}

.contact-icon {
  background: #E9F4F6;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 32px;
}
</style>
