import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';
import * as colors from '@twind/preset-tailwind/colors';

let customColors: Record<string, any> = {
  background: "white",
  innerBackground: colors.slate["200"],
  containerBorder: colors.slate["400"],
  innerBorder: colors.slate["300"],
  hoverInnerBorder: colors.slate["500"],
  innerInnerBackground: colors.slate["400"],
  textColor: "black",
  inputColor: "black",
};

if(document.getElementById('root')!.className.includes("dark")) {
  customColors = {
    "background": colors.neutral["600"],
    "innerInnerBackground": colors.neutral["800"],
    "hoverInnerBorder": colors.neutral["600"],
    "innerBorder": colors.neutral["500"],
    "textColor": colors.neutral["300"],
    "innerBackground": colors.neutral["700"],
    "containerBorder": colors.neutral["500"],
    "inputColor": "black",    
  }
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
