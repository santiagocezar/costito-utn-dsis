<script lang="ts">
    import type { Etiqueta } from "$lib/schema";

    interface Props {
        etiqueta: Etiqueta
        selected?: boolean
        onDelete?: (id: number) => void
        onClick?: (id: number) => void
    }

    const { etiqueta, selected, onClick, onDelete}: Props = $props()
</script>

<div class={[
    "flex rounded-4xl border-px",
    selected ? "bg-black border-black text-white"
        : "border-gray"
]}>
    <button type="button" class="flex items-center gap-2 px-2 py-1 grow text-left" onclick={() => onClick?.(etiqueta.id)}>
        <span class="text-lg">
            {etiqueta.icon}
        </span>
        <span>
            {etiqueta.nombre}
        </span>
    </button>
    {#if onDelete}
        <button type="button" class="p-2" onclick={() => onDelete(etiqueta.id)} aria-label="Borrar">
            <div class="i-hugeicons-remove-01"></div>
        </button>
    {/if}
</div>