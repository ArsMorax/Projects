<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  open: boolean
  title?: string
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  maxWidth: 'max-w-lg',
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
const animating = ref(false)

watch(() => props.open, (val) => {
  if (val) {
    visible.value = true
    requestAnimationFrame(() => { animating.value = true })
  } else {
    animating.value = false
    setTimeout(() => { visible.value = false }, 200)
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        :class="animating ? 'opacity-100' : 'opacity-0'"
        @click="emit('close')"
      />

      <div
        :class="[
          'relative w-full glass-strong rounded-2xl shadow-2xl shadow-black/40 transition-all duration-200',
          maxWidth,
          animating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4',
        ]"
      >
        <div v-if="title || $slots.header" class="flex items-center justify-between px-6 pt-6 pb-2">
          <slot name="header">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
          </slot>
          <button
            class="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 pb-6 pt-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
