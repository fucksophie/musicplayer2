import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';

export default defineConfig({
  presets: [presetTailwind(/* options */)],
  /* config */
  darkMode: "class",
  theme: {
    fontFamily: {
      'sans': ['Inter'],
      'serif': ['Inter'],
      'mono': ['Inter'],
    }
  }
});
