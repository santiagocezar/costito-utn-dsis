import * as v from "valibot"
import type { Movimiento } from "./localDb"

interface Cotizacion {
    compra: number
    venta: number
}

const CotizacionRaw = v.object({
    compra: v.string(),
    venta: v.string(),
})

const Cotizacion = v.object({
    compra: v.number(),
    venta: v.number(),
})

export async function cotizacionDolar(variante: "oficial" | "blue" = "oficial"): Promise<Cotizacion> {
    const res = await fetch(`https://mercados.ambito.com/dolar/${variante === "blue" ? "informal" : variante}/variacion`)
    const json = await res.json()

    const raw = v.parse(CotizacionRaw, json)

    const cotizacion: Cotizacion = {
        compra: parseFloat(raw.compra.replace(",", ".")),
        venta: parseFloat(raw.venta.replace(",", "."))
    }

    if (isNaN(cotizacion.compra) || isNaN(cotizacion.venta)) {
        throw new Error("valores de compra o venta no válidos")
    }

    return cotizacion
}


export async function cotizacionDolarHistorca(fecha: Date, variante: "oficial"  | "blue" = "oficial"): Promise<Cotizacion> {
    const today = new Date()
    // Si pasaron menos de 24hrs tomar el valor actual, ya que la API
    // no incluye datos para el día actual.
    if ((today.getTime() - fecha.getTime()) < (1000 * 60 * 60 * 24)) {
        return await cotizacionDolar(variante)
    }
    const yyyy = fecha.getFullYear()
    const mm = ('0' + (fecha.getMonth() + 1)).slice(-2)
    const dd = ('0' + fecha.getDate()).slice(-2)
    const res = await fetch(`https://api.argentinadatos.com/v1/cotizaciones/dolares/${variante}/${yyyy}/${mm}/${dd}`)
    const json = await res.json()

    return v.parse(Cotizacion, json)
}

export function fmtMonto(monto: number, moneda: Movimiento['moneda']) {
    return (monto > 0 ? '+' : '') + monto.toLocaleString("es-AR", {
        style: "currency",
        currency: moneda === "ars" ? "ARS" : "USD",
    })
}
