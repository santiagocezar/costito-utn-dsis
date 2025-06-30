<script lang="ts">
    import { fmtMontoSigno } from '$lib';
    import EtiquetaChip from '$lib/components/EtiquetaChip.svelte';
    import { maps, marker, places } from '$lib/google-maps-init';
    import { getTercero } from '$lib/localDb';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const etiquetas = new Map(data.etiquetas.map((etq) => [etq.id, etq]))

    const mvt = data.movimiento!;

    function asMap(node: HTMLElement) {
        const map = new maps.Map(node, {
            center: mvt.ubicacion,
            disableDefaultUI: true,
            zoom: 16,
            styles: [
                {
                    featureType: "poi",
                    stylers: [
                        { visibility: "off" }
                    ]   
                }
            ]
        });

        const service = new places.PlacesService(map)

        if (mvt.tercero !== undefined) {
            getTercero(mvt.tercero).then(tercero => {
                if (tercero) {
                    const point = new marker.Marker({
                        map,
                        position: tercero.ubicacion,
                        label: tercero.nombre
                    })
                } else {
                    const point = new marker.Marker({
                        map,
                        position: mvt.ubicacion,
                    })
                }
            })
        } else {
            const point = new marker.Marker({
                map,
                position: mvt.ubicacion,
            })
        }
                        
    }
</script>

<main class="p-4">
    <p class="text-xl/6">{new Date(mvt.fecha).toLocaleDateString(undefined, {dateStyle: "long"})}</p>
    <p class="text-3xl/12"> {fmtMontoSigno(mvt.monto, mvt.moneda)}</p>
    {#if mvt.montoConvertido != undefined}
        <p class="text-xl/6">({fmtMontoSigno(mvt.montoConvertido, "ars")})</p>
    {/if}
    <div class="flex flex-wrap gap-2">
        {#each mvt.etiquetas as etq}
            <EtiquetaChip etiqueta={etiquetas.get(etq)} />
        {/each}
    </div>
    {#if mvt.tercero != undefined}
        {#await getTercero(mvt.tercero)}
            Cargando datos del tercero...
        {:then tercero} 
            <li><strong>Tercero:</strong> {tercero!.nombre}</li>
        {/await}
    {/if}
    <div use:asMap class="w-full h-72"></div>
    <ul>
        <li><strong>ID:</strong> {mvt.id}</li>
        <li><strong>Fecha:</strong> {new Date(mvt.fecha).toLocaleDateString()}</li>
    </ul>
</main>
