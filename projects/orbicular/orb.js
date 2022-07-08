class Orb{
    constructor (spec){
        
        this.rot = r(360);

        this.center = spec.pos;
        this.size = spec.size;
        this.maskPts = spec.maskPts;
        
        this.isShaped = spec.isShaped;
        if(this.isShaped){
            this.safeScale = 1;
        }
        else{
            this.safeScale = 1.4;
        }

        this.imgIdx = spec.imgIdx;
        
        if(spec.ring) this.ring = new Ring(this);
        if(spec.city) this.city = new City(this);
        if(spec.moon) this.moon = new Moon(this);
                
        this.hitbox = new OrbHitbox(this);
    }

    initPostSpawn(){
        let i = this.imgIdx;
        console.log(`   > ${i}`);

        console.log(`   > pre is shaped`);
        if(this.isShaped){    
            this.img = SHAPED[i].get();
            this.imgMask = SHAPED_MASKS[i].get();
        }
        else{
            this.img = PLANETS[i].get();
        }

        console.log(`   > pre light`);
        this.light = new Light(this);    // TODO: zweryfikuj czy to potrzebne i czy w dobrym misjcy

        console.log(`   > pre mask`);
        this.mask = new Mask(this);

        console.log(`   > pre set colors`);
        this.setColorsFromImg(this.img);      

        console.log(`   > pre ring`);
        if(this.ring) this.ring.assignColors();
        console.log(`   > pre city`);
        if(this.city) this.city.initPostSpawn();
        console.log(`   > pre moon`);
        if(this.moon) this.moon.assignColors();
    }

    move(offset){
        this.center.add(offset);

        if(this.ring) this.ring.move(offset);
        if(this.city) this.city.move(offset);
        if(this.moon) this.moon.move(offset);
        
        this.hitbox = new OrbHitbox(this);
    }

    draw(showOrb = true){
        let pxSize = this.size * this.safeScale * RES;

        this.mask.draw(pxSize);

        if(this.city) this.city.draw(); 

        push();
        
        let gPlanet = createGraphics(RES, RES);
        gPlanet.translate(this.center.x * RES, this.center.y * RES);
        gPlanet.rotate(this.rot);
        gPlanet.imageMode(CENTER);
        gPlanet.image(this.img, 0, 0, pxSize, pxSize);
        // image(temp, 0, 0);

        // BRIGHT
        let gBright = gPlanet.get();
        gBright.mask(this.mask.light);       
        
        // DARK
        let gDark = gPlanet.get();
        gDark.mask(this.mask.planet);
        let darkTint = ColorUtils.set(this.col1, {sat: R_BG_SAT, light: R_BG_LIGHT_MIN});
        darkTint = ColorUtils.set(darkTint, {light:25});

        // SHADOW
        let gShadowMask = createGraphics(RES, RES);
        let xOff = this.light.shadowOffset.x*RES;
        let yOff = this.light.shadowOffset.y*RES;
        gShadowMask.image(this.mask.planet, xOff, yOff);
        if(this.city) gShadowMask.image(this.city.mask, xOff, yOff);
        StackBlur.canvasRGBA(gShadowMask.canvas, 0, 0, RES, RES, this.size*RES/12);
        
        let gShadow = createGraphics(RES, RES);
        let shadowCol = color(0, 100);
        gShadow.background(shadowCol);
        gShadow = gShadow.get();
        gShadow.mask(gShadowMask);

        if(showOrb){
            image(gShadow, 0, 0);
            
            tint(darkTint);
            image(gDark, 0, 0);
            noTint();            

            image(gBright, 0, 0);
        }

        pop();

        if(this.ring) this.ring.draw();
        
        if(this.moon) this.moon.draw();
        
        // this.target.draw();
        // image(this.TEMP_SWATCH, 0, 0);      

        if(this.city) image(this.city.graphics, 0, 0);

        // this.hitbox.preview();
    }

    setColorsFromImg(img){
        let bias = .5; // central part of the image to be used
        let gRes = 100;

        let g = createGraphics(gRes, gRes);
        g.imageMode(CENTER);
        g.angleMode(DEGREES);
        g.translate(gRes/2, gRes/2)
        g.rotate(r(360));
        g.scale(1/bias);
        g.image(img, 0, 0, gRes, gRes);
        g.filter(BLUR, gRes/20);
        this.TEMP_SWATCH = g;

        this.col1 = color(g.get(0, 0));
        this.col2 = color(g.get(gRes-1, gRes-1));
    }
}