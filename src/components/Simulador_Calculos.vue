<template>
  <v-card>
    <v-card-title v-if="items.length > 1">Cálculos Préstamo</v-card-title>

    <v-card-text>
      <!-- Modo Tabla (Solo en pantallas grandes) -->
      <v-table v-if="isMobile && items.length > 1" theme="dark">
        <thead>
          <tr>
            <th class="text-left">Período</th>
            <th class="text-left">Renta</th>
            <th class="text-left">Principal</th>
            <th class="text-left">Interés</th>
            <th class="text-left">Abono a Capital</th>
            <th class="text-left">Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.periodo">
            <td>{{ item.periodo }}</td>
            <td>{{ formatCurrency(item.cuota) }}</td>
            <td>{{ formatCurrency(item.principal) }}</td>
            <td>{{ formatCurrency(item.interes) }}</td>
            <td>
              <v-text-field
                v-if="item.periodo != 0 && item != items[items.length - 1]"
                @change="setAbonos(item.periodo, $event.target.value)"
                v-model="item.abono"
                label="Abono"
                outlined
              ></v-text-field>
              <span v-else>0</span>
            </td>
            <td>{{ formatCurrency(item.saldo) }}</td>
          </tr>
        </tbody>
      </v-table>

      <!-- Modo Tarjetas (Solo en móviles) -->
      <div v-else>
        <v-card v-for="item in items" :key="item.periodo" class="mb-3" outlined>
          <v-card-title>Período: {{ item.periodo }}</v-card-title>
          <v-card-text>
            <p><strong>Renta:</strong> {{ formatCurrency(item.cuota) }}</p>
            <p>
              <strong>Principal:</strong> {{ formatCurrency(item.principal) }}
            </p>
            <p><strong>Interés:</strong> {{ formatCurrency(item.interes) }}</p>
            <p><strong>Saldo:</strong> {{ formatCurrency(item.saldo) }}</p>
            <v-text-field
              class="mt-2"
              v-if="item.periodo != 0 && item != items[items.length - 1]"
              @change="setAbonos(item.periodo, $event.target.value)"
              v-model="item.abono"
              label="Abono"
              outlined
            ></v-text-field>
            <p v-else><strong>Abono a Capital:</strong> 0</p>
          </v-card-text>
        </v-card>
      </div>

      <span v-if="items.length > 1">
        Valor del crédito esperado: {{ formatCurrency(credito.valorFuturo) }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    datos: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      credito: "",
      items: [],
    };
  },
  computed: {
    isMobile() {
      console.log(window.innerWidth);
      return window.innerWidth >= 600; // Si la pantalla es menor o igual a 768px, consideramos que es móvil
    },
  },
  watch: {
    datos: {
      handler(newDatos) {
        this.actualizarItems(newDatos);
      },
      deep: true,
    },
  },
  methods: {
    setAbonos(index, value) {
      let abono = { index: index - 1, cantidad: value };
      this.$emit("datos-simulacion", abono);
    },
    actualizarItems(datos) {
      this.items = datos.simulacion;
      this.credito = datos;
    },
    formatCurrency(value) {
      return (
        "$ " +
        parseFloat(value).toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
