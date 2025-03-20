import axios, { type AxiosRequestConfig }  from 'axios'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './auth'


export const useApiWithAuth = (endpoint: string) => {
  const { user } = useAuth()
  return useApi(endpoint, user?.value ? user.value.token : undefined)
}

export const useApi = (endpoint: string, access_token?: string) => {
  const router = useRouter()
  const api = axios.create({
    baseURL: '/',
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : undefined,
    }
  })

  const data = ref()
  const loading = ref(false)
  const error = ref()

  const get = (query?: Record<string, any>, config?: AxiosRequestConfig) => {
    loading.value = true
    error.value = undefined

    let queryString = ''

    if ( query ) {
      queryString = '?' + Object.entries(query)
        .map(([ key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    }
    return api.get(endpoint + queryString, config)
      .then(res => data.value = res.data)
      .catch(e => {
        error.value = e

        throw e
      })
      .finally(() => loading.value = false)
  }

  const errorMessage = computed(() => {
    console.log('?? compute', error.value);
    if (error.value) {
      return error.value.message
    }
    return null
  })

  const errorDetails = computed(() => {
    if ( error.value && error.value.response ) {
      return error.value.response.data.message
    }
    return null

  })

  const errorFields = computed(() => {
    if (error.value && Array.isArray(error.value.response.data.message)) {

      return (error.value.response.data.message as string[]).reduce((acc: Record<string, any>, msg: string) => {
        let [ field ] = msg.split(' ')

        // TODO: Maximal...
        if (field == 'maximal') field = 'dateOfBirth'

        if (!acc[field]) {
          acc[field] = []
        }

        acc[field].push(msg)

        return acc
      }, {})
    }
    return null
  })

  watch([ error ], () => {
    if ( error.value?.response?.status === 401 || error.value.statusCode === 401) {
      router.push('/login')
    }
  })

  return {
    loading,
    data,
    error,
    get,
    errorMessage,
    errorDetails,
    errorFields,
  }
}

// export default api
