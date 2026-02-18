<script setup lang="ts">
import type { Transaction } from '@/types'

interface Props {
  transaction: Transaction
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [tx: Transaction]
  delete: [id: number]
}>()

function formatCurrency(amount: number) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="glass-card rounded-xl p-4 hover:bg-white/[0.04] transition-all duration-200 group">
    <div class="flex items-center gap-4">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
        :style="{ background: transaction.category_color + '18' }"
      >
        {{ transaction.category_icon }}
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-white/90 truncate">{{ transaction.description }}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span
            class="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            :style="{ background: transaction.category_color + '18', color: transaction.category_color }"
          >
            {{ transaction.category_name }}
          </span>
          <span class="text-[10px] text-white/25">{{ formatDate(transaction.date) }}</span>
        </div>
      </div>

      <div class="text-right shrink-0">
        <p
          :class="[
            'text-sm font-semibold font-mono',
            transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400',
          ]"
        >
          {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
        </p>
      </div>

      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          class="p-1.5 rounded-lg text-white/30 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
          title="Edit"
          @click="emit('edit', transaction)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete"
          @click="emit('delete', transaction.id)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
