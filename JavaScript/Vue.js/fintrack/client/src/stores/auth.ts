import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const savedToken = localStorage.getItem('fintrack_token')
  const savedUser = localStorage.getItem('fintrack_user')
  if (savedToken) token.value = savedToken
  if (savedUser) {
    try { user.value = JSON.parse(savedUser) } catch {}
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.name ?? '')
  const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data: res } = await authApi.login({ email, password })
      if (res.success && res.data) {
        setSession(res.data.user, res.data.token)
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    try {
      const { data: res } = await authApi.register({ name, email, password })
      if (res.success && res.data) {
        setSession(res.data.user, res.data.token)
      }
      return res
    } finally {
      loading.value = false
    }
  }

  function setSession(u: User, t: string) {
    user.value = u
    token.value = t
    localStorage.setItem('fintrack_token', t)
    localStorage.setItem('fintrack_user', JSON.stringify(u))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('fintrack_token')
    localStorage.removeItem('fintrack_user')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userName,
    userInitials,
    login,
    register,
    logout,
  }
})
