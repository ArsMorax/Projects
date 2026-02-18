<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useTransactionStore } from '@/stores/transactions'
import type { CreateTransaction, Transaction } from '@/types'

interface Props {
  transaction?: Transaction | null
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
})

const emit = defineEmits<{
  submit: [data: CreateTransaction]
  cancel: []
}>()

const store = useTransactionStore()

const form = ref<CreateTransaction>({
  type: 'expense',
  amount: 0,
  description: '',
  category_id: 0,
  date: new Date().toISOString().split('T')[0],
})

const loading = ref(false)

watch(() => props.transaction, (tx) => {
  if (tx) {
    form.value = {
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      category_id: tx.category_id,
      date: tx.date,
    }
  }
}, { immediate: true })

onMounted(() => {
  if (store.categories.length === 0) {
    store.fetchCategories()
  }
})

const categoryOptions = computed(() => {
  const cats = form.value.type === 'income' ? store.incomeCategories : store.expenseCategories
  return cats.map(c => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))
})

const isValid = computed(() =>
  form.value.amount > 0 &&
  form.value.description.trim() !== '' &&
  form.value.category_id > 0 &&
  form.value.date !== ''
)

async function handleSubmit() {
  if (!isValid.value) return
  loading.value = true
  try {
    emit('submit', { ...form.value })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="flex gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <button
        v-for="t in (['expense', 'income'] as const)"
        :key="t"
        type="button"
        :class="[
          'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          form.type === t
            ? t === 'expense'
              ? 'bg-red-500/15 text-red-400 shadow-lg shadow-red-500/10'
              : 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
            : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]',
        ]"
        @click="form.type = t; form.category_id = 0"
      >
        {{ t === 'expense' ? '📤 Expense' : '📥 Income' }}
      </button>
    </div>

    <AppInput
      v-model="form.amount"
      type="number"
      label="Amount"
      placeholder="0.00"
      icon="$"
    />

    <AppInput
      v-model="form.description"
      label="Description"
      placeholder="What was this for?"
      icon="✏️"
    />

    <AppSelect
      v-model="form.category_id"
      label="Category"
      :options="categoryOptions"
      placeholder="Select category"
    />

    <AppInput
      v-model="form.date"
      type="date"
      label="Date"
    />

    <div class="flex gap-3 pt-2">
      <AppButton
        type="button"
        variant="ghost"
        class="flex-1"
        @click="emit('cancel')"
      >
        Cancel
      </AppButton>
      <AppButton
        type="submit"
        :variant="form.type === 'income' ? 'primary' : 'primary'"
        :loading="loading"
        :disabled="!isValid"
        class="flex-1"
      >
        {{ transaction ? 'Update' : 'Add' }} Transaction
      </AppButton>
    </div>
  </form>
</template>
