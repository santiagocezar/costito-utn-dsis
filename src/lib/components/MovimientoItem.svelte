<script lang="ts">
    import { cotizacionDolarHistorca, fmtMontoSigno } from "$lib";
    import { putMovimiento } from "$lib/localDb";
    import type { Etiqueta, Movimiento } from "$lib/schema";

    interface Props {
        movimiento: Movimiento
        etiquetas: Map<number, Etiqueta>
    }

    const { movimiento, etiquetas }: Props = $props()

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


<a href={movimiento.id.toString()} class="flex justify-between p-2 rounded-xl bg-gray-100">
    <div class="grow">
        {fmtMontoSigno(movimiento.monto, movimiento.moneda)}
        {#if movimiento.montoConvertido != undefined}
            ({fmtMontoSigno(movimiento.montoConvertido, "ars")})
        {:else if movimiento.moneda !== "ars"}
            {#await calcularConversion(movimiento)}
                (...)
            {:then monto} 
                ({fmtMontoSigno(monto, "ars")})
            {/await}
        {/if}
    </div>
    <div>
        {#each movimiento.etiquetas as id}
            {@const etq = etiquetas.get(id)!}
            {etq.icon}
        {/each}
        {new Date(movimiento.fecha).toLocaleDateString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })}
    </div>
</a>