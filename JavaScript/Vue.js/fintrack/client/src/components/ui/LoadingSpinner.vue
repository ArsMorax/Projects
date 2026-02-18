<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Loading...',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 gap-4">
    <div class="relative">
      <div
        :class="[
          'rounded-full border-2 border-brand-500/20 animate-spin',
          { 'w-6 h-6 border-t-brand-400': size === 'sm' },
          { 'w-10 h-10 border-t-brand-400': size === 'md' },
          { 'w-14 h-14 border-t-brand-400': size === 'lg' },
        ]"
      />
      <div
        :class="[
          'absolute inset-0 rounded-full border-2 border-transparent animate-spin',
          { 'border-r-purple-400/50': true },
        ]"
        style="animation-direction: reverse; animation-duration: 1.5s;"
      />
    </div>
    <p class="text-sm text-white/30 font-medium">{{ text }}</p>
  </div>
</template>
