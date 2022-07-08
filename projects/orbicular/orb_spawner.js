class Spec{
    static planetIdxUsed = []; 
    static shapedIdxUsed = [];

    constructor(){

        // defaults
        this.isShaped = rYesNo(SHAPED_COUNT / PLANETS_COUNT);
        this.maskPts = r(20, 150);
        this.ring = true;
        this.city = rYesNo(.7);
        this.size = .3;
        this.moon = rYesNo();

        this.isShaped = false; // TEST TEST

        let i;
        for (let _ = 0; _ < 1000; _++) {
            if(this.isShaped){
                i = fr(SHAPED_COUNT);
                if(Spec.shapedIdxUsed.includes(i) == false) break;
            }
            else{
                i = fr(PLANETS_COUNT);
                if(Spec.planetIdxUsed.includes(i) == false) break;
            }
        }

        this.imgIdx = i;

        if(this.isShaped) Spec.shapedIdxUsed.push(i);
        else Spec.planetIdxUsed.push(i);

        // this.moon = true; // TEST
    }
}

class OrbSpawner{

    constructor(){
        let mar = .075;
        let m = {"l": mar, "t": mar, "r": 1-mar, "b": 1-mar, "w":1-mar*2, "h":1-mar*2, "size": mar};
        this.margin = m;

        // this.prevRect(m);        
    }


    adjustPosToSizeAndMargin(spec){
        let realSpace = 1 - this.margin.size * 2 - spec.size;
        spec.pos.x = map(spec.pos.x, 0, 1, .5 - realSpace/2, .5 + realSpace/2);
        spec.pos.y = map(spec.pos.y, 0, 1, .5 - realSpace/2, .5 + realSpace/2);
    }


    add(spec){
        let m = this.margin;
        
        let newOrb;
        let orgSize = spec.size;

        let posNotSpecified = !spec.pos;

        let count = 0;

        let scaleMul = 1
        let newPosOk = false;

        // try scaling down if n posistions failed
        for (scaleMul; scaleMul >= 0.5; scaleMul -= 0.05) {
            spec.size = orgSize * scaleMul;

            // try new pos n times  
            for (let posTry = 0; posTry < 5000; posTry++) {
                count++;
                
                if(posNotSpecified) spec.pos = cv(r(), r());

                this.adjustPosToSizeAndMargin(spec);

                newOrb = new Orb(spec);            
                
                //// fit into margin rect - take city into account
                let b = newOrb.hitbox.bounds();
    
                let leftO = m.l - b.l, rightO = b.r - m.r,
                    topO = m.t - b.t, bottomO = b.b - m.b;
    
                let xOff = max(0, leftO) - max(0, rightO);
                let yOff = max(0, topO) - max(0, bottomO);
    
                newOrb.move(cv(xOff, yOff));
                //// --------
                
    
                let collides = false;
                
                for (const oldOrb of ORB_ARR) {
                    collides = newOrb.hitbox.collidesOrb(oldOrb.hitbox, .1);               
                    if(collides) break;
                }
                
                if(!collides){
                    newPosOk = true;
                    break;   
                }

            }

            if(newPosOk){
                break;
            }
        }

        if(newPosOk){
            console.log(`Spawn tries: ${count} \n   scale mult: ${scaleMul.toFixed(2)} \n   final size: ${newOrb.size}`);
            ORB_ARR.push(newOrb);
        }
        else{
            console.log(`Fail: ${count}`);
        }
        // this.prevRect(newOrb.hitbox.bounds())        

        
    }

    prevRect(b){
        push();
        noFill();
        stroke("blue");
        rect(b.l*RES, b.t*RES, b.w*RES, b.h*RES);
        pop();
    }
}