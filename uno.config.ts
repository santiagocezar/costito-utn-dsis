import { defineConfig, presetIcons, presetWebFonts, presetWind4, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4(),
        presetIcons({
            scale: 1,
        }),
        presetWebFonts({
            fonts: {
                sans: "Inter"
            }
        }),
    ],
    transformers: [
        transformerDirectives()
    ]
})