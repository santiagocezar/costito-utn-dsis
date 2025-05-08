import Dexie, { type EntityTable } from "dexie"

export interface Presupuesto {
    id: number

    nombre: string
    montoActual: number
    montoRenovacion: number
    ultimaRenovacion: Date
    periodoRenovacion: number
}

export interface Movimiento {
    id: number

    fecha: Date
    latitud: number
    longitud: number
    monto: number
    moneda: "usd" | "ars"
    montoConvertido?: number
    observacion: string

    etiquetas: number[]
    presupuesto: number
    indole?: number
    tercero?: number
}

export interface Etiqueta {
    id: number

    nombre: string
    oculto: boolean
}

export interface Tercero {
    id: number

    nombre: string
    latitud?: number
    longitud?: number
    mapsID?: string
}

export interface Indole {
    id: number

    nombre: string
    icon: string
}

export const db = new Dexie("Listas") as Dexie & {
    presupuestos: EntityTable<Presupuesto, "id">
    movimientos: EntityTable<Movimiento, "id">
    etiquetas: EntityTable<Etiqueta, "id">
    terceros: EntityTable<Tercero, "id">
    indoles: EntityTable<Indole, "id">
} 

db.version(2).stores({
    presupuestos: "++id,nombre,montoActual,montoRenovacion,ultimaRenovacion,periodoRenovacion",
    movimientos: "++id,fecha,latitud,longitud,monto,moneda,montoConvertido,observacion,etiquetas,presupuesto,indole,tercero",
    etiquetas: "++id,nombre,oculto",
    terceros: "++id,nombre,latitud,longitud,mapsID",
    indoles: "++id,nombre,icon",
})

export async function poblarDB() {
    const length = await db.presupuestos.count()

    if (length === 0) {
        await db.presupuestos.add({
            nombre: "Por defecto",
            montoActual: 10000,
            montoRenovacion: 10000,
            periodoRenovacion: 3600 * 24 * 30,
            ultimaRenovacion: new Date()
        })
    }
}

export async function listPresupuestos() {
    return await db.presupuestos.toArray()
}

export async function getPresupuesto(id: number) {
    return await db.presupuestos.get(id)
}

export async function listMovimientos(presupuesto: number) {
    return await db.movimientos.where("presupuesto").equals(presupuesto).toArray()
}

export async function getMovimiento(id: number) {
    return await db.movimientos.get(id)
}

export async function addMovimiento(movimiento: Omit<Movimiento, "id">) {
    return await db.movimientos.add(movimiento)
}

export async function putMovimiento(movimiento: Movimiento) {
    return await db.movimientos.put(movimiento)
}

export async function listEtiquetas() {
    return await db.etiquetas.toArray()
}

export async function getEtiqueta(id: number) {
    return await db.etiquetas.get(id)
}

export async function addEtiqueta(etiqueta: Omit<Etiqueta, "id">) {
    return await db.etiquetas.add(etiqueta)
}

export async function putEtiqueta(etiqueta: Etiqueta) {
    return await db.etiquetas.put(etiqueta)
}

export async function getTercero(id: number) {
    return await db.terceros.get(id)
}

export async function addTercero(tercero: Omit<Tercero, "id">) {
    return await db.terceros.add(tercero)
}