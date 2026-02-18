<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { useTransactionStore } from '@/stores/transactions'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppModal from '@/components/ui/AppModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import type { Transaction, CreateTransaction } from '@/types'

const store = useTransactionStore()
const [listRef] = useAutoAnimate()

const showModal = ref(false)
const editingTx = ref<Transaction | null>(null)
const searchQuery = ref('')
const typeFilter = ref('')
const confirmDeleteId = ref<number | null>(null)

onMounted(() => {
  store.fetchTransactions()
  store.fetchCategories()
})

let searchTimeout: NodeJS.Timeout
watch(searchQuery, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.fetchTransactions({ search: val || undefined, page: 1 })
  }, 300)
})

watch(typeFilter, (val) => {
  store.fetchTransactions({
    type: (val as 'income' | 'expense') || undefined,
    page: 1,
  })
})

function openCreate() {
  editingTx.value = null
  showModal.value = true
}

function openEdit(tx: Transaction) {
  editingTx.value = tx
  showModal.value = true
}

async function handleSubmit(data: CreateTransaction) {
  try {
    if (editingTx.value) {
      await store.updateTransaction(editingTx.value.id, data)
    } else {
      await store.createTransaction(data)
    }
    showModal.value = false
    store.fetchTransactions()
  } catch (e) {
    console.error('Failed to save transaction', e)
  }
}

function confirmDelete(id: number) {
  confirmDeleteId.value = id
}

async function handleDelete() {
  if (confirmDeleteId.value) {
    await store.deleteTransaction(confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}

function changePage(page: number) {
  store.fetchTransactions({ page })
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p class="text-sm text-white/30">
          {{ store.totalItems }} transaction{{ store.totalItems !== 1 ? 's' : '' }} found
        </p>
      </div>
      <AppButton @click="openCreate">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Transaction
      </AppButton>
    </div>


    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-[200px]">
        <AppInput
          v-model="searchQuery"
          placeholder="Search transactions..."
          icon="🔍"
        />
      </div>
      <div class="w-40">
        <AppSelect
          v-model="typeFilter"
          :options="[
            { value: '', label: '📊 All Types' },
            { value: 'income', label: '📥 Income' },
            { value: 'expense', label: '📤 Expense' },
          ]"
          placeholder="Filter type"
        />
      </div>
    </div>


    <LoadingSpinner v-if="store.loading" text="Loading transactions..." />

    <EmptyState
      v-else-if="store.transactions.length === 0"
      title="No transactions found"
      message="Start tracking your income and spending by adding your first transaction."
      icon="💸"
    >
      <AppButton @click="openCreate">Add Your First Transaction</AppButton>
    </EmptyState>

    <div v-else ref="listRef" class="space-y-2">
      <TransactionItem
        v-for="tx in store.transactions"
        :key="tx.id"
        :transaction="tx"
        @edit="openEdit"
        @delete="confirmDelete"
      />
    </div>


    <div
      v-if="store.totalPages > 1"
      class="flex items-center justify-center gap-2 pt-4"
    >
      <button
        v-for="page in store.totalPages"
        :key="page"
        :class="[
          'w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200',
          page === store.filters.page
            ? 'gradient-brand text-white shadow-lg shadow-brand-500/25'
            : 'glass text-white/40 hover:text-white hover:bg-white/5',
        ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>


    <AppModal
      :open="showModal"
      :title="editingTx ? 'Edit Transaction' : 'Add Transaction'"
      @close="showModal = false"
    >
      <TransactionForm
        :transaction="editingTx"
        @submit="handleSubmit"
        @cancel="showModal = false"
      />
    </AppModal>


    <AppModal
      :open="!!confirmDeleteId"
      title="Delete Transaction"
      @close="confirmDeleteId = null"
    >
      <p class="text-sm text-white/50">
        Are you sure you want to delete this transaction? This action cannot be undone.
      </p>
      <template #footer>
        <div class="flex gap-3">
          <AppButton variant="ghost" class="flex-1" @click="confirmDeleteId = null">
            Cancel
          </AppButton>
          <AppButton variant="danger" class="flex-1" @click="handleDelete">
            Delete
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>
