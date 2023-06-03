// @ts-nocheck
// @ts-ignore
// typescript is a fucking bitch in this file - 
// and i can't bother to fix it..

import * as colors from '@twind/preset-tailwind/colors';

export {colors};

function generateLightDefs(baseColor: string) {
    return {
        background: colors[baseColor]["100"],
        innerBackground: colors[baseColor]["200"],
        containerBorder: colors[baseColor]["400"],
        innerBorder: colors[baseColor]["300"],
        hoverInnerBorder: colors[baseColor]["500"],
        innerInnerBackground: colors[baseColor]["400"],
        textColor: colors[baseColor]["900"],
        inputColor: colors[baseColor]["100"],
    };
}
function generateDarkDefs(baseColor: string) {
    return {
        "background": colors[baseColor]["600"],
        "innerInnerBackground": colors[baseColor]["800"],
        "hoverInnerBorder": colors[baseColor]["600"],
        "innerBorder": colors[baseColor]["500"],
        "textColor": colors[baseColor]["300"],
        "innerBackground": colors[baseColor]["700"],
        "containerBorder": colors[baseColor]["500"],
        "inputColor": colors[baseColor]["300"],    
    }
}
export function generateColors(type: "light"|"dark", baseColor: string|undefined = undefined) {
    let color = baseColor;
    
    if(!colors[color]) {
        color = undefined;
    }

    if(!color) {
        if(type == "light") color = "slate";
        else color = 'neutral';
    }

    if(type == "dark") {
        return generateDarkDefs(color);
    } else if(type == "light") {
        return generateLightDefs(color);
    }
}
