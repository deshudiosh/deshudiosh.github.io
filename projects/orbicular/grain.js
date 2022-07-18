class Grain{
    static graphics; 

    constructor(){
        if(Grain.graphics == undefined){
            let g = createGraphics(800, 800);
            g.background(128);

            let pxDenSq = sq(g.pixelDensity());
            g.loadPixels();
            for (let y = 0; y < g.height * pxDenSq; y++) {
                for (let x = 0; x < g.width * pxDenSq; x++) {
                    let i = (x + y * g.width) * 4;

                    // SLOWER

                    // let col = color(g.pixels[i + 0], g.pixels[i + 1], g.pixels[i + 2]);
                    // col = ColorUtils.rand(col, {light:5, hue:10, sat:5});
                    // g.pixels[i + 0] = red(col);
                    // g.pixels[i + 1] = green(col);
                    // g.pixels[i + 2] = blue(col);

                    // ----

                    let spread = 40;;
                    let off = r(-spread/2, spread/2);

                    g.pixels[i + 0] += off;
                    g.pixels[i + 1] += off;
                    g.pixels[i + 2] += off;
                }
            }
            g.updatePixels();
            // g.filter(BLUR, g.width/2000);
            StackBlur.canvasRGBA(g.canvas, 0, 0, g.width, g.width, g.width/2000);
            // this.g = g;
            Grain.graphics = g;
        }
    }

    draw(){
        push();
        blendMode(OVERLAY);

        image(Grain.graphics, 0, 0, RES, RES);
        pop();        
    }
}