import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';
import { generateColors, colors } from "./colors";

let customColors;

if(localStorage.theme) {
  let dark = localStorage.dark == "true";

  customColors = generateColors(dark ? "dark" : "light", localStorage.theme||undefined);
} else {
  customColors = generateColors("light");
}

export default defineConfig({
  presets: [presetTailwind({})],
  
  theme: {
    fontFamily: {
      'sans': ['Inter'],
      'serif': ['Inter'],
      'mono': ['Inter'],
    },
    colors: {
      ...colors,
      ...customColors
    }
  }
});
