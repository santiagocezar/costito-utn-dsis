<script lang="ts">
    import { fmtMonto } from '$lib';
    import { maps, marker, places } from '$lib/google-maps-init';
    import { getTercero } from '$lib/localDb';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const mvt = data.movimiento!;

    function asMap(node: HTMLElement) {
        const map = new maps.Map(node, {
            center: { lat: mvt.latitud, lng: mvt.longitud },
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
                        position: { lat: tercero.latitud!, lng: tercero.longitud! },
                        label: tercero.nombre
                    })
                } else {
                    const point = new marker.Marker({
                        map,
                        position: { lat: mvt.latitud, lng: mvt.longitud },
                    })
                }
            })
        } else {
            const point = new marker.Marker({
                map,
                position: { lat: mvt.latitud, lng: mvt.longitud },
            })
        }
                        
    }
</script>

<main class="p-4">
    <h1 class="text-2xl/10">Detalles del movimiento</h1>
    <div use:asMap class="w-full h-72"></div>
    <ul>
        <li><strong>ID:</strong> {mvt.id}</li>
        <li><strong>Fecha:</strong> {mvt.fecha.toLocaleDateString()}</li>
        <li><strong>Monto:</strong> {fmtMonto(mvt.monto, mvt.moneda)}</li>
        {#if mvt.montoConvertido != undefined}
            <li><strong>Monto convertido:</strong> {fmtMonto(mvt.montoConvertido, "ars")}</li>
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
