<template>
  <v-card>
   <v-card-title  v-if="items.length > 1">Calculos Préstamo</v-card-title>

   <v-card-text>
 <v-table  v-if="items.length > 1" theme="dark">
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
    <tr v-if="items.length > 1" v-for="item in items" :key="item.periodo">
         <td>{{ item.periodo }}</td>
         <td>{{ formatCurrency(item.cuota) }}</td>
         <td>{{ formatCurrency(item.principal) }}</td>
         <td>{{ formatCurrency(item.interes) }}</td>
         <td>
           <v-text-field v-if="item.periodo != 0 && item != items[items.length - 1]" @change="setAbonos(item.periodo, $event.target.value)" v-model="item.abono" label="Abono" outlined></v-text-field>
           <span v-else>0</span>
         </td>
         <td>{{ formatCurrency(item.saldo) }}</td>

     </tr>
   </tbody>
 </v-table>
  <span  v-if="items.length > 1">Valor del crédito esperado: {{ credito.valorFuturo }}</span>
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
       credito: '',
       items: [
         {
           principal:0,
           periodo: 0,
           renta: 0,
           interes: 0,
           abono: 0,
           saldo: 0
         }
       ],
     }
   },
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
     setAbonos(index, value){
        let abono= {index:index-1, cantidad:value}
        this.$emit('datos-simulacion', abono);
      },
     actualizarItems(datos) {
     // Realizar cálculos y actualizar items
     // Aquí puedes hacer los cálculos necesarios usando los datos recibidos y actualizar this.items
     // Por ejemplo:
         this.items = datos.simulacion;
         this.credito = datos;
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
