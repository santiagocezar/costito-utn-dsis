<script lang="ts">
    import { page } from "$app/state";
    import { addEtiqueta, listEtiquetas, putEtiqueta } from "$lib/localDb";
    import { liveQuery } from "dexie";
    import { Picker } from 'emoji-picker-element';

    const etiquetas = liveQuery(() => listEtiquetas())

    let icon = $state("🔷")
    let nombre = $state("generales")

    function emoji(node: Picker) {
        node.addEventListener("emoji-click", (ev) => icon = ev.detail.unicode!)
    }

    function onSubmit(ev: SubmitEvent) {
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

        ev.preventDefault()
        nombre = ""
    }
</script>

<ul>
    {#each ($etiquetas ?? []) as etq (etq.id)}
        {#if !etq.oculto}
            <li>{etq.icon} {etq.nombre} <button onclick={() => putEtiqueta({...etq, oculto: true})}>Borrar</button></li>
        {/if}
    {/each}
    <form onsubmit={onSubmit}>
        <input class="w-12" value={icon} type="text" disabled>
        <input bind:value={nombre} type="text" name="nombre" required>
        <br>
        <emoji-picker {@attach emoji}></emoji-picker>
        <button>Agregar</button>
    </form>
</ul>