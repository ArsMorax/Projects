<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-xs font-medium text-white/50 uppercase tracking-wider">
      {{ label }}
    </label>
    <div class="relative">
      <span v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
        {{ icon }}
      </span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'w-full rounded-xl bg-white/[0.04] border text-sm text-white placeholder:text-white/25 px-4 py-3 outline-none transition-all duration-200',
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
            : 'border-white/[0.06] focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 hover:border-white/10',
          icon ? 'pl-10' : '',
        ]"
        @input="onInput"
      />
    </div>
    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>
