<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { analyticsApi } from '@/services/api'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import type { DashboardStats } from '@/types'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Filler)

const router = useRouter()
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data: res } = await analyticsApi.dashboard()
    if (res.success && res.data) {
      stats.value = res.data
    }
  } catch (e) {
    console.error('Failed to load dashboard', e)
  } finally {
    loading.value = false
  }
})

const barChartData = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] }
  const trend = stats.value.monthlyTrend
  return {
    labels: trend.map(m => {
      const [y, mo] = m.month.split('-')
      return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short' })
    }),
    datasets: [
      {
        label: 'Income',
        data: trend.map(m => m.income),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expense',
        data: trend.map(m => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: 'rgba(255,255,255,0.5)',
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 3,
        useBorderRadius: true,
        padding: 16,
        font: { size: 11, family: 'Inter' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 35, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleFont: { family: 'Inter', weight: '600' as const },
      bodyFont: { family: 'JetBrains Mono' },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11, family: 'Inter' as const } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: 'rgba(255,255,255,0.3)',
        font: { size: 11, family: 'JetBrains Mono' as const },
        callback: (val: any) => '$' + (val / 1000).toFixed(0) + 'k',
      },
    },
  },
}

const doughnutChartData = computed(() => {
  if (!stats.value || stats.value.categoryBreakdown.length === 0) {
    return { labels: [], datasets: [] }
  }
  const bd = stats.value.categoryBreakdown
  return {
    labels: bd.map(c => `${c.icon} ${c.name}`),
    datasets: [{
      data: bd.map(c => c.total),
      backgroundColor: bd.map(c => c.color + 'cc'),
      borderColor: bd.map(c => c.color),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
      labels: {
        color: 'rgba(255,255,255,0.5)',
        boxWidth: 10,
        boxHeight: 10,
        borderRadius: 5,
        useBorderRadius: true,
        padding: 10,
        font: { size: 10, family: 'Inter' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 35, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => ` $${ctx.raw.toLocaleString()}`,
      },
    },
  },
}
</script>

<template>
  <LoadingSpinner v-if="loading" size="lg" text="Loading dashboard..." />

  <div v-else-if="stats" class="space-y-6 animate-fade-in">

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        :value="stats.balance"
        label="Total Balance"
        icon="💎"
        variant="default"
        prefix="$"
      />
      <StatCard
        :value="stats.totalIncome"
        label="Total Income"
        icon="📈"
        variant="success"
        prefix="$"
        :trend="12"
      />
      <StatCard
        :value="stats.totalExpense"
        label="Total Expenses"
        icon="📉"
        variant="danger"
        prefix="$"
        :trend="-5"
      />
      <StatCard
        :value="stats.savingsRate + '%'"
        label="Savings Rate"
        icon="🏦"
        :variant="stats.savingsRate >= 20 ? 'success' : 'warning'"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-white/80">Monthly Overview</h3>
            <p class="text-xs text-white/30">Income vs expenses over time</p>
          </div>
        </div>
        <div class="h-72">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-white/80">Spending by Category</h3>
          <p class="text-xs text-white/30">This month's expense breakdown</p>
        </div>
        <div class="h-72 flex items-center justify-center">
          <Doughnut
            v-if="doughnutChartData.labels.length > 0"
            :data="doughnutChartData"
            :options="doughnutOptions"
          />
          <p v-else class="text-sm text-white/20">No expenses this month</p>
        </div>
      </div>
    </div>


    <div class="glass-card rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-semibold text-white/80">Recent Transactions</h3>
          <p class="text-xs text-white/30">Your latest financial activity</p>
        </div>
        <button
          class="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
          @click="router.push('/transactions')"
        >
          View all →
        </button>
      </div>

      <div class="space-y-2">
        <TransactionItem
          v-for="tx in stats.recentTransactions"
          :key="tx.id"
          :transaction="tx"
          @edit="router.push('/transactions')"
          @delete="() => {}"
        />
      </div>

      <div v-if="stats.recentTransactions.length === 0" class="py-8 text-center">
        <p class="text-sm text-white/20">No transactions yet. Start tracking your finances!</p>
      </div>
    </div>
  </div>
</template>
