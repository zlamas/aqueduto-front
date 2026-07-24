export default defineNuxtPlugin(() => {
  const sessionId = useCookie('sessionId')

  const api = $fetch.create({
    baseURL: 'https://new.aqueduto.ru/api/v1',

    async onRequest(context) {
      context.options.headers.set('Accept', 'application/json')
      context.options.headers.set('X-Guest-Session', sessionId.value)

      if (context.options.onRequestOverride) {
        await context.options.onRequestOverride(context)
      }
    },

    async onResponse(context) {
      sessionId.value ||= context.response.headers.get('X-Guest-Session')

      if (context.options.onResponseOverride) {
        await context.options.onResponseOverride(context)
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
