import { listMovimientos, getPresupuesto, poblarDB, listEtiquetas } from '$lib/localDb';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
    await poblarDB()
    const presupuesto = await getPresupuesto(parseInt(params.presupuesto))
	return {
        presupuesto,
        movimientos: (await listMovimientos(presupuesto!.id)).reverse(),
        etiquetas: (await listEtiquetas(presupuesto!.id)).reverse()
	};
};