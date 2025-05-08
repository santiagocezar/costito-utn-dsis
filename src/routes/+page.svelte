<script lang="ts">
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props()
</script>

<div class="p-4">
    <h1 class="text-2xl/12">Presupuestos</h1>
    <ul>
        {#each data.presupuestos as p}
            <li>
                <a class="underline text-blue-600" href="/{p.id}/movimientos">
                    {p.nombre}
                </a>
            </li>
        {/each}
    </ul>
</div>