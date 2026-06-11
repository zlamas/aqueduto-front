<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useAPI} from "@/composables/useAPI.js";

const { data: aboutData } = await useAPI('/about')

const { hero, blocks, testimonials } = aboutData.value

const title = 'О нас'

useHead({ title })
</script>

<template>
  <main class="layout pt-[24px] desktop:pt-[64px] desktop:pb-[100px]">
    <section class="hero-banner image-gradient grid desktop:h-[800px] desktop:rounded-[32px] desktop:p-[32px_160px] desktop:shadow-[0_4px_4px_#00000040]">
      <Breadcrumb
        :items="[ { name: title } ]"
        class="place-self-start"
      />
      <div
        class="absolute place-self-center bg-[#00000033] backdrop-blur-[10px] rounded-[12px] desktop:rounded-[30px] mx-[16px] p-[24px_12px] desktop:p-[32px_64px] text-center desktop:w-[836px]"
        :style="{ '--bg': hero.image }"
      >
        <h1 class="text-[#FCFCFD]">
          {{ hero.title }}
        </h1>
        <p class="text-[#FCFCFD] max-desktop:text-[14px]/[20px]">
          {{ hero.subtitle }}
        </p>
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
            <p class="text-secondary whitespace-pre-line">
              {{ section.content }}
            </p>
          </div>
          <img :src="section.image" alt="">
        </section>

<!--        <section class="image-aside">-->
<!--          <div>-->
<!--            <h2>Истоки бренда</h2>-->
<!--            <p class="text-secondary">-->
<!--              Aqueduto — бренд, вдохновлённый историей акведуков — величественных инженерных сооружений, созданных для транспортировки воды на большие расстояния.-->
<!--              <br><br>-->
<!--              С древних времён акведуки стали символом надёжности, точности и продуманной конструкции.-->
<!--            </p>-->
<!--          </div>-->
<!--          <img src="/images/about-us-1.png" alt="">-->
<!--        </section>-->

<!--        <section class="image-aside desktop:flex-row-reverse">-->
<!--          <div>-->
<!--            <h2>Наследие, которое вдохновляет</h2>-->
<!--            <p class="text-secondary">-->
<!--              Один из самых известных акведуков — Águas Livres в Лиссабоне, построенный в XVIII веке.-->
<!--              <br><br>-->
<!--              Он обеспечил город чистой водой и стал примером того, как технологии могут напрямую влиять на качество жизни.-->
<!--              <br><br>-->
<!--              Его название переводится как «Свободные воды» — символ доступности, пользы и гармонии инженерии.-->
<!--            </p>-->
<!--          </div>-->
<!--          <img src="/images/about-us-2.png" alt="">-->
<!--        </section>-->

<!--        <section class="image-aside">-->
<!--          <div>-->
<!--            <h2>Принципы, которые мы сохраняем</h2>-->
<!--            <p class="text-secondary">-->
<!--              Мы развиваем идеи, заложенные в инженерии прошлого, и адаптируем их под современные задачи.-->
<!--              <br><br>-->
<!--              В основе наших решений — надёжность, функциональность и визуальная точность.-->
<!--            </p>-->
<!--          </div>-->
<!--          <img src="/images/about-us-3.png" alt="">-->
<!--        </section>-->

        <section>
          <h2 class="text-center">Отзывы наших клиентов</h2>
          <div class="grid items-center desktop:grid-cols-3 gap-[12px] desktop:gap-[24px]">
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary"
            >
              <div class="whitespace-pre-line">
                {{ testimonial.review_text }}
              </div>
              <div class="flex items-center gap-[12px]">
                <img class="size-[48px] rounded-full" :src="testimonial.avatar" alt="">
                <div>
                  <div class="text-primary font-bold mb-[4px]">
                    {{ testimonial.user_name }}
                  </div>
                  <span class="flex gap-[2px]">
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

