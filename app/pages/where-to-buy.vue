<script setup>
import {useAPI} from "@/composables/useAPI.js";

const { data: whereToBuyData } = await useAPI('/where-to-buy')

const { dealers, online_distributors, warning } = whereToBuyData.value

const title = 'Где купить'

useHead({
  title,
  script: [
    {
      src: 'https://api-maps.yandex.ru/2.1/?apikey=86cb0147-d5b1-4892-ac30-f7ce196228c8&load=package.standard&lang=ru_RU',
      defer: true
    }
  ]
})

function initMap() {
  let my_map = new ymaps.Map('map', {
    center: [55.755819, 37.617644],
    zoom: 16,
    controls: []
  });

  let LayoutClass = ymaps.templateLayoutFactory.createClass(`
    <div class="store-balloon open">
      <div class="store-balloon-content">
        <div class="store-balloon-image">
          <img src="/images/store-1.png" alt="">
          <div class="store-status store-balloon-status"></div>
          <div class="store-balloon-distance">6,8 км</div>
        </div>

        <div class="store-info">
          <div class="store-name">Название</div>
          <div class="text-[#6E6E6E]">
            <span class="store-city">Город</span>
            <span> · </span>
            <span class="store-address">Адрес (улица, номер)</span>
          </div>
        </div>

        <div class="store-balloon-schedule">
          <div>пн-пт 10:00-22:00</div>
          <div>сб-вс 10:00-19:00</div>
        </div>
      </div>

      <div class="flex gap-[4px]">
        <NuxtLink to="tel:+7 916 123 45 67" class="button-rounded gap-[8px] rounded-[8px] border border-#E9F4F6 bg-[#8CB0C8] text-white shadow-sm p-[4px] pr-[16px]">
          <img class="size-[32px] bg-[#F5FAFF] rounded-[5px] p-[5px]" src="/images/phone.svg" alt="">
          <span>+7 916 123 45 67</span>
         </NuxtLink>
        <NuxtLink to="/" class="button-rounded bg-[#E9F4F6] rounded-[10px] p-[10px]">
          <img src="/images/site.svg" alt="">
         </NuxtLink>
      </div>
    </div>
  `)

  let my_placemark = new ymaps.Placemark(my_map.getCenter(), {}, {
    iconLayout: 'default#image',
    iconImageHref: '/images/map-marker.svg',
    iconImageSize: [48, 48],
    balloonLayout: LayoutClass,
  });

  my_map.geoObjects.add(my_placemark);
}

onMounted(() => ymaps.ready(initMap));
</script>

<template>
  <main class="pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <div class="container">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="mb-[64px]"
      />

      <div class="layout">
        <section>
          <h1 class="desktop:mb-[40px]">{{ title }}</h1>

          <div class="flex items-center gap-[12px] bg-[#FFF7ED] border-2 border-[#FED7AA] rounded-[16px] p-[16px]">
            <img class="size-[24px]" src="~/assets/icons/error.png" alt="">
            <span class="text-[14px]">
              {{ warning }}
            </span>
          </div>

          <div class="flex gap-[24px] h-[764px] mt-[24px]">
            <div class="grid gap-[16px] content-start w-[446px] bg-[#F1F5F9] rounded-[28px] p-[12px]">
              <label class="search-field w-full bg-white px-[12px]">
                <input class="search-input" type="text" placeholder="Введите название, город или адрес">
              </label>

              <div class="grid gap-[8px] content-start h-full overflow-y-auto scrollbar-none">
                <div
                  v-for="dealer in dealers"
                  :key="dealer.id"
                  :class="{
                    'store-item': true,
                    'open': dealer.is_open,
                    'closed': !dealer.is_open,
                  }"
                >
                  <div class="store-info">
                    <div class="flex justify-between">
                      <span class="store-name">{{ dealer.name }}</span>
                      <span class="store-distance">{{ dealer.distance_km }} км</span>
                    </div>
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
                    <details class="store-schedule-details">
                      <summary class="store-schedule-open">Откроется в 8:00</summary>
                      <table class="store-schedule-table">
                        <colgroup>
                          <col class="w-full">
                          <col>
                        </colgroup>
                        <tbody>
                          <tr>
                            <td>Понедельник</td>
                            <td>08:00 - 22:00</td>
                          </tr>
                          <tr>
                            <td>Вторник</td>
                            <td>08:00 - 22:00</td>
                          </tr>
                          <tr class="today">
                            <td>Среда</td>
                            <td>08:00 - 22:00</td>
                          </tr>
                          <tr>
                            <td>Четверг</td>
                            <td>08:00 - 22:00</td>
                          </tr>
                          <tr>
                            <td>Пятница</td>
                            <td>08:00 - 22:00</td>
                          </tr>
                          <tr>
                            <td>Суббота</td>
                            <td>Закрыто</td>
                          </tr>
                          <tr>
                            <td>Воскресенье</td>
                            <td>Закрыто</td>
                          </tr>
                        </tbody>
                      </table>
                    </details>
                  </div>
                </div>
