import Dexie, { type EntityTable } from "dexie"
import { Etiqueta, Movimiento, Presupuesto, Tercero } from "./schema"
import type { ZodObject } from "zod/v4"
import { browser } from "$app/environment"

export const db = new Dexie("Listas") as Dexie & {
    presupuestos: EntityTable<Presupuesto, "id">
    movimientos: EntityTable<Movimiento, "id">
    etiquetas: EntityTable<Etiqueta, "id">
    terceros: EntityTable<Tercero, "id">
} 

export function tableDef(schema: ZodObject) {
    const cols = Object.keys(schema.shape).filter(v => v !== "id")
    
    return `++id,${cols.join(",")}`
}

db.version(4).stores({
    presupuestos: tableDef(Presupuesto),
    movimientos: tableDef(Movimiento),
    etiquetas: tableDef(Etiqueta),
    terceros: tableDef(Tercero),
})
// .upgrade((trans) => {
//     return trans.table("presupuesto").toCollection().modify((p) => {
//         p.inicioPeriodo = p.ultimaRenovacion
//         delete p.ultimaRenovacion
//         p.montoInicial = p.montoActual
//         delete p.montoActual
//     })
// })

export async function poblarDB() {
    const length = await db.presupuestos.count()

    if (length === 0) {
        const presupuesto = await db.presupuestos.add({
            nombre: "Por defecto",
            montoInicial: 10000,
            montoRenovacion: 10000,
            periodoRenovacion: 3600 * 24 * 30,
            inicioPeriodo: new Date().toISOString(),
            fechaModificado: new Date().toISOString()
        })

        const fechaModificado = new Date().toISOString()
        const defaultEtiquetas = [
            ["🍺", "bebida"],
            ["🍕", "comida"],
            ["😆", "ocio"],
            ["🏠", "alquiler"],
            ["🔒", "seguro"],
            ["🏥", "salud"],
        ]
        await db.etiquetas.bulkAdd(defaultEtiquetas.map(([icon, nombre]) => (
            { fechaModificado, icon, nombre, oculto: false, presupuesto }
        )))
    }

}

export const listPresupuestos = ()            => db.presupuestos.toArray()
export const getPresupuesto   = (id: number)  => db.presupuestos.get(id)

export const listMovimientos = (presupuesto: number)                 => db.movimientos.where("presupuesto").equals(presupuesto).toArray()
export const getMovimiento   = (id: number)                          => db.movimientos.get(id)
export const addMovimiento   = (movimiento: Omit<Movimiento, "id">)  => db.movimientos.add(movimiento)
export const putMovimiento   = (movimiento: Movimiento)              => db.movimientos.put(movimiento)

export const listEtiquetas = (presupuesto: number)             => db.etiquetas.where("presupuesto").equals(presupuesto).toArray()
export const getEtiqueta   = (id: number)                      => db.etiquetas.get(id)
export const addEtiqueta   = (etiqueta: Omit<Etiqueta, "id">)  => db.etiquetas.add(etiqueta)
export const putEtiqueta   = (etiqueta: Etiqueta)              => db.etiquetas.put(etiqueta)

export const getTercero = (id: number)                    => db.terceros.get(id)
export const addTercero = (tercero: Omit<Tercero, "id">)  => db.terceros.add(tercero)
