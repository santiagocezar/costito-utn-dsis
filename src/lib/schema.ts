import { z } from "zod/v4" 

export const Presupuesto = z.object({
    id: z.number(),

    fechaModificado: z.iso.date(),
    nombre: z.string(),
    montoInicial: z.number(),
    montoRenovacion: z.number(),
    /** Fecha en la que comenzó la renovación del presupuesto */
    inicioPeriodo: z.iso.date().meta({
        description: "Fecha en la que comenzó la renovación del presupuesto"
    }),
    /** Tiempo medido en segundos */
    periodoRenovacion: z.number().meta({
        description: "Tiempo medido en segundos"
    }),
}).meta({
    id: "Presupuesto",
    description: "Un presupuesto que almacena el consumo estimado del usuario en cierto periodo, que se renueva automáticamente. Se utiliza para agrupar movimientos.",
    examples: [{
        id: 0,
        fechaModificado: "2008-04-01T02:00:00.000Z",
        nombre: "Por defecto",
        montoInicial: 90000,
        montoRenovacion: 90000,
        inicioPeriodo: "2008-04-01T02:00:00.000Z",
        periodoRenovacion: 60 * 60 * 24 * 30,
    }]
});
export type Presupuesto = z.infer<typeof Presupuesto>;

export const LatLng = z.object({
    lat: z.number(),
    lng: z.number(),
}).meta({
    id: "LatLng",
    description: "Un primitivo para guardar la latitud y longitud de una ubicación.",
    examples: [{
        lat: -31.42,
        lng: -62.11,
    }]
});
export type LatLng = z.infer<typeof LatLng>;

export const Movimiento = z.object({
    id: z.number(),

    fecha: z.iso.date(),
    fechaModificado: z.iso.date(),
    ubicacion: LatLng,
    monto: z.number(),
    moneda: z.union([z.literal("usd"), z.literal("ars")]),
    montoConvertido: z.optional(z.number()),
    observacion: z.string(),

    etiquetas: z.array(z.number()),
    presupuesto: z.number(),
    tercero: z.optional(z.number()),
}).meta({
    id: "Movimiento",
    description: "Un ingreso o egreso que realizó el usuario en cierto lugar, fecha, con un tercero. Se asocia a un Presupuesto.",
    examples: [{
        id: 0,

        fecha: "2008-04-01T02:00:00.000Z",
        fechaModificado: "2008-04-01T08:00:00.000Z",
        ubicacion: {
            lat: -31.42,
            lng: -62.11,
        },
        monto: 1000,
        moneda: "ars",
        montoConvertido: 1000,
        observacion: "Bebida juntada",
        
        etiquetas: [0, 1, 4],
        presupuesto: 0,
        tercero: 3,
    }]
});
export type Movimiento = z.infer<typeof Movimiento>;

export const Etiqueta = z.object({
    id: z.number(),

    fechaModificado: z.iso.date(),
    nombre: z.string(),
    oculto: z.boolean(),
    icon: z.string(),
    presupuesto: z.number(),
}).meta({
    id: "Etiqueta",
    description: "Una etiqueta que permite clasificar los Movimientos por una índole, o categorías definidas por el usuario.",
    examples: [{
        id: 0,

        fechaModificado: "2008-04-01T08:00:00.000Z",
        nombre: "Bebida",
        oculto: false,
        icon: "bottle",
        presupuesto: 0,
    }]
});
export type Etiqueta = z.infer<typeof Etiqueta>;

export const Tercero = z.object({
    id: z.number(),

    fechaModificado: z.iso.date(),
    nombre: z.string(),
    ubicacion: LatLng,
    mapsID: z.optional(z.string()),
}).meta({
    id: "Tercero",
    description: "Un negocio o persona con la cual se realiza un Movimiento.",
    examples: [{
        id: 3,

        fechaModificado: "2008-04-01T08:00:00.000Z",
        nombre: "Bar De La Flopi",
        ubicacion: {
            lat: -31.42,
            lng: -62.11,
        },
        mapsID: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
    }]
});
export type Tercero = z.infer<typeof Tercero>;
