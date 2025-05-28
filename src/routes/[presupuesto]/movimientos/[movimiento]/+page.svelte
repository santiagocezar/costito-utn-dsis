<script lang="ts">
    import { fmtMontoSigno } from '$lib';
    import { maps, marker, places } from '$lib/google-maps-init';
    import { getTercero } from '$lib/localDb';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

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
    <h1 class="text-2xl/10">Detalles del movimiento</h1>
    <div use:asMap class="w-full h-72"></div>
    <ul>
        <li><strong>ID:</strong> {mvt.id}</li>
        <li><strong>Fecha:</strong> {new Date(mvt.fecha).toLocaleDateString()}</li>
        <li><strong>Monto:</strong> {fmtMontoSigno(mvt.monto, mvt.moneda)}</li>
        {#if mvt.montoConvertido != undefined}
            <li><strong>Monto convertido:</strong> {fmtMontoSigno(mvt.montoConvertido, "ars")}</li>
        {/if}
        {#if mvt.tercero != undefined}
            {#await getTercero(mvt.tercero)}
                Cargando datos del tercero...
            {:then tercero} 
                <li><strong>Tercero:</strong> {tercero!.nombre}</li>
            {/await}
        {/if}
    </ul>
</main>
