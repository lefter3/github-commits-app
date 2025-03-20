// import api from './api'
import { reactive, toRefs, watch } from 'vue'
import { useApi } from './api'

export const AUTH_KEY = 'app_user'
interface User {
    displayName: string,
    username: string
    token: string
}

interface AuthState {
    user?: User;
    error?: Error;
    isAuthenticating: boolean
}

const state = reactive<AuthState>({
    isAuthenticating: false,
    user: undefined,
    error: undefined,
})

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
if (code) {
    state.isAuthenticating = true
    const { loading, error, data, get } = useApi(`/auth/token?code=${code}`)
    get()

    watch([ loading ], () => {
        if ( error.value ) {
            window.localStorage.removeItem(AUTH_KEY)
        }
        else if ( data.value ) {
            state.user = data.value
            window.localStorage.setItem(AUTH_KEY, data.value.token)
            
        }
        state.isAuthenticating = false
    })
}
else {

    const token = window.localStorage.getItem(AUTH_KEY)
    if ( token ) {
            state.isAuthenticating = true
            const { loading, error, data, get } = useApi('/auth/me', token)
            get()
        
            watch([ loading ], () => {
                if ( error.value ) {
                    window.localStorage.removeItem(AUTH_KEY)
                }
                else if ( data.value ) {
                    state.user = {
                        token,
                        ...data.value
                    }
                }
                state.isAuthenticating = false
            })
        
    }
    
}

export const useAuth = () => {
    const setUser = (payload: User): void => {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
        state.user = payload
        state.error = undefined
    }

    const logout = (): void=> {
        window.localStorage.removeItem(AUTH_KEY)
        state.user = undefined
    }

    return {
        setUser,
        logout,
        ...toRefs(state),
    }

}