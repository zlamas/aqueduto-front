export const useAPI = createUseFetch((defaultOptions) => {
  const sessionId = useCookie('sessionId')

  return {
    ...defaultOptions,
    baseURL: 'https://new.aqueduto.ru/api/v1',

    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      options.headers.set('X-Guest-Session', sessionId.value)
    },

    onResponse({ response }) {
      sessionId.value ||= response.headers.get('X-Guest-Session')
    }
  }
})
