<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { analyticsApi } from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

const loading = ref(true)
const monthlyData = ref<any[]>([])
const categoryData = ref<any[]>([])

onMounted(async () => {
  try {
    const [monthly, category] = await Promise.all([
      analyticsApi.monthlySummary(),
      analyticsApi.categoryTrends(),
    ])
    if (monthly.data.success) monthlyData.value = monthly.data.data ?? []
    if (category.data.success) categoryData.value = category.data.data ?? []
  } catch (e) {
    console.error('Failed to load analytics', e)
  } finally {
    loading.value = false
  }
})

const savingsChartData = computed(() => {
  const md = monthlyData.value
  return {
    labels: md.map((m: any) => {
      const [y, mo] = m.month.split('-')
      return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }),
    datasets: [
      {
        label: 'Net Savings',
        data: md.map((m: any) => m.income - m.expense),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#0f0f23',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Income',
        data: md.map((m: any) => m.income),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Expense',
        data: md.map((m: any) => m.expense),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  }
})

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255,255,255,0.5)',
        boxWidth: 12,
        boxHeight: 2,
        padding: 20,
        font: { size: 11, family: 'Inter' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 35, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 14,
      cornerRadius: 10,
      titleFont: { family: 'Inter', weight: '600' as const },
      bodyFont: { family: 'JetBrains Mono', size: 12 },
      callbacks: {
        label: (ctx: any) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: 'rgba(255,255,255,0.3)',
        font: { size: 11, family: 'JetBrains Mono' as const },
        callback: (val: any) => '$' + (val / 1000).toFixed(1) + 'k',
      },
    },
  },
}

const expenseCategories = computed(() => categoryData.value.filter((c: any) => c.type === 'expense'))
const incomeCategories = computed(() => categoryData.value.filter((c: any) => c.type === 'income'))

const expenseCatChartData = computed(() => ({
  labels: expenseCategories.value.map((c: any) => `${c.icon} ${c.name}`),
  datasets: [{
    data: expenseCategories.value.map((c: any) => c.total),
    backgroundColor: expenseCategories.value.map((c: any) => c.color + 'aa'),
    borderColor: expenseCategories.value.map((c: any) => c.color),
    borderWidth: 1,
    borderRadius: 8,
    borderSkipped: false,
  }],
}))

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
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
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: 'rgba(255,255,255,0.3)',
        font: { size: 10, family: 'JetBrains Mono' as const },
        callback: (val: any) => '$' + val.toLocaleString(),
      },
    },
    y: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
    },
  },
}

const incomeDoughnutData = computed(() => ({
  labels: incomeCategories.value.map((c: any) => `${c.icon} ${c.name}`),
  datasets: [{
    data: incomeCategories.value.map((c: any) => c.total),
    backgroundColor: incomeCategories.value.map((c: any) => c.color + 'cc'),
    borderColor: incomeCategories.value.map((c: any) => c.color),
    borderWidth: 2,
    hoverOffset: 8,
  }],
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgba(255,255,255,0.5)',
        boxWidth: 10,
        boxHeight: 10,
        borderRadius: 5,
        useBorderRadius: true,
        padding: 12,
        font: { size: 11, family: 'Inter' },
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

const totalExpenseAllTime = computed(() =>
  expenseCategories.value.reduce((sum: number, c: any) => sum + c.total, 0)
)
const totalIncomeAllTime = computed(() =>
  incomeCategories.value.reduce((sum: number, c: any) => sum + c.total, 0)
)
const topCategory = computed(() =>
  expenseCategories.value.length > 0 ? expenseCategories.value[0] : null
)
</script>

<template>
  <LoadingSpinner v-if="loading" size="lg" text="Crunching your numbers..." />

  <div v-else class="space-y-6 animate-fade-in">

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="glass-card rounded-2xl p-5">
        <p class="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Total Analyzed</p>
        <p class="text-xl font-bold text-white font-mono">
          ${{ (totalIncomeAllTime + totalExpenseAllTime).toLocaleString() }}
        </p>
        <p class="text-xs text-white/25 mt-1">across all transactions</p>
      </div>
      <div class="glass-card rounded-2xl p-5">
        <p class="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Biggest Category</p>
        <p v-if="topCategory" class="text-xl font-bold text-white">
          {{ topCategory.icon }} {{ topCategory.name }}
        </p>
        <p v-if="topCategory" class="text-xs text-white/25 mt-1 font-mono">
          ${{ topCategory.total.toLocaleString() }} spent
        </p>
        <p v-else class="text-sm text-white/30">No data</p>
      </div>
      <div class="glass-card rounded-2xl p-5">
        <p class="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Monthly Average</p>
        <p class="text-xl font-bold text-white font-mono">
          ${{ monthlyData.length > 0
            ? Math.round(monthlyData.reduce((s: number, m: any) => s + m.expense, 0) / monthlyData.length).toLocaleString()
            : '0' }}
        </p>
        <p class="text-xs text-white/25 mt-1">monthly expenses</p>
      </div>
    </div>


    <div class="glass-card rounded-2xl p-6">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-white/80">Savings Trend</h3>
        <p class="text-xs text-white/30">Your net savings, income, and expenses over the last 12 months</p>
      </div>
      <div class="h-80">
        <Line :data="savingsChartData" :options="lineChartOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card rounded-2xl p-6">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-white/80">Expense Breakdown</h3>
          <p class="text-xs text-white/30">Where your money goes</p>
        </div>
        <div class="h-80">
          <Bar
            v-if="expenseCategories.length > 0"
            :data="expenseCatChartData"
            :options="horizontalBarOptions"
          />
          <div v-else class="flex items-center justify-center h-full">
            <p class="text-sm text-white/20">No expense data yet</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-white/80">Income Sources</h3>
          <p class="text-xs text-white/30">Where your money comes from</p>
        </div>
        <div class="h-80 flex items-center justify-center">
          <Doughnut
            v-if="incomeCategories.length > 0"
            :data="incomeDoughnutData"
            :options="doughnutOptions"
          />
          <p v-else class="text-sm text-white/20">No income data yet</p>
        </div>
      </div>
    </div>


    <div class="glass-card rounded-2xl p-6">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-white/80">All Categories</h3>
        <p class="text-xs text-white/30">Detailed breakdown of all your spending categories</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/[0.06]">
              <th class="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
              <th class="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Type</th>
              <th class="text-right py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Total</th>
              <th class="text-right py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Count</th>
              <th class="text-right py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Average</th>
              <th class="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider w-32">Share</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(cat, idx) in categoryData"
              :key="idx"
              class="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ cat.icon }}</span>
                  <span class="text-white/80 font-medium">{{ cat.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                    cat.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400',
                  ]"
                >
                  {{ cat.type }}
                </span>
              </td>
              <td class="py-3 px-4 text-right font-mono text-white/70">${{ Number(cat.total).toLocaleString() }}</td>
              <td class="py-3 px-4 text-right text-white/50">{{ cat.count }}</td>
              <td class="py-3 px-4 text-right font-mono text-white/50">${{ Number(cat.average).toFixed(2) }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :style="{
                        width: ((cat.total / (cat.type === 'expense' ? totalExpenseAllTime : totalIncomeAllTime)) * 100).toFixed(1) + '%',
                        backgroundColor: cat.color,
                      }"
                    />
                  </div>
                  <span class="text-[10px] text-white/30 font-mono w-8 text-right">
                    {{ ((cat.total / (cat.type === 'expense' ? totalExpenseAllTime : totalIncomeAllTime)) * 100).toFixed(0) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
