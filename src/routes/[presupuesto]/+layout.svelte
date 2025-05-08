<script lang="ts">
    import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<div class="h-full grid grid-rows-[auto_1fr]">
    <header class="flex h-12 bg-gray-200 px-4 items-center">{data.presupuesto!.nombre}</header>
    {@render children()}
</div>