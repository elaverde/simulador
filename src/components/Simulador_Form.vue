<template>
  <div>
    <v-img
      src="../assets/images/logo.svg"
      alt="Logo"
      width="55%"
      aspect-ratio="16/9"
      class="mx-auto mb-4"
    ></v-img>

    <v-card variant="flat" color="transparent">
      <v-card-title class="text-subtitle-1 font-weight-bold px-0 pb-2">
        Detalles del Préstamo
      </v-card-title>

      <v-card-text class="px-0">
        <v-text-field
          v-model="monto"
          label="Monto del Préstamo"
          type="number"
          min="0"
          step="1000000"
          prepend-inner-icon="mdi-cash"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          class="mb-3"
        ></v-text-field>

        <v-row no-gutters class="mb-3">
          <v-col cols="7" class="pr-1">
            <v-select
              v-model="periodo"
              :items="['Mensual', 'Anual']"
              label="Período Tasa"
              prepend-inner-icon="mdi-calendar-clock"
              density="comfortable"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="5" class="pl-1">
            <v-text-field
              v-model="tasa"
              label="Tasa (%)"
              type="number"
              min="0"
              step="0.01"
              density="comfortable"
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-text-field
          v-model="plazo"
          label="Plazo (meses)"
          type="number"
          min="1"
          step="1"
          prepend-inner-icon="mdi-calendar-range"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          class="mb-4"
        ></v-text-field>

        <v-btn
          color="primary"
          size="large"
          block
          prepend-icon="mdi-calculator"
          @click="calcular"
        >
          Calcular
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SimuladorForm',

  emits: ['datos-simulacion'],

  data() {
    return {
      monto: 80000000,
      periodo: 'Anual',
      tasa: 22.42,
      plazo: 54,
    }
  },

  methods: {
    calcular() {
      this.$emit('datos-simulacion', {
        monto: parseFloat(this.monto),
        periodo: this.periodo,
        tasa: parseFloat(this.tasa),
        plazo: parseInt(this.plazo),
      })
    },
  },
}
</script>
