<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  label?: string
  options: Option[]
  error?: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  placeholder: 'Select...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-xs font-medium text-white/50 uppercase tracking-wider">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :class="[
        'w-full rounded-xl bg-white/[0.04] border text-sm text-white px-4 py-3 outline-none transition-all duration-200 appearance-none cursor-pointer',
        error
          ? 'border-red-500/50 focus:border-red-500'
          : 'border-white/[0.06] focus:border-brand-500/50 hover:border-white/10',
      ]"
      @change="emit('update:modelValue', typeof modelValue === 'number' ? Number(($event.target as HTMLSelectElement).value) : ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled class="bg-surface-50 text-white/50">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        class="bg-surface-50 text-white"
      >
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>
