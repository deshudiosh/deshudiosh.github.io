class Grain{
    constructor(){
        let g = createGraphics(800, 800);
        g.background(128);

        let pxDenSq = sq(g.pixelDensity());
        g.loadPixels();
        for (let y = 0; y < g.height * pxDenSq; y++) {
            for (let x = 0; x < g.width * pxDenSq; x++) {
                let i = (x + y * g.width) * 4;

                let col = color(g.pixels[i + 0], g.pixels[i + 1], g.pixels[i + 2]);
                col = ColorUtils.rand(col, {light:5, hue:10, sat:5});

                g.pixels[i + 0] = red(col);
                g.pixels[i + 1] = green(col);
                g.pixels[i + 2] = blue(col);
            }
        }
        g.updatePixels();
        g.filter(BLUR, g.width/2000);
        this.g = g;
    }

    draw(){
        push();
        blendMode(OVERLAY);

        image(this.g, 0, 0, RES, RES);
        pop();        
    }
}