<template>
  <div>
    <!-- Tarjetas de resumen -->
    <v-row v-if="credito" dense class="mb-4">
      <v-col cols="6" md="3">
        <v-card variant="tonal" color="primary" class="pa-3 resumen-card" height="100%">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-check-outline" size="16" class="mr-1"></v-icon>
            <span class="eyebrow">Cuota Mensual</span>
          </div>
          <div class="text-h6 font-weight-bold tabular-nums">{{ formatCurrency(cuotaMensual) }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card variant="tonal" color="secondary" class="pa-3 resumen-card" height="100%">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-cash-multiple" size="16" class="mr-1"></v-icon>
            <span class="eyebrow">Total a Pagar</span>
          </div>
          <div class="text-h6 font-weight-bold tabular-nums">{{ formatCurrency(credito.valorFuturo) }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card variant="tonal" color="warning" class="pa-3 resumen-card" height="100%">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-chart-line-variant" size="16" class="mr-1"></v-icon>
            <span class="eyebrow">Intereses (con abonos)</span>
          </div>
          <div class="text-h6 font-weight-bold tabular-nums">{{ formatCurrency(credito.interesTotal) }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card variant="tonal" color="success" class="pa-3 resumen-card" height="100%">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-piggy-bank-outline" size="16" class="mr-1"></v-icon>
            <span class="eyebrow">Ahorro con Abonos</span>
          </div>
          <div class="text-h6 font-weight-bold tabular-nums">{{ formatCurrency(ahorro) }}</div>
        </v-card>
      </v-col>
    </v-row>

    <template v-if="items.length > 1">
      <div class="text-subtitle-1 font-weight-bold mb-3">Tabla de Amortización</div>

      <!-- ── Desktop: tabla ───────────────────────────────────────────────── -->
      <v-card v-if="isDesktop" variant="flat" border class="d-none d-sm-block">
        <v-card-text class="pa-0">
          <div class="tabla-scroll">
            <v-table density="compact">
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
                <tr
                  v-for="item in periodos"
                  :key="item.periodo"
                  :class="{ 'row-abono': item.abono > 0 }"
                >
                  <td class="text-center">{{ item.periodo }}</td>
                  <td class="text-right tabular-nums">{{ formatCurrency(item.cuota) }}</td>
                  <td class="text-right tabular-nums">{{ formatCurrency(item.principal) }}</td>
                  <td class="text-right tabular-nums text-warning">{{ formatCurrency(item.interes) }}</td>
                  <td class="text-right">
                    <v-text-field
                      v-if="!esUltimoPeriodo(item)"
                      v-model="item.abono"
                      density="compact"
                      variant="outlined"
                      hide-details
                      type="number"
                      min="0"
                      prefix="$"
                      style="min-width: 130px;"
                      @change="setAbonos(item.periodo, $event.target.value)"
                    ></v-text-field>
                    <span v-else class="text-medium-emphasis">$ 0</span>
                  </td>
                  <td class="text-right tabular-nums font-weight-medium">{{ formatCurrency(item.saldo) }}</td>
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
          :class="{ 'tiene-abono': item.abono > 0 }"
        >
          <!-- Fila superior: número y saldo -->
          <div class="pc-top">
            <span class="pc-num">Período {{ item.periodo }}</span>
            <span class="pc-saldo tabular-nums">{{ formatCurrency(item.saldo) }}</span>
          </div>

          <!-- Fila de métricas -->
          <div class="pc-metricas">
            <div class="pc-metrica">
              <span class="pc-m-label">Renta</span>
              <span class="pc-m-val tabular-nums">{{ formatCurrency(item.cuota) }}</span>
            </div>
            <div class="pc-metrica">
              <span class="pc-m-label">Principal</span>
              <span class="pc-m-val tabular-nums">{{ formatCurrency(item.principal) }}</span>
            </div>
            <div class="pc-metrica">
              <span class="pc-m-label">Interés</span>
              <span class="pc-m-val tabular-nums text-warning">{{ formatCurrency(item.interes) }}</span>
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
              prefix="$"
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
    // Excluye el período 0 (estado inicial) de la vista
    periodos() {
      return this.items.slice(1)
    },
    totalAbonos() {
      return this.periodos.reduce((sum, item) => sum + (parseFloat(item.abono) || 0), 0)
    },
    ahorro() {
      if (!this.credito || this.totalAbonos <= 0) return 0
      return this.credito.interesTotalSinAbonos - this.credito.interesTotal
    },
  },

  watch: {
    datos: {
      handler(newDatos) {
        this.items = newDatos.simulacion ?? []
        this.credito = newDatos.simulacion ? newDatos : null
      },
      deep: true,
      immediate: true,
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
/* ── Tarjetas de resumen ─────────────────────────────────────────────────── */
.resumen-card :deep(.v-icon) {
  opacity: 0.85;
}

/* ── Tabla desktop ───────────────────────────────────────────────────────── */
th, td {
  white-space: nowrap;
}

:deep(.tabla-scroll th) {
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.tabla-scroll td) {
  font-size: 0.85rem;
}

.row-abono td:first-child {
  box-shadow: inset 3px 0 0 0 rgb(var(--v-theme-success));
}

.row-abono {
  background-color: rgba(var(--v-theme-success), 0.07);
}

/* ── Cards móvil ─────────────────────────────────────────────────────────── */
.periodo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.periodo-card {
  background-color: #232323;
  border-radius: 8px;
  padding: 10px 12px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.periodo-card.tiene-abono {
  border-left-color: rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.07);
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
  color: rgb(var(--v-theme-primary));
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
