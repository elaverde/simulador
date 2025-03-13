import { th } from "vuetify/locale";

class Simulador {
  arrSimulacion = [];
  constructor(monto, periodo, tasa, plazo) {
    this.monto = monto;
    this.periodo = periodo;
    // creamos un array de abonos a capital con plazo
    this.abonos = new Array(plazo).fill(0);
    this.tasa = {
      mensual: tasa / 100,
      anual: tasa,
    };
    this.plazo = plazo;
  }

  getTasaInteres() {
    if (this.periodo === "Anual") {
      let tasaMensual = Math.pow(1 + this.tasa.anual / 100, 1 / 12) - 1;
      this.tasa = {
        mensual: tasaMensual,
        anual: this.tasa.anual,
      };
    }
  }
  getPagoMensual() {
    console.log("Monto: ", this.monto);
    console.log("Tasa: ", this.tasa.mensual);
    console.log("Plazo: ", this.plazo);

    let tasa =
      (this.monto * this.tasa.mensual) /
      (1 - Math.pow(1 + this.tasa.mensual, -this.plazo));
    return tasa;
  }
  procesar() {
    this.arrSimulacion = [];
    this.arrSimulacion.push({
      periodo: 0,
      abono: 0,
      cuota: 0,
      principal: 0,
      interes: 0,
      saldo: this.monto,
    });
    let saldo = this.monto;
    let saldoAnterior = saldo;
    const cuota = this.getPagoMensual();
    console.log("Cuota: ", cuota);

    console.log("Plazo: ", this.plazo);
    for (let item = 0; item <= this.plazo; item++) {
      console.log("Item: ", item);
      saldoAnterior = saldo;
      let interes = saldo * this.tasa.mensual;
      let abono = cuota - interes;
      saldo = saldo - (abono + Math.floor(this.abonos[item]));

      if (interes > 0) {
        this.arrSimulacion.push({
          periodo: item + 1,
          saldo: saldo > 0 ? Math.floor(saldo) : 0,
          interes: Math.floor(interes),
          principal: Math.floor(abono),
          cuota: saldoAnterior < cuota ? saldoAnterior : Math.floor(cuota),
          abono: this.abonos[item],
        });
      }
    }
  }

  getSumInteres() {
    // realizamos un for sumamos los interes de arrSimulacion
    let sumInteres = 0;
    for (let item of this.arrSimulacion) {
      sumInteres += item.interes;
    }
    return sumInteres;
  }
  getValorFuturo() {
    let cuota = this.getPagoMensual();
    let valorFuturo = cuota * this.plazo;
    return valorFuturo;
  }
  setAbonos(abono) {
    this.abonos[abono.index] = abono.cantidad;
    console.log(this.abonos);
  }
  simular() {
    // console.log(this.monto, this.periodo, this.tasa, this.plazo);
    this.getTasaInteres();
    this.procesar();
    let credito = {
      monto: this.monto,
      interesTotal: this.getSumInteres(),
      valorFuturo: this.getValorFuturo(),
      tasa: this.tasa,
      plazo: this.plazo,
      periodo: this.periodo,
      simulacion: this.arrSimulacion,
    };
    return credito;
  }
}

export default Simulador;