<!--                <div class="store-item closed">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div class="store-metro">Название станции</div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Откроется в 8:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="store-item open">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Закроется в 22:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="store-item open">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div class="store-metro">Название станции</div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Закроется в 22:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="store-item closed">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Откроется в 8:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="store-item open">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div class="store-metro">Название станции</div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Закроется в 22:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="store-item open">-->
<!--                  <div class="store-info">-->
<!--                    <div class="flex justify-between">-->
<!--                      <span class="store-name">Название магазина</span>-->
<!--                      <span class="store-distance">Расстояние</span>-->
<!--                    </div>-->
<!--                    <div class="store-metro">Название станции</div>-->
<!--                    <div>-->
<!--                      <span class="store-city">Город</span>-->
<!--                      <span> · </span>-->
<!--                      <span class="store-address">Адрес (улица, номер дома)</span>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="store-schedule">-->
<!--                    <span class="store-status"></span>-->
<!--                    <span> · </span>-->
<!--                    <details class="store-schedule-details">-->
<!--                      <summary class="store-schedule-open">Закроется в 22:00</summary>-->
<!--                      <table class="store-schedule-table">-->
<!--                        <colgroup>-->
<!--                          <col class="w-full">-->
<!--                          <col>-->
<!--                        </colgroup>-->
<!--                        <tbody>-->
<!--                          <tr>-->
<!--                            <td>Понедельник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Вторник</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr class="today">-->
<!--                            <td>Среда</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Четверг</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Пятница</td>-->
<!--                            <td>08:00 - 22:00</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Суббота</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                          <tr>-->
<!--                            <td>Воскресенье</td>-->
<!--                            <td>Закрыто</td>-->
<!--                          </tr>-->
<!--                        </tbody>-->
<!--                      </table>-->
<!--                    </details>-->
<!--                  </div>-->
<!--                </div>-->
              </div>
            </div>

            <div class="flex-1 rounded-[40px] overflow-hidden max-desktop:hidden" id="map"></div>
          </div>
        </section>

        <section class="max-desktop:hidden">
          <h2 class="mb-[40px]">Онлайн-дистрибьюторы</h2>
          <div class="flex flex-wrap max-desktop:flex-col items-center justify-center gap-[24px]">
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
                    <div class="font-medium text-tertiary text-[14px]">
                      {{ distributor.schedule_text }}
                    </div>
                  </div>

                  <div class="flex items-baseline gap-[4px] text-[14px]">
                    <span>{{ distributor.rating.toFixed(1) }}</span>
                    <span class="flex gap-[2px]">
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
                    <span class="text-quaternary">({{ distributor.reviews_count }})</span>
                  </div>
                </div>
              </div>

              <div class="distributor-badges">
                <div
                  v-for="badge in distributor.badges"
                  class="distributor-badge"
                  :style="{ color: badge.color }"
                >
                  {{ badge.text }}
                </div>
              </div>

              <NuxtLink
                :to="distributor.website"
                class="button-rounded w-full mt-[24px]">
                Перейти на сайт
              </NuxtLink>
            </div>
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
<!--            <div class="distributor-item">-->
<!--              <div class="flex gap-[12px]">-->
<!--                <img src="/images/distributor-1.png" alt="" class="distributor-logo">-->

