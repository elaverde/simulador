<template>
  <v-img
    src="../assets/images/logo.svg"
    alt="Descripción de la imagen"
    width="50%"
    aspect-ratio="16/9"
    class="mx-auto pb-6"
  ></v-img>

  <v-card class="w-100 mx-0 px-0">
    <v-card-title>Detalles del Préstamo</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="monto"
            label="Monto del Préstamo"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-row no-gutters>
            <!-- Elimina los espacios entre columnas -->
            <v-col cols="7" class="pr-1">
              <v-select
                v-model="periodo"
                class="input-without-border-radius"
                :items="['Mensual', 'Anual']"
                label="Periodo de Tasa de Interés"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="5" class="pl-1">
              <v-text-field
                v-model="tasa"
                class="input-without-border-radius"
                label="Tasa de Interés (%)"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="plazo"
            label="Plazo del Préstamo (en meses o años)"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-btn @click="calcular" color="primary" block>Calcular</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style>
.input-without-border-radius .v-input--outlined:not(.v-input--is-focused) {
  border-radius: 0 !important;
}
</style>

<script>
export default {
  data() {
    return {
      monto: 80000000,
      periodo: "Anual",
      tasa: 22.42,
      plazo: 54,
    };
  },
  methods: {
    calcular() {
      const data = {
        monto: this.monto,
        periodo: this.periodo,
        tasa: this.tasa,
        plazo: parseInt(this.plazo),
      };
      this.$emit("datos-simulacion", data);
    },
  },
};
</script>
