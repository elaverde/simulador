<template>
  <div>
    <v-card variant="flat" color="transparent">
      <v-card-title class="text-subtitle-1 font-weight-bold px-0 pb-1 d-flex align-center">
        <v-icon icon="mdi-file-document-edit-outline" size="20" color="primary" class="mr-2"></v-icon>
        Detalles del Préstamo
      </v-card-title>
      <p class="text-caption text-medium-emphasis px-0 mb-4">
        Ingresa las condiciones del crédito para proyectar tu plan de pagos.
      </p>

      <v-card-text class="px-0">
        <v-text-field
          v-model="montoFormateado"
          label="Monto del Préstamo"
          inputmode="numeric"
          prefix="$"
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
          :hint="plazoAnios"
          persistent-hint
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

  computed: {
    montoFormateado: {
      get() {
        return this.monto || this.monto === 0
          ? Number(this.monto).toLocaleString('es-ES')
          : ''
      },
      set(value) {
        const digitos = String(value).replace(/\D/g, '')
        this.monto = digitos ? parseInt(digitos, 10) : ''
      },
    },
    plazoAnios() {
      const meses = parseInt(this.plazo)
      if (!meses) return ''
      const anios = (meses / 12).toFixed(1)
      return `≈ ${anios} años`
    },
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
    cargarDatos(datos) {
      this.monto = datos.monto
      this.periodo = datos.periodo
      this.tasa = datos.tasa
      this.plazo = datos.plazo
      this.calcular()
    },
  },
}
</script>
