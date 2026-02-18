<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-surface active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  }

  const variants: Record<string, string> = {
    primary: 'gradient-brand text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-110',
    secondary: 'glass-strong text-white/90 hover:bg-white/10',
    danger: 'gradient-danger text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:brightness-110',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
    outline: 'border border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20',
  }

  return [
    base,
    sizes[props.size],
    variants[props.variant],
    props.block ? 'w-full' : '',
  ].join(' ')
})
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
        class="opacity-75"
      />
    </svg>
    <slot />
  </button>
</template>
