import { listPresupuestos, poblarDB } from '$lib/localDb';
import type { PageLoad } from './$types';

export const ssr = false

export const load: PageLoad = async ({ params }) => {
    await poblarDB()
    const presupuestos = await listPresupuestos()
    return {
        presupuestos,
    };
};