<script lang="ts">
    import type { Etiqueta } from "$lib/schema";

    interface Props {
        etiqueta: Etiqueta
        onDelete?: (id: number) => void
        onClick?: (id: number) => void
    }

    const { etiqueta }: Props = $props()
</script>

<div class="flex rounded-lg h-16">
    <button>
        {etiqueta.icon} {etiqueta.nombre}
    </button>
</div>