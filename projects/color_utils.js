class ColorUtils{
    static copy(col){
        colorMode(RGB, 255, 255, 255, 255);
        return color(red(col), green(col), blue(col), alpha(col));
    }

    static colorsEqual(col1, col2){
        let lvlsEqual = JSON.stringify(col1.levels) == JSON.stringify(col2.levels);
        let modesEqual = col1.mode == col2.mode;
        return lvlsEqual && modesEqual;
    }

    static rand(_color, {hue = 0, sat = 0, light = 0}){
        let cHSL = ColorUtils.RGBToHSL(red(_color), green(_color), blue(_color));

        let newHue = cHSL.h;
        newHue += round(r(-hue, hue));
        newHue %= 360;

        let newSat = cHSL.s;
        newSat += round(r(-sat, sat));
        newSat = abs(newSat % 100);

        let newLight = cHSL.l;
        newLight += r(-light, light);
        // newLight = abs(newLight % 100);
        
        colorMode(HSL, 360, 100, 100);
        cHSL = color(newHue, newSat, newLight);

        // console.log(alpha(_color));
        colorMode(RGB, 255, 255, 255, 255);
        let cRGB = color(red(cHSL), green(cHSL), blue(cHSL), alpha(_color));
        return cRGB;
    }

    static set(color_, {hue = undefined, sat = undefined, light = undefined}){
        let cHSL = ColorUtils.RGBToHSL(red(color_), green(color_), blue(color_));

        if(hue === undefined) hue = cHSL.h;
        if(sat === undefined) sat = cHSL.s;
        if(light === undefined) light = cHSL.l;
        
        colorMode(HSL, 360, 100, 100);
        cHSL = color(hue, sat, light);

        colorMode(RGB, 255, 255, 255);
        let cRGB = color(red(cHSL), green(cHSL), blue(cHSL));
        return cRGB;
    }

    static offset(color_, {hue = 0, sat = 0, light = 0}){
        let cHSL = ColorUtils.RGBToHSL(red(color_), green(color_), blue(color_));

        let newHue = cHSL.h + hue;
        newHue %= 360;

        let newSat = cHSL.s + sat;

        let newLight = cHSL.l + light;
        
        colorMode(HSL, 360, 100, 100);
        cHSL = color(newHue, newSat, newLight);
        
        colorMode(RGB, 255, 255, 255);
        let cRGB = color(red(cHSL), green(cHSL), blue(cHSL));
        return cRGB;
    }

    static RGBToHSL(r,g,b) {
        // Make r, g, and b fractions of 1
        r /= 255;
        g /= 255;
        b /= 255;

        // Find greatest and smallest channel values
        let cmin = min(r,g,b),
            cmax = max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta == 0)
        h = 0;
        // Red is max
        else if (cmax == r)
        h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
        h = (b - r) / delta + 2;
        // Blue is max
        else
        h = (r - g) / delta + 4;

        h = round(h * 60);

        // Make negative hues positive behind 360°      
        if (h < 0) h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - abs(2 * l - 1));
        
        // Multiply l and s by 100
        s = +(s * 100).toFixed(0);
        l = +(l * 100).toFixed(0);

        return {h, s, l};
    }
}

