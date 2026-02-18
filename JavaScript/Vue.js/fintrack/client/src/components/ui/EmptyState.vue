<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No data',
  message: "There's nothing here yet.",
  icon: '📭',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="text-5xl mb-4 animate-float">{{ icon }}</div>
    <h3 class="text-lg font-semibold text-white/60 mb-1">{{ title }}</h3>
    <p class="text-sm text-white/30 max-w-xs">{{ message }}</p>
    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
