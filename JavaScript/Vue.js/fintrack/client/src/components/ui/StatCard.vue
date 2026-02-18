<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number | string
  label: string
  icon?: string
  trend?: number
  trendLabel?: string
  variant?: 'default' | 'success' | 'danger' | 'warning'
  prefix?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  prefix: '',
  loading: false,
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.prefix + props.value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  return props.prefix + props.value
})

const glowClass = computed(() => {
  const map: Record<string, string> = {
    default: 'glow-brand',
    success: 'glow-success',
    danger: 'glow-danger',
    warning: '',
  }
  return map[props.variant]
})

const iconBgClass = computed(() => {
  const map: Record<string, string> = {
    default: 'from-brand-500/20 to-brand-600/10',
    success: 'from-emerald-500/20 to-emerald-600/10',
    danger: 'from-red-500/20 to-red-600/10',
    warning: 'from-amber-500/20 to-amber-600/10',
  }
  return map[props.variant]
})
</script>

<template>
  <div
    :class="[
      'glass-card rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 group cursor-default',
      glowClass,
    ]"
  >
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-xl bg-white/5" />
        <div class="w-16 h-4 rounded bg-white/5" />
      </div>
      <div class="w-24 h-8 rounded bg-white/5" />
      <div class="w-32 h-3 rounded bg-white/5" />
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <div
          v-if="icon"
          :class="[
            'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg',
            iconBgClass,
          ]"
        >
          {{ icon }}
        </div>
        <div
          v-if="trend !== undefined"
          :class="[
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
          ]"
        >
          <svg class="w-3 h-3" :class="trend >= 0 ? '' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {{ Math.abs(trend) }}%
        </div>
      </div>

      <p class="text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-gradient transition-all">
        {{ formattedValue }}
      </p>

      <p class="text-xs text-white/40 font-medium uppercase tracking-wider">
        {{ label }}
      </p>
    </div>
  </div>
</template>
