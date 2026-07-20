<script setup>
import {debounce} from "@/assets/js/funcs.js";

const props = defineProps({
  name: String,
  placeholder: {
    type: String,
    default: 'Поиск',
  },
  debounce: Number,
})

const model = defineModel()

const query = ref('')

const queryDebounce = debounce(() => model.value = query.value)

watch(
  query,
  () => queryDebounce(props.debounce)
)

watch(
  model,
  () => query.value = model.value
)
</script>

<template>
  <label class="search-field">
    <input
      type="text"
      class="search-input"
      :name="name"
      :placeholder="placeholder"
      v-model="query"
    />
    <button
      v-show="query?.length"
      type="button"
      class="-my-[2px] rounded-full hover:bg-neutral-300 active:bg-neutral-400 focus:outline-none"
      @click="query = ''"
    >
      <img src="~/assets/icons/delete.svg" alt="">
    </button>
  </label>
</template>

<style scoped>
@layer components {
  .search-field {
    --placeholder: var(--color-neutral-500);
    display: flex;
    gap: 8px;
    width: 100%;
    align-items: center;
    background: var(--color-neutral-100);
    border-radius: 9999px;
    color: var(--color-neutral-800);
    line-height: 20px;
    padding: 10px 12px;
    flex-shrink: 0;
  }

  .search-field:hover {
    --placeholder: var(--color-neutral-600);
    background: var(--color-neutral-200);
  }

  .search-field:focus-within {
    --placeholder: var(--color-neutral-400);
    background: white;
    outline: 1px solid var(--color-info-500);
    outline-offset: -1px;
  }

  .search-field::before {
    content: url(~/assets/icons/search.svg);
    line-height: 0;
  }

  .search-input {
    width: 0;
    flex: 1;
  }

  .search-input::placeholder {
    color: var(--placeholder);
  }
}
</style>
