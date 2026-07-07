<script setup>
import {useAPI} from "@/composables/useAPI.js";
import {getDayOfWeek} from "@/assets/js/funcs.js";

const { data: whereToBuyData } = await useAPI('/where-to-buy')

const { dealers, online_distributors, warning } = whereToBuyData.value

const title = 'Где купить'

useHead({
  title,
  script: [
    {
      src: 'https://api-maps.yandex.ru/2.1/?apikey=86cb0147-d5b1-4892-ac30-f7ce196228c8&load=package.standard&lang=ru_RU',
      defer: true,
      onload: () => ymaps.ready(initMap)
    }
  ]
})

const today = getDayOfWeek()

let map

function initMap() {
  map = new ymaps.Map('map', {
    center: [dealers[0].latitude, dealers[0].longitude],
    zoom: 16,
  })

  let LayoutClass = ymaps.templateLayoutFactory.createClass(`
    <div class="store-balloon {% if properties.is_open %} open {% else %} closed {% endif %}">
      {% if properties.image %}
      <img class="store-balloon-image" src="{{ properties.image }}" alt="">
      {% endif %}

      <div class="store-balloon-content">
        <div class="store-info">
          <div class="store-name">{{ properties.name }}</div>

          {% if properties.metro %}
          <div class="store-metro text-neutral-600">{{ properties.metro }}</div>
          {% endif %}

          <div class="text-neutral-600">
            <span class="store-city">{{ properties.city }}</span>
            <span> · </span>
            <span class="store-address">{{ properties.address }}</span>
          </div>
        </div>

        <div class="store-schedule py-[8px]">
          <span class="store-status"></span>
          <span> · </span>
          <span>{{ properties.status_text }}</span>
        </div>

        <div class="grid gap-[8px]">
          <a
           href="tel:{{ properties.phone }}"
           class="button button-primary rounded-[10px] p-[10px]"
          >
            <img src="/images/phone.svg" alt="">
            <span>{{ properties.phone }}</span>
          </a>
          <a
            href="{{ properties.website }}"
            class="button button-secondary rounded-[10px] p-[10px]"
          >
            <img src="/images/site.svg" alt="">
            <span>Сайт магазина</span>
          </a>
        </div>
      </div>
    </div>
  `)

  dealers.forEach((dealer, index) => {
    let my_placemark = new ymaps.Placemark(
      [dealer.latitude, dealer.longitude],
      dealer,
      {
        iconLayout: 'default#imageWithContent',
        iconImageHref: '/images/map-marker.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, 8],
        hideIconOnBalloonOpen: false,
        balloonLayout: LayoutClass,
      }
    )

    my_placemark.events.add('balloonopen', () => currentLocation.value = index)

    map.geoObjects.add(my_placemark)
  })
}

const currentLocation = ref(null)

const dealersWrapper = useTemplateRef('dealers-wrapper')

watch(
  currentLocation,
  (index) => {
    const placemark = map.geoObjects.get(index)
    placemark.balloon.open()
    map.setCenter([dealers[index].latitude, dealers[index].longitude])
    dealersWrapper.value.children[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      container: 'nearest'
    })
  }
)

const tabs = {
 offline: { icon: 'tab-list', title: 'Оффлайн-партнеры' },
 online: { icon: 'tab-globe', title: 'Онлайн-партнеры' },
 map: { icon: 'tab-location', title: 'Карта' },
}

const currentTab = ref('offline')

const days = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
}
</script>

