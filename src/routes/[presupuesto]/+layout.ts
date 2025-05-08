import { listMovimientos, getPresupuesto, poblarDB } from '$lib/localDb';
import type { LayoutLoad } from './$types';

export const ssr = false
export const trailingSlash = "always"

export const load: LayoutLoad = async ({ params }) => {
    await poblarDB()
    const presupuesto = await getPresupuesto(parseInt(params.presupuesto))
	return {
        presupuesto,
        movimientos: (await listMovimientos(presupuesto!.id)).reverse()
	};
};