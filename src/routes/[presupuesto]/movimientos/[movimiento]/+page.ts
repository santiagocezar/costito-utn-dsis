import { getMovimiento } from '$lib/localDb';
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    return {
        movimiento: await getMovimiento(parseInt(params.movimiento))
    }
};