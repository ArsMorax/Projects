<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { transactionApi } from '@/services/api'
import type { Transaction } from '@/types'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'grid' },
  { name: 'Transactions', path: '/transactions', icon: 'list' },
  { name: 'Analytics', path: '/analytics', icon: 'chart' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function logout() {
  auth.logout()
  router.push('/login')
}

const searchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<Transaction[]>([])
const searchLoading = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
let searchTimeout: ReturnType<typeof setTimeout>

function openSearch() {
  searchOpen.value = true
  searchQuery.value = ''
  searchResults.value = []
  nextTick(() => searchInputRef.value?.focus())
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
}

function handleSearchInput() {
  clearTimeout(searchTimeout)
  const q = searchQuery.value.trim()
  if (!q) {
    searchResults.value = []
    return
  }
  searchLoading.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const { data: res } = await transactionApi.list({ search: q, limit: 8 })
      searchResults.value = res.data
    } catch {
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 250)
}

function goToTransaction(tx: Transaction) {
  closeSearch()
  router.push('/transactions')
}

function goToTransactionsSearch() {
  const q = searchQuery.value.trim()
  closeSearch()
  router.push('/transactions')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (searchOpen.value) closeSearch()
    else openSearch()
  }
  if (e.key === 'Escape' && searchOpen.value) {
    closeSearch()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 glass-strong transform transition-transform duration-300 lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
          <div class="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
            <span class="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight">FinTrack</h1>
            <p class="text-[10px] text-white/30 font-medium uppercase tracking-wider">Finance Dashboard</p>
          </div>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(item.path)
                ? 'bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/5'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]',
            ]"
            @click="sidebarOpen = false"
          >
            <svg v-if="item.icon === 'grid'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <svg v-else-if="item.icon === 'list'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <svg v-else-if="item.icon === 'chart'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {{ item.name }}
          </RouterLink>
        </nav>

        <div class="px-3 py-4 border-t border-white/[0.06]">
          <div class="flex items-center gap-3 px-4 py-2">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {{ auth.userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white/80 truncate">{{ auth.userName }}</p>
              <p class="text-[10px] text-white/30 truncate">{{ auth.user?.email }}</p>
            </div>
            <button
              class="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
              @click="logout"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />

    <main class="flex-1 overflow-y-auto">
      <header class="sticky top-0 z-20 glass border-b border-white/[0.04] px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              class="lg:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
              @click="sidebarOpen = true"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 class="text-lg font-semibold text-white">
                {{ route.name === 'dashboard' ? 'Dashboard' : route.name === 'transactions' ? 'Transactions' : 'Analytics' }}
              </h2>
              <p class="text-xs text-white/30">
                {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
              @click="openSearch"
            >
              <svg class="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="text-xs text-white/25">Search...</span>
              <kbd class="text-[10px] text-white/20 border border-white/10 rounded px-1">Ctrl+K</kbd>
            </button>
          </div>
        </div>
      </header>

      <div class="p-6">
        <RouterView v-slot="{ Component, route: r }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="r.path" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="searchOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeSearch" />
          <div class="relative w-full max-w-lg mx-4 rounded-2xl bg-surface-50/95 border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden">
            <div class="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <svg class="w-5 h-5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                class="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                placeholder="Search transactions..."
                @input="handleSearchInput"
                @keydown.enter="goToTransactionsSearch"
              />
              <kbd class="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div class="max-h-80 overflow-y-auto">
              <div v-if="searchLoading" class="flex items-center justify-center py-8">
                <div class="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>

              <div v-else-if="searchQuery.trim() && searchResults.length === 0" class="py-8 text-center">
                <p class="text-sm text-white/30">No transactions found</p>
              </div>

              <div v-else-if="searchResults.length > 0">
                <div class="px-3 py-2">
                  <p class="text-[10px] text-white/20 uppercase tracking-wider font-medium px-2">Transactions</p>
                </div>
                <button
                  v-for="tx in searchResults"
                  :key="tx.id"
                  class="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                  @click="goToTransaction(tx)"
                >
                  <span class="text-lg">{{ (tx as any).category_icon || '📁' }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-white/80 truncate">{{ tx.description }}</p>
                    <p class="text-[11px] text-white/25">{{ tx.date }}</p>
                  </div>
                  <span :class="tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'" class="text-sm font-medium">
                    {{ tx.type === 'income' ? '+' : '-' }}${{ tx.amount.toFixed(2) }}
                  </span>
                </button>
                <button
                  class="w-full px-5 py-3 text-xs text-brand-400 hover:bg-white/[0.04] transition-colors border-t border-white/[0.04] text-center"
                  @click="goToTransactionsSearch"
                >
                  View all results →
                </button>
              </div>

              <div v-else class="py-8 text-center">
                <p class="text-sm text-white/20">Type to search transactions...</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
