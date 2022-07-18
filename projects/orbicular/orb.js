class Orb{
    constructor (spec){
        this.rot = r(360);

        this.center = spec.pos;
        this.size = spec.size;
        this.maskPts = spec.maskPts;
        
        this.isShaped = spec.isShaped;
        if(this.isShaped){
            this.imgSafeScale = 1;
        }
        else{
            this.imgSafeScale = 1.1;
        }

        this.imgIdx = spec.imgIdx;
        
        if(spec.ring) this.ring = new Ring(this);
        if(spec.city) this.city = new City(this);
        if(spec.moon) this.moon = new Moon(this);
                
        this.hitbox = new OrbHitbox(this);
    }

    initPostSpawn(){
        let i = this.imgIdx;

        if(this.isShaped){     
            this.img = SHAPED[i].get();      
            this.imgMask = SHAPED_MASKS[i].get();     
        }
        else{       
            this.img = PLANETS[i];    
        }

        // this.img = TEST_IMG;// TEST force colorcheck img

        this.light = new Light(this);

        this.mask = new Mask(this);
        
        this.colors = new OrbColorSampler(this);

        if(this.ring) this.ring.initPostSpawn();
        if(this.city) this.city.initPostSpawn();
        if(this.moon) this.moon.assignColors();
    }

    move(offset){
        this.center.add(offset);

        if(this.ring) this.ring.move(offset);
        if(this.moon) this.moon.move(offset);
        
        this.hitbox = new OrbHitbox(this);
    }

    draw(showOrb = true){
        let pxSize = round(this.size * this.imgSafeScale * RES);

        this.mask.draw(pxSize);

        if(this.city) this.city.drawToGraphics(); 

        push();
        
        let gPlanet = createGraphics(RES, RES);
        this.graphicsToPurge = [gPlanet];
        gPlanet.translate(this.center.x * RES, this.center.y * RES);
        gPlanet.angleMode(DEGREES);
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

        // SHADOW
        let gShadowMask = createGraphics(RES, RES);
        this.graphicsToPurge.push(gShadowMask);
        let xOff = this.light.shadowOffset.x*RES;
        let yOff = this.light.shadowOffset.y*RES;
        gShadowMask.image(this.mask.planet, xOff, yOff);
        if(this.city) gShadowMask.image(this.city.mask, xOff, yOff);
        StackBlur.canvasRGBA(gShadowMask.canvas, 0, 0, RES, RES, this.size*RES/12);
        
        let gShadow = createGraphics(RES, RES);
        this.graphicsToPurge.push(gShadow);
        let shadowCol = color(0, 100);
        gShadow.background(shadowCol);
        gShadow = gShadow.get();
        gShadow.mask(gShadowMask);

        

        if(showOrb){
            image(gShadow, 0, 0);
            
            tint(this.colors.shadowTint);
            image(gDark, 0, 0);
            noTint();            

            image(gBright, 0, 0);
        }

        pop();

        if(this.ring) this.ring.draw();
        
        if(this.moon) this.moon.draw();

        if(this.city) this.city.imagePredrawnToCanvas();

        // this.hitbox.preview();

        // this.colors.preview();
    }

    purge(){
        this.graphicsToPurge.forEach(g => g.remove());
        this.mask.purge();
        if(this.city) this.city.purge();
        if(this.moon) this.moon.purge();
        if(this.ring) this.ring.purge();
    }
}