<script lang="ts">
    import { RadioGroup } from "melt/builders";

    import { places } from "$lib/google-maps-init";
    import { addMovimiento, addTercero, type Tercero } from "$lib/localDb";
    import { onMount } from "svelte";
    import { cotizacionDolar } from "$lib";
    import { page } from "$app/state"    
    import { goto } from "$app/navigation"    
    
    let moneda: "usd" | "ars" = $state("ars")
    let monto = $state(0)
    let signo = $state(-1)

    let pos: google.maps.LatLngLiteral | null = $state(null)

    let searchPlaces: boolean = $state(false)
    let selectedPlace: Omit<Tercero, "id"> | null = $state(null)

    const group = new RadioGroup({
        value: "Egreso",
        orientation: "horizontal",
        onValueChange: (value) => signo = value === "Egreso" ? -1 : 1
    });

    onMount(async () => {
        const { coords } = await getPosition({
            enableHighAccuracy: true
        })

        pos = {
            lat: coords.latitude,
            lng: coords.longitude,
        };
    })

    function getPosition(options?: PositionOptions) {
        return new Promise<GeolocationPosition>((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, options)
            } else {
                reject(new Error("browser doesn't support geolocation"))
            }
        })
    }

    async function buscarLugares(pos: google.maps.LatLngLiteral) {
        const res = await places.Place.searchNearby({
            fields: ['displayName', 'location'],
            locationRestriction: {
                center: pos,
                radius: 100, 
            },
            maxResultCount: 5,
            rankPreference: places.SearchNearbyRankPreference.DISTANCE,
            language: 'es-AR',
            region: 'ar',
        })
        
        return res.places
    }

    async function cargarFormulario() {
        let montoConvertido: number | undefined = undefined
        if (moneda === "usd") {
            try {
                const conversion = await cotizacionDolar("oficial")
    
                if (signo < 0) {
                    // Si el usuario gasta dolares, se estima que va a comprar más dolares
                    // para reponer el gasto, por lo que se usa el valor de Venta. 
                    montoConvertido = monto * signo * conversion.venta
                } else {
                    // Si el usuario recibe dolares, se estima que va a querer venderlos
                    // a cambio de pesos, por lo que se usa el valor de Compra. 
                    montoConvertido = monto * signo * conversion.compra
                }
            } catch (err) {
                // El cálculo quedará pendiente
                console.error(err)
            }
        }

        const tercero = (selectedPlace && await addTercero($state.snapshot(selectedPlace))) ?? undefined

        await addMovimiento({
            fecha: new Date(),
            latitud: pos!.lat,
            longitud: pos!.lng,
            monto: monto * signo,
            moneda,
            montoConvertido: montoConvertido,
            observacion: "",

            etiquetas: [],
            presupuesto: parseInt(page.params.presupuesto),
            indole: undefined,
            tercero: tercero,
        })

        goto("..", {
            invalidateAll: true
        })
    }
</script>

<form class="flex max-h-full h-full overflow-hidden flex-col mx-auto gap-2 p-4 w-full max-w-xl" action="#" onsubmit={cargarFormulario}>
    <div class="flex items-start">
        <select bind:value={moneda} class="text-md bg-none bg-transparent p-2 border-none rounded-xl appearance-none">
            <option value="ars">AR$</option>
            <option value="usd">US$</option>
        </select>
        <input bind:value={monto} class="w-0 grow text-2xl bg-transparent p-2 border-0 border-b-2 ring-0" type="number" name="monto">
    </div>
    <div class="grid grid-cols-2 p-1 rounded-xl bg-gray-200" {...group.root}>
        {#each ["Egreso", "Ingreso"] as metodo}
            {@const item = group.getItem(metodo)}
            <div class={["p-2 grid place-content-center !outline-none ring-blue-600 focus:ring-1 rounded-xl", { "bg-white": item.checked}]} {...item.attrs}>
                {metodo}
            </div>
        {/each}
    </div>
    {#if pos !== null}
        {@const posRef = pos}
        <div class="grow max-h-full flex flex-col overflow-auto">
            {#if searchPlaces}
                {#await buscarLugares(posRef)}
                    <p class="text-xl/10 text-center">
                        Buscando lugares...
                    </p>
                {:then possiblePlaces}
                    {#if possiblePlaces.length}
                        <h2 class="text-xl/10 text-center">Seleccione un lugar</h2>
                        <ul class="flex flex-col gap-2">
                            {#each possiblePlaces as place}
                                <li><button
                                    type="button"
                                    class={["px-4 py-2 rounded-lg whitespace-normal text-left",
                                        (selectedPlace?.mapsID === place.id 
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200")
                                    ]}
                                    onclick={() => selectedPlace = {
                                        nombre: place.displayName ?? "Lugar sin nombre",
                                        latitud: place.location?.lat?.() ?? posRef.lat,
                                        longitud: place.location?.lng?.() ?? posRef.lng,
                                        mapsID: place.id
                                    }}
                                >
                                    {place.displayName}
                                </button></li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-xl/10 text-center">No hay lugares cerca de tu ubicación.</p>
                    {/if}
                {/await}
            {:else}
                <button class="bg-gray-200 w-full p-2 rounded-xl" type="button" onclick={() => searchPlaces = true}>Buscar lugares cerca</button>
            {/if}
        </div>
        <button class="bg-blue-600 text-white p-2 text-xl rounded-xl" type="submit">Cargar</button>
    {:else}
        <p>Active la ubicación</p>
    {/if}
</form>