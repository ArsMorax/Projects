<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    const res = await auth.login(email.value, password.value)
    if (res.success) {
      router.push('/')
    } else {
      error.value = res.message || 'Login failed'
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Something went wrong'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] animate-float" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/8 blur-[120px] animate-float" style="animation-delay: -3s" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/5 blur-[150px]" />
    </div>

    <div class="w-full max-w-md relative animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand shadow-xl shadow-brand-500/30 mb-4">
          <span class="text-2xl font-bold text-white">F</span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p class="text-sm text-white/40">Sign in to your FinTrack account</p>
      </div>

      <div class="glass-strong rounded-2xl p-8 glow-brand">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div
            v-if="error"
            class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>

          <AppInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            icon="✉️"
          />

          <AppInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon="🔒"
          />

          <AppButton
            type="submit"
            block
            size="lg"
            :loading="auth.loading"
          >
            Sign In
          </AppButton>
        </form>

        <p class="text-center text-sm text-white/30 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one
          </RouterLink>
        </p>
      </div>

      <div class="mt-6 text-center">
        <p class="text-xs text-white/20">
          Create a new account to get started with demo data
        </p>
      </div>
    </div>
  </div>
</template>
