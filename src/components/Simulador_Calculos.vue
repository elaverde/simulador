<template>
  <div>
    <!-- Tarjetas de resumen -->
    <div v-if="credito" class="resumen-grid mb-4">
      <div class="resumen-card" style="border-color: #00BFFF;">
        <div class="rc-label">Cuota Mensual</div>
        <div class="rc-value" style="color: #00BFFF;">{{ formatCurrency(cuotaMensual) }}</div>
      </div>
      <div class="resumen-card" style="border-color: #4CAF50;">
        <div class="rc-label">Total a Pagar</div>
        <div class="rc-value" style="color: #4CAF50;">{{ formatCurrency(credito.valorFuturo) }}</div>
      </div>
      <div class="resumen-card" style="border-color: #FFA500;">
        <div class="rc-label">Intereses (con abonos)</div>
        <div class="rc-value" style="color: #FFA500;">{{ formatCurrency(credito.interesTotal) }}</div>
      </div>
      <div class="resumen-card" style="border-color: #9C27B0;">
        <div class="rc-label">Ahorro con Abonos</div>
        <div class="rc-value" style="color: #9C27B0;">{{ formatCurrency(ahorro > 0 ? ahorro : 0) }}</div>
      </div>
    </div>

    <template v-if="items.length > 1">
      <div class="text-body-1 font-weight-bold mb-3">Tabla de Amortización</div>

      <!-- ── Desktop: tabla ───────────────────────────────────────────────── -->
      <v-card v-if="isDesktop" class="d-none d-sm-block">
        <v-card-text class="pa-0">
          <div class="tabla-scroll">
            <v-table theme="dark" density="compact">
              <thead>
                <tr>
                  <th class="text-center">#</th>
                  <th class="text-right">Renta</th>
                  <th class="text-right">Principal</th>
                  <th class="text-right">Interés</th>
                  <th class="text-right">Abono Capital</th>
                  <th class="text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in periodos" :key="item.periodo">
                  <td class="text-center">{{ item.periodo }}</td>
                  <td class="text-right">{{ formatCurrency(item.cuota) }}</td>
                  <td class="text-right">{{ formatCurrency(item.principal) }}</td>
                  <td class="text-right">{{ formatCurrency(item.interes) }}</td>
                  <td class="text-right">
                    <v-text-field
                      v-if="!esUltimoPeriodo(item)"
                      v-model="item.abono"
                      density="compact"
                      variant="outlined"
                      hide-details
                      type="number"
                      min="0"
                      style="min-width: 110px;"
                      @change="setAbonos(item.periodo, $event.target.value)"
                    ></v-text-field>
                    <span v-else>$ 0</span>
                  </td>
                  <td class="text-right">{{ formatCurrency(item.saldo) }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-card>

      <!-- ── Móvil: cards compactas ──────────────────────────────────────── -->
      <div v-else class="periodo-list d-sm-none">
        <div
          v-for="item in periodos"
          :key="item.periodo"
          class="periodo-card"
        >
          <!-- Fila superior: número y saldo -->
          <div class="pc-top">
            <span class="pc-num">Período {{ item.periodo }}</span>
            <span class="pc-saldo">{{ formatCurrency(item.saldo) }}</span>
          </div>

          <!-- Fila de métricas -->
          <div class="pc-metricas">
            <div class="pc-metrica">
              <span class="pc-m-label">Renta</span>
              <span class="pc-m-val">{{ formatCurrency(item.cuota) }}</span>
            </div>
            <div class="pc-metrica">
              <span class="pc-m-label">Principal</span>
              <span class="pc-m-val">{{ formatCurrency(item.principal) }}</span>
            </div>
            <div class="pc-metrica">
              <span class="pc-m-label">Interés</span>
              <span class="pc-m-val text-warning">{{ formatCurrency(item.interes) }}</span>
            </div>
          </div>

          <!-- Abono a capital -->
          <div v-if="!esUltimoPeriodo(item)" class="pc-abono">
            <v-text-field
              v-model="item.abono"
              label="Abono a capital"
              density="compact"
              variant="outlined"
              hide-details
              type="number"
              min="0"
              prepend-inner-icon="mdi-plus-circle-outline"
              @change="setAbonos(item.periodo, $event.target.value)"
            ></v-text-field>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SimuladorCalculos',

  props: {
    datos: {
      type: Object,
      required: true,
    },
  },

  emits: ['datos-simulacion'],

  data() {
    return {
      credito: null,
      items: [],
    }
  },

  computed: {
    isDesktop() {
      return window.innerWidth >= 600
    },
    cuotaMensual() {
      return this.credito?.simulacion?.[1]?.cuota ?? 0
    },
    ahorro() {
      if (!this.credito) return 0
      return this.credito.interesTotalSinAbonos - this.credito.interesTotal
    },
    // Excluye el período 0 (estado inicial) de la vista
    periodos() {
      return this.items.slice(1)
    },
  },

  watch: {
    datos: {
      handler(newDatos) {
        this.items = newDatos.simulacion ?? []
        this.credito = newDatos.simulacion ? newDatos : null
      },
      deep: true,
    },
  },

  methods: {
    esUltimoPeriodo(item) {
      return item === this.periodos[this.periodos.length - 1]
    },
    setAbonos(index, value) {
      this.$emit('datos-simulacion', { index: index - 1, cantidad: value })
    },
    formatCurrency(value) {
      return '$ ' + parseFloat(value || 0).toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },
  },
}
</script>

<style scoped>
/* ── Tabla desktop ───────────────────────────────────────────────────────── */
th, td {
  white-space: nowrap;
}

/* ── Cards móvil ─────────────────────────────────────────────────────────── */
.periodo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.periodo-card {
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 10px 12px;
  border-left: 3px solid #00BFFF;
}

.pc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.pc-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: #00BFFF;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pc-saldo {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.pc-metricas {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.pc-metrica {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pc-m-label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 1px;
}

.pc-m-val {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ddd;
}

.pc-abono {
  margin-top: 4px;
}
</style>
