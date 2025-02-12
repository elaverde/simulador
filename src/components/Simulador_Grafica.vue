<template>
  <v-col align="right">
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    class="chart-right text-right"
  />
</v-col>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register( Tooltip,  BarElement, CategoryScale, LinearScale)


export default {
  props: {
    datos: {
      type: Object,
      required: true
    }
  },
  name: 'BarChart',
  components: { Bar },
  watch: {
    datos: {
      handler(newDatos) {
        // Actualizar items cuando cambian los datos
        this.actualizarItems(newDatos);
      },
      deep: true
    }
  },
  methods: {
    actualizarItems(datos) {
      // Realizar cálculos y actualizar items
      // Aquí puedes hacer los cálculos necesarios usando los datos recibidos y actualizar this.items
      // Por ejemplo:
      this.items = datos.simulacion;
      let totalIteres = 0;
      for (var i = 0; i < this.items.length; i++) {
        totalIteres += this.items[i].interes;

      }
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset, index) => {
          if (index === 0) {
            return {
              ...dataset,
              data: dataset.data.map((data, dataIndex) => {
                if (dataIndex === 1) {
                  return totalIteres;
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


      console.log('Items actualizado', totalIteres);
    }
  },
  data() {
    return {
      chartData: {
        labels: ['Deuda', 'Interés'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#FFA500', '#00BFFF'] // Colores para las barras
        }],
      },
      chartOptions: {
        responsive: false,
        indexAxis: 'y', // Add this line to invert the bars
        barThickness: 20, // Adjust the bar thickness as desired
        canvas: {
          height: 200, // Set the height of the canvas
          width: 200 // Set the width of the canvas
        },
      }
    }
  }
}
</script>