<!--            <div class="grid gap-[12px] desktop:gap-[24px]">-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary">-->
<!--                <div>-->
<!--                  Унитаз подошел по размерам. Очень нравится внешний вид и внутренняя форма чаши. Дополнительным плюсом стал смыв Торнадо! Покупкой довольна!-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-1.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Анастасия</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary">-->
<!--                <div>-->
<!--                  Для меня было очень важно, чтобы унитаз, который покупаю был тихим при смыве.-->
<!--                  <br><br>-->
<!--                  Потому что ставил в съемную квартиру, а там соседка снизу постоянно на шум жаловалась. Даже крышкой я хлопал сильно.-->
<!--                  <br><br>-->
<!--                  Поэтому, когда купил унитаз от Акведуто, то счастью не было предела. Он смывает максимально тихо и крышка не хлопает, так как у нее специальная система для плавного возвращения на место. Пользуюсь 5 месяцев, покупкой доволен.-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-2.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Дзюбатыч</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary">-->
<!--                <div>-->
<!--                  Пришел в срок, упаковка хорошая, комплектация полная, все на месте, к товару нет претензий 👍-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-3.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Дмитрий Б.</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="grid gap-[12px] desktop:gap-[24px] max-desktop:mask-b-from-0 -mx-[16px] px-[16px]">-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary ">-->
<!--                <div>-->
<!--                  Отличные унитазы, тактильно приятные. Продавец аналогично шикарный, оперативно решил возникшую проблему. Спасибо, рекомендую!-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-4.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Александр Н.</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary max-desktop:hidden">-->
<!--                <div>-->
<!--                  Унитаз стал отличным дополнением в ванной комнате. Форма, поверхность, весь внешний вид отличные! Плюс качественное смывное устройство.-->
<!--                  <br><br>-->
<!--                  Сиденье заслуживает отдельного упоминания - с микролифтом, быстросъемное, тонкое. Очень довольны!-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-5.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Наташа</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary max-desktop:hidden">-->
<!--                <div>-->
<!--                  Отличный унитаз, компактный, смыв работает отлично, не выплескивается ничего. Крышка тонкая, качественная, ничего не люфтит.-->
<!--                  <br><br>-->
<!--                  Очень понравилась форма зауженная внизу, благодаря чему рядом встанет лоток и коту будет больше места. Как доделаем ремонт дополню видео!!-->
<!--                  <br><br>-->
<!--                  Пришел в срок, целый, в общем, очень довольна. Увидели его в шоуруме, и больше другие уже не стали и смотреть.-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-6.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Светлана Н.</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="grid gap-[12px] desktop:gap-[24px]">-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary max-desktop:hidden">-->
<!--                <div>-->
<!--                  Двойной смыв работает как положено. По внешнему виду унитаз отлично вписался! Покупкой довольны!-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-7.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Семен</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary max-desktop:hidden">-->
<!--                <div>-->
<!--                  Выбирала унитаз для заказчиков в новостройку. Ванная небольшая, поэтому искала что-то компактное.-->
<!--                  <br><br>-->
<!--                  Из большого списка отобранных моделей унитаз Aqueduto OVOT0110 подошел больше всего. Хорошо встал в ванную комнату, небольшой, не оттягивает внимание на себя.-->
<!--                  <br><br>-->
<!--                  По отзывам хозяев квартиры, в эксплуатации нареканий нет.-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-8.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Варюшка Н.</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid gap-[48px] p-[32px] rounded-[12px] desktop:rounded-[20px] shadow-md text-tertiary max-desktop:hidden">-->
<!--                <div>-->
<!--                  Унитазом довольна. Муж установил сам, все работает прекрасно. Вся семья довольна. Особенно нравится смыв водоворот - мощный!-->
<!--                </div>-->
<!--                <div class="flex items-center gap-[12px]">-->
<!--                  <img class="size-[48px]" src="/images/avatar-9.png" alt="">-->
<!--                  <div>-->
<!--                    <div class="text-primary font-bold mb-[4px]">Ольга</div>-->
<!--                    <img class="h-[12px]" src="/images/rating.png" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