<template>
  <main class="pt-[24px] desktop:pt-[48px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[32px]"
        :light="true"
      />

      <div class="grid gap-[16px] desktop:gap-[64px]">
        <section>
          <h1 class="desktop:mb-[32px]">{{ title }}</h1>

          <div class="flex items-center gap-[12px] bg-warning-50 border-2 border-warning-100 text-neutral-800 rounded-[16px] p-[16px]">
            <img class="size-[24px]" src="~/assets/icons/warning.svg" alt="">
            <span class="text-[14px]">
              {{ warning }}
            </span>
          </div>

          <div class="flex gap-[8px] whitespace-nowrap overflow-x-auto scrollbar-none -mx-[16px] px-[16px] mt-[24px] desktop:hidden">
            <button
              v-for="(tab, id) in tabs"
              :key="id"
              :class="{
                'button rounded-full p-[8px_16px] text-[14px] font-medium': true,
                'button-secondary': id !== currentTab,
                'bg-brand-950 text-white': id === currentTab,
              }"
              @click="currentTab = id"
            >
              <img :src="`/images/${tab.icon}${id === currentTab ? '-selected' : ''}.svg`" alt="">
              <span v-show="id === currentTab">
                {{ tab.title }}
              </span>
            </button>
          </div>

          <div
            v-show="currentTab !== 'online'"
            class="flex gap-[24px] mt-[16px] desktop:mt-[24px]"
          >
            <div
              :class="{
                'grid gap-[16px] content-start h-[764px] desktop:w-[464px] bg-neutral-100 rounded-[28px] p-[12px]': true,
                'max-desktop:hidden': currentTab !== 'offline'
              }"
            >
              <label class="search-field w-full bg-white px-[12px]">
                <input class="search-input" type="text" placeholder="Введите название/город/адрес">
              </label>

              <div
                ref="dealers-wrapper"
                class="grid gap-[8px] content-start h-full overflow-y-auto scrollbar-none"
              >
                <div
                  v-for="(dealer, index) in dealers"
                  :key="dealer.id"
                  :class="{
                    'store-item': true,
                    'open': dealer.is_open,
                    'closed': !dealer.is_open,
                    'selected': currentLocation === index
                  }"
                  @click="() => {
                    currentLocation = index
                    currentTab = 'map'
                  }"
                >
                  <div class="store-info">
                    <div class="store-name">{{ dealer.name }}</div>
                    <div
                      v-if="dealer.metro"
                      class="store-metro"
                    >
                      {{ dealer.metro }}
                    </div>
                    <div>
                      <span class="store-city">{{ dealer.city }}</span>
                      <span> · </span>
                      <span class="store-address">{{ dealer.address }}</span>
                    </div>
                  </div>

                  <div class="store-schedule">
                    <span class="store-status"></span>
                    <span> · </span>
                    <details
                      v-if="Object.keys(dealer.schedule).length"
                      class="store-schedule-details"
                    >
                      <summary class="store-schedule-open" @click.stop>
                        {{ dealer.status_text }}
                      </summary>
                      <table class="store-schedule-table">
                        <colgroup>
                          <col class="w-full">
                          <col>
                        </colgroup>
                        <tbody>
                          <tr
                            v-for="(hours, day) in dealer.schedule"
                            :class="{ 'today': today === day }"
                          >
                            <td>{{ days[day] }}</td>
                            <td>{{ hours.open }} - {{ hours.close }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </details>
                  </div>
                </div>
              </div>
            </div>


            <div
              :class="{
                'grid gap-[16px] bg-neutral-100 rounded-[28px] desktop:rounded-[40px] overflow-hidden max-desktop:p-[12px] flex-1': true,
                'max-desktop:hidden': currentTab !== 'map'
              }"
            >
              <label class="search-field w-full bg-white px-[12px] desktop:hidden">
                <input class="search-input" type="text" placeholder="Введите название/город/адрес">
              </label>

              <div
                class="rounded-[16px] desktop:rounded-[40px] overflow-hidden max-desktop:h-[487px]"
                id="map"
              ></div>
            </div>
          </div>
        </section>

        <section :class="{ 'max-desktop:hidden': currentTab !== 'online' }">
          <h2 class="mb-[32px] max-desktop:hidden">Онлайн-дистрибьюторы</h2>
          <div class="grid desktop:grid-cols-3 items-center gap-[12px] desktop:gap-[24px]">
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

<style>
@reference "~/assets/css/main.css";

.store-item {
  display: grid;
  gap: 14px;
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  color: var(--color-neutral-600);
  font-size: 14px;
  cursor: pointer;
}

.store-item:hover {
  background: var(--color-neutral-50);
}

.store-item.selected {
  background: var(--color-neutral-50);
  outline: 1px solid var(--color-info-500);
  outline-offset: -1px;
}

.open {
  --status-color: var(--color-success-500);
  --status-content: 'Открыто';
}

.closed {
  --status-color: var(--color-error-500);
  --status-content: 'Закрыто';
}

.store-info {
  display: grid;
  gap: 4px;
}

.store-name {
  color: var(--color-brand-950);
  font-size: 16px;
  font-weight: 600;
}

.store-metro {
  display: flex;
  align-items: center;
  gap: 4px;
}

.store-metro::before {
  content: url(~/assets/icons/metro-moscow.svg);
  line-height: 0;
}

.store-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-neutral-700);
}

.store-schedule {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-neutral-500);
}

.store-status::before {
  content: '';
  width: 8px;
  height: 8px;
  background-color: var(--status-color);
  border-radius: 50%;
}

.store-status::after {
  content: var(--status-content);
}

.store-schedule-details {
  flex: 1;
}

.store-schedule-open {
  display: inline-flex;
  gap: 2px;
}

.store-schedule-open::after {
  content: url(~/assets/icons/arrow-collapse.svg);
  line-height: 0;
}

[open] > .store-schedule-open::after {
  rotate: 180deg;
}

.store-schedule-table {
  width: 100%;
  margin-top: 8px;
  white-space: nowrap;
  font-size: 12px;
}

.store-schedule-table td:last-child {
  text-align: center;
}

.today {
  color: var(--color-neutral-700);
  font-weight: 600;
}

.store-balloon {
  display: grid;
  width: 256px;
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  translate: -50% -100%;
  overflow: hidden;

  @variant desktop {
    width: 320px;
  }
}

.store-balloon-content {
  display: grid;
  gap: 8px;
  padding: 16px;
}

.store-balloon-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

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
