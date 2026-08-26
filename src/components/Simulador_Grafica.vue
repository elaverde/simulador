<template>
  <v-container class="px-0 pb-4" v-if="tienedatos">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card variant="flat" border class="pa-3 grafica-card">
          <div class="grafica-titulo">Evolución Interés / Abonos</div>
          <div class="grafica-wrap">
            <Line
              id="saldo-chart"
              :options="lineChartOptions"
              :data="lineChartData"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card variant="flat" border class="pa-3 grafica-card">
          <div class="grafica-titulo">Composición de la Deuda</div>
          <Bar
            id="bar-chart"
            :options="barChartOptions"
            :data="barChartData"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'

export default {
  name: 'SimuladorGrafica',

  components: { Bar, Line },

  props: {
    datos: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      barChartData: {
        labels: ['Deuda', 'Interés con abonos', 'Interés sin abonos'],
        datasets: [
          {
            label: 'Composición de la deuda',
            data: [0, 0, 0],
            backgroundColor: ['#3987e5', '#199e70', '#e66767'],
            borderRadius: 4,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      barChartOptions: {
        responsive: true,
        indexAxis: 'y',
        barThickness: 32,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: { beginAtZero: true },
        },
      },

      lineChartData: {
        labels: [],
        datasets: [
          { data: [], fill: true, tension: 0.4 },
        ],
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.8,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            title: { display: true, text: 'Período' },
            ticks: { maxTicksLimit: 10 },
          },
          y: {
            title: { display: true, text: 'Valor ($)' },
            beginAtZero: true,
          },
        },
      },
    }
  },

  computed: {
    tienedatos() {
      return this.datos?.simulacion?.length > 1
    },
  },

  watch: {
    datos: {
      handler(newDatos) {
        if (!newDatos?.simulacion) return
        this.actualizarBarChart(newDatos)
        this.actualizarLineChart(newDatos.simulacion)
      },
      deep: true,
    },
  },

  mounted() {
    if (this.datos?.simulacion) {
      this.actualizarBarChart(this.datos)
      this.actualizarLineChart(this.datos.simulacion)
    }
  },

  methods: {
    actualizarBarChart(datos) {
      this.barChartData = {
        ...this.barChartData,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: [datos.monto, datos.interesTotal, datos.interesTotalSinAbonos],
          },
        ],
      }
    },

    actualizarLineChart(simulacion) {
      if (!simulacion || simulacion.length === 0) return

      const labels = simulacion.map((item) => item.periodo)
      const interes = simulacion.slice(1).map((item) => item.interes)
      const abonos = simulacion.slice(1).map((item) => item.principal + (parseInt(item.abono) || 0))

      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Interés',
            data: interes,
            borderColor: '#3987e5',
            backgroundColor: 'rgba(57, 135, 229, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.6,
            pointRadius: 2,
          },
          {
            label: 'Abono + Principal',
            data: abonos,
            borderColor: '#d95926',
            backgroundColor: 'rgba(217, 89, 38, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.6,
            pointRadius: 2,
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.grafica-card {
  height: 100%;
}

.grafica-wrap {
  position: relative;
}
</style>