<!--                <div class="grid gap-[4px] flex-1">-->
<!--                  <div class="flex justify-between">-->
<!--                    <div class="font-semibold">-->
<!--                      Сантехника-онлайн-->
<!--                    </div>-->
<!--                    <div class="font-medium text-tertiary text-[14px]">-->
<!--                      пн-вск: 8:00 - 23:00-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="flex items-baseline gap-[4px] text-[14px]">-->
<!--                    <span>4.0</span>-->
<!--                    <span class="flex gap-[2px]">-->
<!--                    <img-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      src="~/assets/icons/star.svg"-->
<!--                      alt=""-->
<!--                      :class="{-->
<!--                        'grayscale': i > 4,-->
<!--                      }"-->
<!--                    >-->
<!--                  </span>-->
<!--                    <span class="text-quaternary">(2896)</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="distributor-tags">-->
<!--                <div class="distributor-badge shipping-badge-1">Доставка от 650₽</div>-->
<!--                <div class="distributor-badge shipping-badge-2">Бесплатная доставка в ПВЗ</div>-->
<!--              </div>-->

<!--              <NuxtLink to="/" class="button-rounded w-full mt-[24px]">Перейти на сайт </NuxtLink>-->
<!--            </div>-->
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style>
.store-item {
  display: grid;
  gap: 14px;
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  color: var(--color-tertiary);
  font-size: 14px;
}

.open {
  --status-color: #22C55E;
  --status-content: 'Открыто';
}

.closed {
  --status-color: #EF4444;
  --status-content: 'Закрыто';
}

.store-info {
  display: grid;
  gap: 4px;
}

.store-name {
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
}

.store-distance {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--color-quaternary);
}

.store-distance::before {
  content: url(~/assets/icons/distance.svg);
  line-height: 0;
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
  color: var(--color-secondary);
}

.store-schedule {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-quaternary);
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
  color: var(--color-secondary);
  font-weight: 600;
}

.store-balloon {
  display: grid;
  gap: 24px;
  width: max-content;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
}

.store-balloon-content {
  display: grid;
  gap: 8px;
}

.store-balloon-image {
  position: relative;
}

.store-balloon-image img {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.store-balloon-status {
  position: absolute;
  top: 8px;
  left: 8px;
  background: white;
  border-radius: 9999px;
  color: var(--color-primary);
  font-weight: 500;
  padding: 2px 12px;
}

.store-balloon-distance {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: white;
  border-radius: 4px;
  color: var(--color-primary);
  font-weight: 600;
  padding: 4px 8px;
}

.store-balloon-schedule {
  display: grid;
  gap: 4px;
  color: #999999;
  font-size: 12px;
  line-height: 16px;
}

.distributor-item {
  max-width: 464px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  padding: 16px;
  flex: 1 30%;
}

.distributor-logo {
  width: 48px;
  height: 48px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
}

.distributor-badges {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.distributor-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  font-size: 14px;
  padding: 6px 12px;
}

.distributor-badge::before {
  line-height: 0;
}

.shipping-badge-1 {
  background: #FFEDD5;
  color: #C2410C;
}

.shipping-badge-1::before {
  content: url(~/assets/icons/shipping-1.svg);
}

.shipping-badge-2 {
  background: #D6F1DA;
  color: #008439;
}

.shipping-badge-2::before {
  content: url(~/assets/icons/shipping-2.svg);
}
</style>
