<template>
     <v-card>
      <v-card-title>Calculos Préstamo</v-card-title>

      <v-card-text>


    <v-table theme="dark">
      <thead>
        <tr>
            <th class="text-left">
                Período
            </th>
            <th class="text-left">
                Renta
            </th>
            <th class="text-left">
                Principal
            </th>
            <th class="text-left">
                Interés
            </th>
            <th class="text-left">
                Abono a Capital
            </th>
            <th class="text-left">
                Saldo
            </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.periodo">
            <td>{{ item.periodo }}</td>
            <td>{{ formatCurrency(item.cuota) }}</td>
            <td>{{ formatCurrency(item.principal) }}</td>
            <td>{{ formatCurrency(item.interes) }}</td>
            <td>
              <v-text-field v-model="item.abono" label="Abono" outlined></v-text-field>
            </td>
            <td>{{ formatCurrency(item.saldo) }}</td>

        </tr>
      </tbody>
    </v-table>
</v-card-text>
</v-card>
  </template>
  <script>



    export default {
      props: {
          datos: {
          type: Object,
          required: true
          }
      },
      data () {
        return {
          items: [
            {
              periodo: 0,
              renta: 159,
              interes: 100,
              abono: 59,
              saldo: 1000
            }
          ],
        }
      },
      watch: {
          datos: {
            handler(newDatos) {
                console.log('Datos actualizados', newDatos);
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
        },
        formatCurrency(value) {
        // Formatear el número como moneda según tus necesidades
            // Formatea el número con separadores de miles y dos decimales
            return "$ "+parseFloat(value).toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }
    }
  </script>
