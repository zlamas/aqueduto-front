export const useAPI = createUseFetch((callerOptions) => {
  const sessionId = useCookie('sessionId')

  return {
    ...callerOptions,
    baseURL: 'https://new.aqueduto.ru/api/v1',

    async onRequest(context) {
      context.options.headers.set('Accept', 'application/json')
      context.options.headers.set('X-Guest-Session', sessionId.value)

      if (callerOptions.onRequest) {
        await callerOptions.onRequest(context)
      }
    },

    async onResponse(context) {
      sessionId.value ||= context.response.headers.get('X-Guest-Session')

      if (callerOptions.onResponse) {
        await callerOptions.onResponse(context)
      }
    }
  }
})
