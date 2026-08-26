<template>
  <div class="d-inline-block">
    <v-btn
      color="secondary"
      variant="tonal"
      prepend-icon="mdi-folder-open"
      size="small"
      class="mr-2"
      @click="abrirDialog"
    >
      <span class="d-none d-sm-inline">Mis Préstamos</span>
      <span class="d-inline d-sm-none">Préstamos</span>
    </v-btn>

    <v-dialog v-model="dialog" max-width="560">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between py-3">
          <span class="d-flex align-center">
            <v-icon icon="mdi-folder-open" color="secondary" size="20" class="mr-2"></v-icon>
            Mis Préstamos
          </span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <div class="eyebrow mb-2">Guardar simulación actual</div>
          <v-row no-gutters class="mb-4">
            <v-col>
              <v-text-field
                v-model="nombreNuevo"
                label="Nombre del préstamo"
                density="comfortable"
                variant="outlined"
                hide-details
                :disabled="!datosActuales"
                @keyup.enter="guardarActual"
              ></v-text-field>
            </v-col>
            <v-col cols="auto" class="pl-2">
              <v-btn
                color="primary"
                height="48"
                prepend-icon="mdi-content-save-outline"
                :disabled="!datosActuales || !nombreNuevo"
                @click="guardarActual"
              >
                Guardar
              </v-btn>
            </v-col>
          </v-row>
          <p v-if="!datosActuales" class="text-caption text-medium-emphasis mt-n2 mb-4">
            Calcula una simulación primero para poder guardarla.
          </p>

          <v-divider class="mb-4"></v-divider>

          <div class="d-flex align-center justify-space-between mb-4">
            <div class="eyebrow">Importar desde archivo (.json)</div>
            <v-btn
              size="small"
              variant="outlined"
              color="secondary"
              prepend-icon="mdi-upload"
              @click="triggerImport"
            >
              Importar
            </v-btn>
            <input
              ref="fileInput"
              type="file"
              accept="application/json"
              class="d-none"
              @change="onFileSelected"
            />
          </div>

          <v-alert
            v-if="errorImport"
            type="error"
            density="compact"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="errorImport = ''"
          >
            {{ errorImport }}
          </v-alert>

          <v-divider class="mb-2"></v-divider>

          <div class="eyebrow mb-2">Guardados en este navegador</div>

          <div v-if="lista.length === 0" class="text-center py-6">
            <v-icon icon="mdi-folder-outline" size="40" color="grey-darken-1" class="mb-2"></v-icon>
            <div class="text-body-2 text-medium-emphasis">Aún no tienes préstamos guardados.</div>
          </div>

          <v-list v-else lines="two" density="compact" class="lista-prestamos">
            <v-list-item
              v-for="p in lista"
              :key="p.id"
              :title="p.nombre"
              :subtitle="resumen(p)"
              rounded="lg"
              class="mb-1"
            >
              <template #prepend>
                <v-avatar color="primary" variant="tonal" size="36">
                  <v-icon icon="mdi-bank-outline" size="18"></v-icon>
                </v-avatar>
              </template>
              <template #append>
                <v-btn
                  icon="mdi-folder-open-outline"
                  variant="text"
                  size="small"
                  title="Abrir"
                  @click="abrir(p)"
                ></v-btn>
                <v-btn
                  icon="mdi-download-outline"
                  variant="text"
                  size="small"
                  title="Exportar"
                  @click="exportar(p)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete-outline"
                  variant="text"
                  size="small"
                  color="error"
                  title="Eliminar"
                  @click="confirmarEliminar(p)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirmación de eliminación -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-alert-circle-outline" color="error" class="mr-2"></v-icon>
          Eliminar préstamo
        </v-card-title>
        <v-card-text>
          ¿Seguro que quieres eliminar
          <strong>{{ prestamoAEliminar?.nombre }}</strong>? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="tonal" @click="eliminarConfirmado">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500" location="bottom">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
const STORAGE_KEY = 'prestamos'

export default {
  name: 'SimuladorPrestamos',

  props: {
    datosActuales: {
      type: Object,
      default: null,
    },
  },

  emits: ['abrir-prestamo'],

  data() {
    return {
      dialog: false,
      lista: [],
      nombreNuevo: '',
      errorImport: '',
      confirmDialog: false,
      prestamoAEliminar: null,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },

  methods: {
    abrirDialog() {
      this.cargarLista()
      this.errorImport = ''
      this.dialog = true
    },

    cargarLista() {
      try {
        const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY))
        this.lista = Array.isArray(guardados) ? guardados : []
      } catch {
        this.lista = []
      }
    },

    persistir() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lista))
    },

    notificar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },

    guardarActual() {
      if (!this.datosActuales || !this.nombreNuevo) return
      const nombre = this.nombreNuevo
      this.lista.unshift({
        id: Date.now(),
        nombre,
        fecha: new Date().toISOString(),
        ...this.datosActuales,
      })
      this.persistir()
      this.nombreNuevo = ''
      this.notificar(`Préstamo "${nombre}" guardado`)
    },

    confirmarEliminar(prestamo) {
      this.prestamoAEliminar = prestamo
      this.confirmDialog = true
    },

    eliminarConfirmado() {
      const nombre = this.prestamoAEliminar?.nombre
      this.lista = this.lista.filter((p) => p.id !== this.prestamoAEliminar.id)
      this.persistir()
      this.confirmDialog = false
      this.notificar(`Préstamo "${nombre}" eliminado`, 'info')
      this.prestamoAEliminar = null
    },

    abrir(prestamo) {
      this.$emit('abrir-prestamo', prestamo)
      this.dialog = false
      this.notificar(`Préstamo "${prestamo.nombre}" cargado`)
    },

    resumen(p) {
      const fecha = p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : ''
      const monto = '$ ' + parseFloat(p.monto || 0).toLocaleString('es-ES')
      return `${monto} · ${p.plazo} meses · ${p.tasa}% ${p.periodo}${fecha ? ' · ' + fecha : ''}`
    },

    exportar(prestamo) {
      const blob = new Blob([JSON.stringify(prestamo, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(prestamo.nombre || 'prestamo').replace(/[^\w\- ]/g, '')}.json`
      a.click()
      URL.revokeObjectURL(url)
      this.notificar(`"${prestamo.nombre}.json" descargado`)
    },

    triggerImport() {
      this.errorImport = ''
      this.$refs.fileInput.click()
    },

    onFileSelected(event) {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const datos = JSON.parse(e.target.result)
          if (!this.esPrestamoValido(datos)) {
            throw new Error('Formato inválido')
          }

          datos.id = Date.now()
          if (!datos.nombre) datos.nombre = file.name.replace(/\.json$/i, '')
          datos.fecha = new Date().toISOString()

          this.lista.unshift(datos)
          this.persistir()
          this.$emit('abrir-prestamo', datos)
          this.dialog = false
          this.notificar(`Préstamo "${datos.nombre}" importado`)
        } catch {
          this.errorImport = 'No se pudo importar el archivo. Verifica que sea un préstamo exportado válido.'
        }
      }
      reader.readAsText(file)
      event.target.value = ''
    },

    esPrestamoValido(datos) {
      return (
        datos &&
        typeof datos === 'object' &&
        typeof datos.monto === 'number' &&
        typeof datos.plazo === 'number' &&
        typeof datos.tasa === 'number' &&
        (datos.periodo === 'Mensual' || datos.periodo === 'Anual')
      )
    },
  },
}
</script>

<style scoped>
.lista-prestamos {
  max-height: 320px;
  overflow-y: auto;
}
</style>
