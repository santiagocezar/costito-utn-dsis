<script lang="ts">
    import { cotizacionDolarHistorca, fmtMontoSigno } from "$lib";
    import { putMovimiento } from "$lib/localDb";
    import { Movimiento } from "$lib/schema";
    import { liveQuery } from "dexie";
    // import { getMovimientos, getPresupuestos } from "$lib/localDb";
    // import { liveQuery } from "dexie";
    import type { PageProps } from "./$types";
    import EtiquetaChip from "$lib/components/EtiquetaChip.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import MovimientoItem from "$lib/components/MovimientoItem.svelte";

    const { data }: PageProps = $props()

    const etiquetas = new Map(data.etiquetas.map((etq) => [etq.id, etq]))

    const selectedTags = new SvelteSet<number>()

    const theSelected = $derived(
        data.etiquetas.filter((etq) => !etq.oculto && selectedTags.has(etq.id))
    )

    const theUnselected = $derived(
        data.etiquetas.filter((etq) => !etq.oculto && !selectedTags.has(etq.id))
    )

    function selectTag(id: number) {
        selectedTags.add(id)
    }
    function deselectTag(id: number) {
        selectedTags.delete(id)
    }

    const filtered = $derived(
        selectedTags.size === 0 ? data.movimientos : data.movimientos.filter((mvt) => {
            return mvt.etiquetas.some(id => selectedTags.has(id))
        })
    )
</script>

<div class="flex flex-col p-4 gap-2 pos-relative">
    <div class="flex overflow-auto gap-2">
        {#each theSelected as etq (etq.id)}
            <EtiquetaChip etiqueta={etq} onClick={deselectTag} onDelete={deselectTag} selected={true} />
        {/each}
        {#each theUnselected as etq (etq.id)}
            <EtiquetaChip etiqueta={etq} onClick={selectTag} />
        {/each}
    </div>
    
    {#each filtered as mvt}
        <MovimientoItem movimiento={mvt} etiquetas={etiquetas} />
    {/each}   
</div>
<a aria-label="add" class="self-end mr-4 mt-a aspect-square grid pos-sticky bottom-4 w-12 bg-blue-600 text-white place-content-center center p-2 text-xl rounded-4xl" href="nuevo">
    <div class="i-hugeicons-add-01"></div>
</a>