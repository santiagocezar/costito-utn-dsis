<script lang="ts">
    import { montoTotal } from "$lib/presupuesto";
    import { liveQuery } from "dexie";
    import type { LayoutProps } from "./$types";
    import { SvelteDate } from "svelte/reactivity"
    import { fmtMonto, fmtMontoSigno } from "$lib";
    import { page } from "$app/state";
    import { Select } from "bits-ui";

	let { data, children }: LayoutProps = $props();

    let y = $state(0)
    let collapsed = $state(false)

    const now = new SvelteDate()

    const total = liveQuery(() => montoTotal(data.presupuesto!, now))
    
    const monto = $derived($total !== undefined && fmtMonto($total, "ars"))

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
    
    function watchScroll(wrapper: HTMLElement) {
        function onScroll() {
            y = wrapper.scrollTop
        }
        wrapper.addEventListener("scroll", onScroll)
        return () => wrapper.removeEventListener("scroll", onScroll)
    }

    function headerCollapse(header: HTMLElement) {
       
        $effect(() => {
            collapsed = y > 176
        })
    }
</script>

<!-- <svelte:window bind:scrollY={y} /> -->

{#snippet budgetSelect()}
    <!-- <Select.Root type="single">
        <Select.Trigger>

            <Select.Viewport class="p-1">
                {#each themes as theme, i (i + theme.value)}
                <Select.Item
                    class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none duration-75 data-[highlighted]:bg-muted data-[disabled]:opacity-50"
                    value={theme.value}
                    label={theme.label}
                    disabled={theme.disabled}
                >
                    {#snippet children({ selected })}
                    {theme.label}
                    {#if selected}
                        <div class="ml-auto">
                        <Check />
                        </div>
                    {/if}
                    {/snippet}
                </Select.Item>
                {/each}
            </Select.Viewport>
        </Select.Trigger>
    </Select.Root> -->
    <select>
        <option value="">{data.presupuesto!.nombre}</option>
    </select>
{/snippet}

{#snippet navItem(to: string, icon: string, label: string)}
    <a class="flex flex-col items-center justify-center" href="/{data.presupuesto!.id}/{to}">
        <div class="{icon} text-3xl"></div>
        <span class="text-xs">{label}</span>
    </a>
{/snippet}

<div class="h-full grid grid-rows-[auto_1fr_auto]">
    {#if page.route.id !== "/[presupuesto]/movimientos"}
        <header class="flex items-center h-16 bg-pink-600 text-white px-3 py-1">
            <button aria-label="Atrás" onclick={() => history.back()} class="px-1 pr-4">
                <div class="i-hugeicons-arrow-left-02 text-3xl"></div>
            </button>
            <h1 class="grow">{data.presupuesto!.nombre}</h1>
            <p class="text-2xl">{monto}</p>
        </header>
    {:else}
        <div></div>
    {/if}
    <div class="overflow-auto relative flex flex-col">
        {#if page.route.id === "/[presupuesto]/movimientos"}
            <header class="h-60 grow-0 shrink-0 m-2 grow flex flex-col rounded-2xl bg-pink-600 text-white p-4">
                <h1>{data.presupuesto!.nombre}</h1>
                
                <p class="text-4xl">{monto}</p>
                <div class="grow"></div>
                <p>Se renueva {relFmt.format(rel, "days")}</p>
            </header>
        {/if}
        {@render children()}
    </div>
    <nav class="mt-a sticky pos-bottom-0 h-20 w-full p-4 grid grid-cols-2 bg-white shadow-2xl">
        {@render navItem("movimientos", "i-hugeicons-arrow-data-transfer-diagonal", "Movimientos")}
        {@render navItem("etiquetas",   "i-hugeicons-tag-01",                       "Etiquetas")}
    </nav>
</div>
