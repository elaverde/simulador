

class Simulador {
    arrSimulacion = [];
    constructor(monto, periodo, tasa, plazo) {
        this.monto = monto;
        this.periodo = periodo;
        this.tasa={
            usuario:   tasa ,
            calculada: tasa / 100
        }
        this.plazo = plazo;
    }

    getTasaInteres() {
        if (this.periodo === 'Anual') {
            let tasa= Math.pow(1 + this.tasa.calculada, 1 / 12) - 1;
            this.tasa={
                usuario:   tasa * 100 ,
                calculada: tasa
            }
        }
    }
    getPagoMensual() {
        let tasa = this.monto * this.tasa.calculada / (1 - Math.pow(1 + this.tasa.calculada, -this.plazo));
        return (tasa);
    }
    procesar() {
        this.arrSimulacion.push({
            periodo: 0,
            abono: 0,
            cuota: 0,
            principal: 0,
            interes: 0,
            saldo: this.monto
        });
        let saldo = this.monto;
        let cuota = this.getPagoMensual();
        for(let item = 0 ; item < this.plazo; item++) {
            let interes = saldo * this.tasa.calculada;
            let abono = cuota - interes;
            saldo = saldo - abono;

            this.arrSimulacion.push({
                periodo: item + 1,
                saldo: saldo > 0 ? Math.floor(saldo) : 0,
                interes: Math.floor(interes),
                principal: Math.floor(abono),
                cuota: Math.floor(cuota),
                abono:0
            });
        }
    }

    simular() {
        // console.log(this.monto, this.periodo, this.tasa, this.plazo);
        this.getTasaInteres();
        this.procesar();
       // console.table(this.arrSimulacion);

        return this.arrSimulacion;
        // Realizar cálculos adicionales según sea necesario
    }
}

export default Simulador;
