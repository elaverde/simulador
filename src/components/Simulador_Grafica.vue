<template>
  <v-container>
    <!-- Nuevo Gráfico de Líneas -->
    <v-row>
      <v-col align="right">
        <Line
          id="saldo-chart"
          :options="lineChartOptions"
          :data="lineChartData"
          class="chart-right text-right"
        />
      </v-col>
      <!-- Gráfico de Barras -->
      <v-col align="right">
        <Bar
          id="my-chart-id"
          :options="barChartOptions"
          :data="barChartData"
          class="chart-right text-right"
        />
      </v-col>
    </v-row>

    <v-row> </v-row>
  </v-container>
</template>

<script>
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  props: {
    datos: {
      type: Object,
      required: true,
    },
  },
  name: "CombinedChart",
  components: { Bar, Line },
  watch: {
    datos: {
      handler(newDatos) {
        // Actualizar ambos gráficos cuando cambian los datos
        this.actualizarBarChart(newDatos);
        this.actualizarLineChart(newDatos.simulacion);
      },
      deep: true,
    },
  },
  methods: {
    // Método para actualizar el gráfico de barras
    actualizarBarChart(datos) {
      this.barChartData = {
        ...this.barChartData,
        datasets: this.barChartData.datasets.map((dataset, index) => {
          if (index === 0) {
            return {
              ...dataset,
              label: "Información de la deuda",
              fill: true, // Rellenar el área bajo la línea
              tension: 0.4, // Suavizar la línea// Color de la línea
              data: dataset.data.map((data, dataIndex) => {
                if (dataIndex === 2) {
                  return datos.interesTotalSinAbonos;
                }
                if (dataIndex === 1) {
                  return datos.interesTotal;
                }
                if (dataIndex === 0) {
                  return datos.monto;
                }
                return data;
              }),
            };
          }
          return dataset;
        }),
      };
    },

    // Método para actualizar el gráfico de líneas
    actualizarLineChart(simulacion) {
      if (!simulacion || simulacion.length === 0) {
        return;
      }
      const labels = simulacion.map((item) => `Período ${item.periodo}`);
      const saldos = simulacion.map((item) => item.saldo);

      this.lineChartData = {
        labels: labels,
        datasets: [
          {
            label: "Saldo",
            data: saldos,
            borderColor: "#00BFFF", // Color de la línea
            backgroundColor: "rgba(0, 191, 255, 0.2)", // Color de relleno
            fill: true, // Rellenar el área bajo la línea
            tension: 0.4, // Suavizar la línea
          },
        ],
      };
    },
  },
  data() {
    return {
      // Datos y opciones para el gráfico de barras
      barChartData: {
        labels: ["Deuda", "Interés", "Interés con abonos"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ["#00BFFF", "#FFA500", "red"], // Colores para las barras
          },
        ],
      },
      barChartOptions: {
        responsive: true,
        indexAxis: "y", // Barras horizontales
        barThickness: 40,
      },

      // Datos y opciones para el gráfico de líneas
      lineChartData: {
        labels: [], // Etiquetas de los períodos
        datasets: [
          {
            data: [], // Datos del saldo
            fill: true,
            tension: 0.4,
          },
        ],
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Períodos",
            },
          },
          y: {
            title: {
              display: true,
              text: "Saldo ($)",
            },
            beginAtZero: true, // Empezar el eje Y desde 0
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    };
  },
  mounted() {
    // Inicializar ambos gráficos con los datos iniciales
    this.actualizarBarChart(this.datos);
    this.actualizarLineChart(this.datos.simulacion);
  },
};
</script>
