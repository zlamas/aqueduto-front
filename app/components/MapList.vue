<script setup>
import {useAPI} from "@/composables/useAPI.js";
import {getDayOfWeek} from "@/assets/js/funcs.js";
import Search from "@/components/Search.vue";

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  tabs: {
    type: Object,
    default: {
      list: { icon: 'tab-list', title: 'Список' },
      map: { icon: 'tab-location', title: 'Карта' },
    },
  }
})

const { onLoaded } = useScript(
  'https://api-maps.yandex.ru/2.1/?apikey=86cb0147-d5b1-4892-ac30-f7ce196228c8&load=package.standard&lang=ru_RU',
  { defer: true }
)

const search = ref(null)

const { data: locationData } = await useAPI(props.endpoint, { query: { search } })

const locations = computed(() => locationData.value.data)
const placemarkIds = ref({})

const today = getDayOfWeek()

const days = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
}

let map

function initMap() {
  map = new ymaps.Map('map', {
    center: [locations.value[0].latitude, locations.value[0].longitude],
    zoom: 16,
  })

  map.controls.remove('searchControl')

  let LayoutClass = ymaps.templateLayoutFactory.createClass(`
    <div class="location-balloon {% if properties.is_open %} open {% else %} closed {% endif %}">
      {% if properties.image %}
      <img class="location-balloon-image" src="{{ properties.image }}" alt="">
      {% endif %}

      <div class="location-balloon-content">
        <div class="location-info">
          <div class="location-name">{{ properties.name }}</div>

          {% if properties.metro %}
          <div class="location-metro text-neutral-600">{{ properties.metro }}</div>
          {% endif %}

          <div class="text-neutral-600">
            <span class="location-city">{{ properties.city }}</span>
            <span> · </span>
            <span class="location-address">{{ properties.address }}</span>
          </div>
        </div>

        <div class="location-schedule py-[8px]">
          <span class="location-status"></span>
          <span class="location-status-text">{{ properties.status_text }}</span>
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

  locations.value.forEach((location) => {
    let my_placemark = new ymaps.Placemark(
      [location.latitude, location.longitude],
      location,
      {
        iconLayout: 'default#imageWithContent',
        iconImageHref: '/images/map-marker.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40],
        hideIconOnBalloonOpen: false,
        balloonLayout: LayoutClass,
      }
    )

    my_placemark.events.add('balloonopen', () => selectedLocation.value = location)

    map.geoObjects.add(my_placemark)
    placemarkIds.value[location.id] = map.geoObjects.indexOf(my_placemark)
  })
}

onLoaded(() => ymaps.ready(initMap))

const selectedLocation = ref(null)

const currentTab = ref('list')

const locationsWrapper = useTemplateRef('locations-wrapper')

watch(
  selectedLocation,
  (newLocation) => {
    const index = locations.value.findIndex((location) => location.id === newLocation.id)
    const placemark = map.geoObjects.get(placemarkIds.value[newLocation.id])

    placemark.balloon.open()
    map.setCenter([newLocation.latitude, newLocation.longitude])
    locationsWrapper.value.children[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      container: 'nearest'
    })
  }
)

defineExpose({ currentTab })
</script>

<template>
  <div class="flex gap-[8px] whitespace-nowrap overflow-x-auto scrollbar-none -mx-[16px] px-[16px] mt-[24px] laptop:hidden">
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
    v-show="['list', 'map'].includes(currentTab)"
    class="flex gap-[24px] mt-[16px] laptop:mt-[24px]"
  >
    <div
      :class="{
        'location-block h-[764px]': true,
        'max-laptop:hidden': currentTab !== 'list'
      }"
    >
      <Search
        v-model="search"
        class="bg-white"
        placeholder="Введите название/город/адрес"
        :debounce="500"
      />

      <div
        ref="locations-wrapper"
        class="location-list"
      >
        <div
          v-for="location in locations"
          :key="location.id"
          :class="{
            'location-item': true,
            'open': location.is_open,
            'closed': !location.is_open,
            'selected': selectedLocation?.id === location.id
          }"
          @click="() => {
            selectedLocation = location
            currentTab = 'map'
          }"
        >
          <div class="location-info">
            <div class="location-name">{{ location.name }}</div>
            <div
              v-if="location.metro"
              class="location-metro"
            >
              {{ location.metro }}
            </div>
            <div>
              <span class="location-city">{{ location.city }}</span>
              <span> · </span>
              <span class="location-address">{{ location.address }}</span>
            </div>
          </div>

          <div class="location-schedule">
            <details class="location-schedule-details">
              <summary class="location-schedule-summary" @click.stop>
                <span class="location-status"></span>
                <span class="location-status-text">
                  {{ location.status_text }}
                </span>
              </summary>
              <table
                v-if="Object.keys(location.schedule).length"
                class="location-schedule-table"
              >
                <colgroup>
                  <col class="w-full">
                  <col>
                </colgroup>
                <tbody>
                <tr
                  v-for="(hours, day) in location.schedule"
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
        'grid gap-[16px] bg-neutral-100 rounded-[28px] laptop:rounded-[40px] overflow-hidden max-laptop:p-[12px] flex-1': true,
        'max-laptop:hidden': currentTab !== 'map'
      }"
    >
      <Search
        v-model="search"
        class="bg-white laptop:hidden"
        placeholder="Введите название/город/адрес"
        :debounce="500"
      />

      <div
        class="rounded-[16px] laptop:rounded-[40px] overflow-hidden max-laptop:h-[487px]"
        id="map"
      ></div>
    </div>
  </div>
</template>

<style>
@reference "~/assets/css/main.css";

@layer components {
  .location-block {
    display: grid;
    gap: 16px;
    align-content: start;
    width: 100%;
    background: var(--color-neutral-100);
    border-radius: 28px;
    padding: 12px;

    @variant laptop {
      width: 464px;
    }
  }

  .location-list {
    display: grid;
    gap: 8px;
    align-content: start;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;
  }

  .location-item {
    display: grid;
    gap: 10px;
    background: white;
    border-radius: 16px;
    padding: 12px 16px;
    color: var(--color-neutral-600);
    font-size: 14px;
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
  }

  .location-item:hover {
    background: var(--color-neutral-25);
  }

  .location-item:active {
    background: white;
  }

  .location-item:hover {
    outline-color: var(--color-neutral-300);
  }

  .location-item:active,
  .location-item.selected {
    outline-color: var(--color-info-500);
  }

  .open {
    --status-color: var(--color-success-500);
    --status-content: 'Открыто';
  }

  .closed {
    --status-color: var(--color-error-500);
    --status-content: 'Закрыто';
  }

  .location-info {
    display: grid;
    gap: 4px;
  }

  .location-name {
    color: var(--color-brand-950);
    font-size: 16px;
    font-weight: 600;
  }

  .location-metro {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .location-metro::before {
    content: url(~/assets/icons/metro-moscow.svg);
    line-height: 0;
  }

  .location-status {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-neutral-700);
    font-weight: 500;
  }

  .location-schedule {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: var(--color-neutral-500);
  }

  .location-status::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: var(--status-color);
    border-radius: 50%;
  }

  .location-status::after {
    content: var(--status-content);
  }

  .location-schedule:hover .location-status {
    color: var(--color-neutral-800);
  }

  .location-schedule-summary {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  summary.location-schedule-summary::after {
    content: url(~/assets/icons/arrow-collapse.svg);
    align-self: center;
    line-height: 0;
  }

  [open] > summary.location-schedule-summary::after {
    rotate: 180deg;
  }

  .location-schedule:hover .location-schedule-summary {
    color: var(--color-neutral-700);
  }

  .location-status-text::before {
    content: ' · ';
  }

  [open] .location-status-text,
  .location-status-text:empty {
    display: none;
  }

  .location-schedule-table {
    margin-top: 8px;
    margin-left: 14px;
    white-space: nowrap;
  }

  .location-schedule-table td {
    padding-block: 4px;
  }

  .location-schedule-table td:last-child {
    padding-left: 34px;
    text-align: center;
  }

  .today {
    color: var(--color-neutral-700);
  }

  .location-balloon {
    display: grid;
    width: 256px;
    background: white;
    border-radius: 20px;
    box-shadow: var(--shadow-md);
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    translate: -50% calc(-100% - 48px);
    overflow: hidden;

    @variant laptop {
      width: 320px;
    }
  }

  .location-balloon-content {
    display: grid;
    gap: 8px;
    padding: 16px;
  }

  .location-balloon-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
}
</style>
