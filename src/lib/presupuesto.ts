import { listMovimientos } from "./localDb";
import type { Presupuesto } from "./schema";

export function montoBase(presupuesto: Presupuesto, hoy: Date) {
    const paso = (hoy.getTime() - Date.parse(presupuesto.inicioPeriodo)) / 1000
    return presupuesto.montoInicial + presupuesto.montoRenovacion * Math.floor(paso / presupuesto.periodoRenovacion)
}

export async function montoTotal(presupuesto: Presupuesto, hoy: Date) {
    const movimientos = await listMovimientos(presupuesto.id)
    const base = montoBase(presupuesto, hoy)
    console.log({presupuesto, base})

    return base + movimientos.reduce((total, mov) => (
        total + mov.monto
    ), 0)
}