<script lang="ts">
    import { page } from "$app/state";
    import { addEtiqueta, listEtiquetas, putEtiqueta } from "$lib/localDb";
    import { liveQuery } from "dexie";
    import { Picker } from 'emoji-picker-element';
    import { Popover } from "bits-ui";
    import EtiquetaChip from "$lib/components/EtiquetaChip.svelte";

    const { data } = $props()

    const etiquetas = liveQuery(() => listEtiquetas(data.presupuesto!.id))

    let icon = $state("🔷")
    let nombre = $state("")

    function emoji(node: Picker) {
        node.addEventListener("emoji-click", (ev) => icon = ev.detail.unicode!)
    }

    function onSubmit(ev: SubmitEvent) {
        ev.preventDefault()
        if (!(ev.target instanceof HTMLFormElement)) {
            return
        }

        const existente = ($etiquetas ?? []).find(v => v.nombre == nombre)
        if (existente !== undefined) {
            putEtiqueta({
                ...existente,
                fechaModificado: new Date().toISOString(),
                icon,
                nombre,
                oculto: false,
            })
        } else {
            addEtiqueta({
                fechaModificado: new Date().toISOString(),
                icon,
                nombre,
                oculto: false,
                presupuesto: parseInt(page.params.presupuesto)
            })
        }

        nombre = ""
    }
</script>

<div class="p-2">
    <div class="flex flex-col gap-2">
        {#each ($etiquetas ?? []) as etq (etq.id)}
            {#if !etq.oculto}
                <EtiquetaChip etiqueta={etq} onDelete={() => putEtiqueta({...etq, oculto: true})} />
                <!-- <li>{etq.icon} {etq.nombre} <button onclick={}>Borrar</button></li> -->
            {/if}
        {/each}
    </div>
    <form class="mt-4 flex w-full gap-2" onsubmit={onSubmit}>
        <Popover.Root>
            <Popover.Trigger class="b-px b-gray rounded-lg text-2xl px-4 py-2">{icon}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Content class="p-2">
                    <emoji-picker {@attach emoji}></emoji-picker>
                </Popover.Content>
            </Popover.Portal>

        </Popover.Root>
        <input bind:value={nombre} class="b-px b-gray rounded-lg text-2xl px-4 py-2 min-w-0" type="text" name="nombre" required>
        
        <button aria-label="add" class="shrink-0 aspect-square grid w-12 bg-blue-600 text-white place-content-center center p-2 text-xl rounded-lg">
            <div class="i-hugeicons-add-01"></div>
        </button>
    </form>
</div>