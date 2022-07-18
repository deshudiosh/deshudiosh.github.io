class ShakyCircle{
    constructor (maskPts, center, size){
        this.points = [];

        for (let i = 0; i < 360 ; i += 360/maskPts){
            let p = center.copy().add(
                        size/2 * cos(i),
                        size/2 * sin(i))
            
            let shake = size * .005;
            p.add(r(-shake, shake), r(-shake, shake));
            this.points.push(p);
        }

        this.points = [
            this.points[this.points.length-2].copy(), 
            this.points[this.points.length-1].copy(), 
            ...this.points, 
            this.points[0].copy(), 
            // this.points[1].copy()
        ];
    }

    move(offset){
        this.points.forEach(p => p.add(offset));
    }
}

class Mask{
    constructor (orb){
        this.orb = orb;

        let lightPos = orb.light.pos;
        this.light = lightPos;
        
        let center = orb.center;
        let dist = center.dist(lightPos);
        let size = orb.size;
        let cutSize = map(dist, size/2, size, size*1.7, size*2.2)

        this.fullCircle = new ShakyCircle(orb.maskPts, center, size);
        this.cutterCircle = new ShakyCircle(orb.maskPts, lightPos, cutSize);

        // this.draw();
    }

    move(offset){
        this.fullCircle.move(offset);
        this.cutterCircle.move(offset);
    }

    draw(pxSize){
        let gPlanet = createGraphics(RES, RES);
        this.graphicsToPurge = [gPlanet];
        gPlanet.angleMode(DEGREES);

        // img based mask
        if(this.orb.isShaped){
            gPlanet.translate(this.orb.center.x * RES, this.orb.center.y * RES);
            gPlanet.rotate(this.orb.rot);
            gPlanet.imageMode(CENTER);
            gPlanet.image(this.orb.imgMask, 0, 0, pxSize, pxSize);
    
            // get mask from R to A channel
            let pxDenSq = sq(gPlanet.pixelDensity());
            gPlanet.loadPixels();
            for (let y = 0; y < gPlanet.height * pxDenSq; y++) {
                for (let x = 0; x < gPlanet.width * pxDenSq; x++) {
                    let i = (x + y * width) * 4;
                    gPlanet.pixels[i + 3] = gPlanet.pixels[i];
                }
            }
            gPlanet.updatePixels();
        }
        // code based mask
        else{
            gPlanet.fill(255, 0, 0, 255);
            gPlanet.noStroke();
            gPlanet.beginShape();        
            this.fullCircle.points.forEach(p => gPlanet.curveVertex(p.x * RES, p.y * RES));
            gPlanet.endShape();
        }

        // cutter
        let gCutter = createGraphics(RES, RES);
        this.graphicsToPurge.push(gCutter);
        // gShadow.image(gPlanet, 0, 0);
        gCutter.fill(255, 0, 0, 255);
        gCutter.noStroke();
        gCutter.beginShape();
        this.cutterCircle.points.forEach(p => gCutter.curveVertex(p.x * RES, p.y * RES));
        gCutter.endShape();
        StackBlur.canvasRGBA(gCutter.canvas, 0, 0, gCutter.width, gCutter.width, 
            this.orb.size*RES * R_LIGHT_MASK_SHARPNESS);
        

        this.planet = gPlanet;
        this.planetInverse = this.inverseMask(this.planet);
        

        if(!R_LIGHT_INV){
            let gLightTemp = gPlanet.get();
            gLightTemp.mask(gCutter);
            let gLight = createGraphics(RES, RES);
            this.graphicsToPurge.push(gLight);
            gLight.image(gLightTemp, 0, 0);

            this.light = gLight;
        }
        else{
            let gCutterInverse = this.inverseMask(gCutter);
            // image(gCutterInverse, 0, 0);

            // shadow mask from cut from full planet
            let gShadow = createGraphics(RES, RES);
            this.graphicsToPurge.push(gShadow);
            gShadow.image(gPlanet, 0, 0);
            gShadow = gShadow.get();
            gShadow.mask(gCutterInverse);

            this.light = gShadow;
        }
    }

    inverseMask(maskImg, writeMaskToRGB = false){
        // writeMaskToRGB - SLOW, use for preview testing only

        let g = createGraphics(maskImg.width, maskImg.height);
        this.graphicsToPurge.push(g);
        g.image(maskImg, 0, 0);

        let pxDenSq = sq(g.pixelDensity());
        g.loadPixels();
        for (let y = 0; y < g.height * pxDenSq; y++) {
            for (let x = 0; x < g.width * pxDenSq; x++) {
                let i = (x + y * g.width) * 4;
                if(writeMaskToRGB){
                    g.pixels[i + 0] = map(g.pixels[i + 0], 0, 255, 255, 0);
                    g.pixels[i + 1] = map(g.pixels[i + 1], 0, 255, 255, 0);
                    g.pixels[i + 2] = map(g.pixels[i + 2], 0, 255, 255, 0);
                }
                g.pixels[i + 3] = map(g.pixels[i + 3], 0, 255, 255, 0);
            }
        }
        g.updatePixels();

        return g;
    }

    purge(){
        this.graphicsToPurge.forEach(g => g.remove());
    }
}