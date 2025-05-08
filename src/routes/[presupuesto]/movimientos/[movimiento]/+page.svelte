<script lang="ts">
    import { maps, marker, places } from '$lib/google-maps-init';
    import { getTercero } from '$lib/localDb';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const movimiento = data.movimiento!;

    function asMap(node: HTMLElement) {
        const map = new maps.Map(node, {
            center: { lat: movimiento.latitud, lng: movimiento.longitud },
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

        if (movimiento.tercero !== undefined) {
            getTercero(movimiento.tercero).then(tercero => {
                if (tercero) {
                    const point = new marker.Marker({
                        map,
                        position: { lat: tercero.latitud!, lng: tercero.longitud! },
                        label: tercero.nombre
                    })
                } else {
                    const point = new marker.Marker({
                        map,
                        position: { lat: movimiento.latitud, lng: movimiento.longitud },
                    })
                }
            })
        } else {
            const point = new marker.Marker({
                map,
                position: { lat: movimiento.latitud, lng: movimiento.longitud },
            })
        }
                        
    }
</script>

<main>
    <h1>Detalles del movimiento</h1>
    <div use:asMap class="w-full h-72"></div>
    <ul>
        <li><strong>ID:</strong> {movimiento.id}</li>
        <li><strong>Fecha:</strong> {movimiento.fecha}</li>
        <li><strong>Monto:</strong> {movimiento.monto}</li>
    </ul>
</main>
