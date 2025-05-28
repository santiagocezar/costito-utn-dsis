<script lang="ts">
    import { cotizacionDolarHistorca, fmtMontoSigno } from "$lib";
    import { putMovimiento } from "$lib/localDb";
    import { Movimiento } from "$lib/schema";
    import { liveQuery } from "dexie";
    // import { getMovimientos, getPresupuestos } from "$lib/localDb";
    // import { liveQuery } from "dexie";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props()

    async function calcularConversion(mvtViejo: Movimiento) {
        const mvt = { ...mvtViejo }
        const conversion = await cotizacionDolarHistorca(new Date(mvt.fecha), "oficial")

        if (mvt.monto < 0) {
            // Si el usuario gasta dolares, se estima que va a comprar más dolares
            // para reponer el gasto, por lo que se usa el valor de Venta. 
            mvt.montoConvertido = mvt.monto * conversion.venta
        } else {
            // Si el usuario recibe dolares, se estima que va a querer venderlos
            // a cambio de pesos, por lo que se usa el valor de Compra. 
            mvt.montoConvertido = mvt.monto * conversion.compra
        }
        
        await putMovimiento(mvt)

        return mvt.montoConvertido
    }
</script>

<div class="flex flex-col p-4 gap-2">
    <a class="bg-blue-600 text-white text-center p-2 text-xl rounded-xl" href="nuevo">Cargar</a>
    {#each data.movimientos as mvt}
        <a href={mvt.id.toString()} class="flex justify-between p-2 rounded-xl bg-gray-100">
            <div class="grow">
                {fmtMontoSigno(mvt.monto, mvt.moneda)}
                {#if mvt.montoConvertido != undefined}
                    ({fmtMontoSigno(mvt.montoConvertido, "ars")})
                {:else if mvt.moneda !== "ars"}
                    {#await calcularConversion(mvt)}
                        (...)
                    {:then monto} 
                        ({fmtMontoSigno(monto, "ars")})
                    {/await}
                {/if}
            </div>
            {new Date(mvt.fecha).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })}
        </a>
    {/each}
</div>