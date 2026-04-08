class Simulador {
  arrSimulacion = [];

  constructor(monto, periodo, tasa, plazo) {
    this.monto = monto;
    this.periodo = periodo;
    this.abonos = new Array(plazo).fill(0);
    this.tasa = {
      mensual: tasa / 100,
      anual: tasa,
    };
    this.plazo = plazo;
  }

  getTasaInteres() {
    if (this.periodo === "Anual") {
      const tasaMensual = Math.pow(1 + this.tasa.anual / 100, 1 / 12) - 1;
      this.tasa = {
        mensual: tasaMensual,
        anual: this.tasa.anual,
      };
    }
  }

  getPagoMensual() {
    return (
      (this.monto * this.tasa.mensual) /
      (1 - Math.pow(1 + this.tasa.mensual, -this.plazo))
    );
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
    const cuota = this.getPagoMensual();

    // Fix: era `item <= this.plazo` (plazo+1 iteraciones); debe ser `item < this.plazo`
    // Con `<=`, la última iteración accede a `this.abonos[plazo]` que es undefined → NaN
    for (let item = 0; item < this.plazo; item++) {
      const saldoAnterior = saldo;
      const interes = saldo * this.tasa.mensual;
      const principal = cuota - interes;
      saldo = saldo - (principal + Math.floor(this.abonos[item]));

      if (interes > 0) {
        this.arrSimulacion.push({
          periodo: item + 1,
          saldo: saldo > 0 ? Math.floor(saldo) : 0,
          interes: Math.floor(interes),
          principal: Math.floor(principal),
          cuota: saldoAnterior < cuota ? Math.floor(saldoAnterior) : Math.floor(cuota),
          abono: this.abonos[item],
        });
      }
    }
  }

  getSumInteres() {
    return this.arrSimulacion.reduce((sum, item) => sum + item.interes, 0);
  }

  getValorFuturo() {
    return this.getPagoMensual() * this.plazo;
  }

  setAbonos(abono) {
    this.abonos[abono.index] = abono.cantidad;
  }

  simular() {
    this.getTasaInteres();
    this.procesar();
    return {
      monto: this.monto,
      interesTotal: Math.floor(this.getSumInteres()),
      interesTotalSinAbonos: Math.floor(this.getValorFuturo() - this.monto),
      valorFuturo: this.getValorFuturo(),
      tasa: this.tasa,
      plazo: this.plazo,
      periodo: this.periodo,
      simulacion: this.arrSimulacion,
    };
  }
}

export default Simulador;
