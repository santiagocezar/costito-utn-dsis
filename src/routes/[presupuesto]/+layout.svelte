<script lang="ts">
    import { montoTotal } from "$lib/presupuesto";
    import { liveQuery } from "dexie";
    import type { LayoutProps } from "./$types";
    import { SvelteDate } from "svelte/reactivity"
    import { fmtMonto, fmtMontoSigno } from "$lib";
    import { page } from "$app/state";

	let { data, children }: LayoutProps = $props();
    
    const now = new SvelteDate()

    const total = liveQuery(() => montoTotal(data.presupuesto!, now))
    
    const start = Date.parse(data.presupuesto!.inicioPeriodo)

    const proxRenovacion = $derived.by(() => {
        const periodos = Math.ceil((now.getTime() - start) / 1000 / data.presupuesto!.periodoRenovacion)
        return start + data.presupuesto!.periodoRenovacion * 1000 * periodos
    })

    

    const rel = $derived(Math.floor((proxRenovacion - now.getTime()) / 1000 / 24 / 60 / 60))

    const relFmt = new Intl.RelativeTimeFormat(undefined, {
        style: "long",
        numeric: "auto"
    })
</script>

<div class="h-full grid grid-cols-[auto_1fr]">
    <aside class="w-md p-4 flex flex-col">
        <header class="flex flex-col h-60 rounded-2xl bg-pink-600 text-white p-4">
            <h1>{data.presupuesto!.nombre}</h1>
            
            <p class="text-4xl">{$total !== undefined && fmtMonto($total, "ars")}</p>
            <div class="grow"></div>
            <p>Se renueva {relFmt.format(rel, "days")}</p>
        </header>
        <a href="/{data.presupuesto!.id}/movimientos">Movimientos</a>
        <a href="/{data.presupuesto!.id}/etiquetas">Etiquetas</a>
    </aside>
    {@render children()}
</div>