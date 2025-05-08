import { browser } from "$app/environment";
import * as pkg from "@googlemaps/js-api-loader";

export default async function initMaps() {
    const loader = new pkg.Loader({
        apiKey: import.meta.env.VITE_GCP_API_KEY,
        version: "weekly",
        libraries: ["core", "maps", "visualization", "marker", "places"],
        region: "AR",
        language: "es"
    });
    
    return {
        core: await loader.importLibrary("core"),
        maps: await loader.importLibrary("maps"),
        visualization: await loader.importLibrary("visualization"),
        marker: await loader.importLibrary("marker"),
        places: await loader.importLibrary("places"),
    }
}

async function loadClientOnly() {
    if (browser) {
        return await initMaps()
    } else {
        return {} as unknown as ReturnType<typeof initMaps>
    }
}

export const { core, maps, visualization, marker, places } = await loadClientOnly();
