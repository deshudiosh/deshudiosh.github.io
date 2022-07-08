class OrbHitbox {
    constructor (orb){        
        this.circles = [];

        this.circles.push({"pos": orb.center, "d": orb.size})

        if(orb.city){
            let builingCircles = [];
            let maxSize = 0;

            orb.city.buildings.forEach(b => {
                
                let pivot = b.pivot.copy().sub(0, b.drawMargin);
                pivot.sub(orb.center);

                let peak = pivot.copy().add(0, -b.h);

                pivot.rotate(orb.city.rot);
                pivot.add(orb.center);

                peak.rotate(orb.city.rot);
                peak.add(orb.center);               

                let midPt = p5.Vector.lerp(pivot, peak, .5);

                let d = b.h;

                builingCircles.push({"pos": midPt, d, "building": true});

                maxSize = max(maxSize, d)
            });

            builingCircles.forEach(c => {if(c.d == maxSize) this.circles.push(c);});
        }

        if(orb.ring){
            let ring = orb.ring;
            let halfDist = (ring.width - orb.size)/2 + orb.size/2;

            let leftStart = cv(halfDist, 0);
            leftStart.rotate(ring.rot+180);
            leftStart.add(orb.center)

            let d = ring.height * .5;

            let leftEnd = leftStart.copy();
            leftEnd.add(cv(d, 0).rotate(ring.rot));

            let leftCenter = p5.Vector.lerp(leftStart, leftEnd, .5);

            let rightCenter = leftCenter.copy();
            rightCenter.sub(orb.center);
            rightCenter.rotate(180);
            rightCenter.add(orb.center);

            this.circles.push({"pos": leftCenter.copy(), "d": d, "ring": true});
            this.circles.push({"pos": rightCenter.copy(), "d": d, "ring": true});

            d = ring.height * .9;

            leftCenter.add(cv(ring.width/6, 0).rotate(ring.rot))
            rightCenter.add(cv(ring.width/6, 0).rotate(ring.rot+180))

            this.circles.push({"pos": leftCenter.copy(), "d": d, "ring": true});
            this.circles.push({"pos": rightCenter.copy(), "d": d, "ring": true});
        }
    }

    bounds(noRing = true){
        let l = Number.POSITIVE_INFINITY, t = l, 
            r = Number.NEGATIVE_INFINITY, b = r;

        this.circles.forEach(c => {
            if(!noRing || !c.ring){
                let x = c.pos.x, y = c.pos.y, rad = c.d/2;

                l = min(l, x - rad);
                r = max(r, x + rad);
                t = min(t, y - rad);
                b = max(b, y + rad);
            }
        });

        let w = r - l, h = b - t;

        return {l, t, r, b, w, h};
    }

    preview(){
        push();
        noFill();
        strokeWeight(1);        

        this.circles.forEach(c => {
            if(c.ring) stroke(0,180,0,200);
            else stroke(255,0,0,200);

            circle(c.pos.x*RES, c.pos.y*RES, c.d*RES);
        });

        pop();
    }

    collidesOrb(other, minDist = 0, ringInclude = true){
        for (let i = 0; i < this.circles.length; i++) {
            const localC = this.circles[i];

            if(!ringInclude && localC.ring) continue;
            
            for (let j = 0; j < other.circles.length; j++) {
                const otherC = other.circles[j];

                if(!ringInclude && otherC.ring) continue;

                let dist = p5.Vector.dist(localC.pos, otherC.pos);
                let radii = (localC.d + otherC.d)/2;

                if(dist < radii + minDist) return true;
            }
        }
        
        return false;
    }

    collidesStreak(streak){
        for (const localC of this.circles){
            for (const colPoint of streak.collisionPoints){

                let dist = p5.Vector.dist(localC.pos, colPoint);
                let radii = (localC.d + colPoint.diam)/2;

                if(dist < radii) return true;
            }
        }
        
        return false;
    }
}