class Streak{
    constructor(streaksArr){       
        let start, end;
        
        let firstStreak = streaksArr[0];

        if(!firstStreak){
            start = createVector(r(), r());
            end = createVector(r(), r());
        }
        else{
            let spread = r(.002, .01);
            let offset = cv(spread * r([1, -1]), spread * r([1, -1]));
            start = firstStreak.start.copy().add(offset);
            end = firstStreak.end.copy().add(offset);
        }

        start.diam = .2;
        end.diam = .2;

        this.strokeWeight = .001;
        // only the first will have full weight
        if(firstStreak) this.strokeWeight /= r(6, 10); 


        this.start = start;
        this.end = end;
        this.length = p5.Vector.dist(start, end);

        let midPoint = start.copy().add(end).div(2);
        midPoint.diam = .05;

        this.collisionPoints = [start, end, midPoint];
    }

    draw(){
        push();
        
        let dc = CANVAS.drawingContext;

        let gradient = dc.createLinearGradient(
            floor(this.start.x*RES), floor(this.start.y*RES), 
            floor(this.end.x*RES), floor(this.end.y*RES));
        gradient.addColorStop(0, color(255, 0));
        gradient.addColorStop(.1, color(255, 100));
        gradient.addColorStop(.6, color(255, 100));
        gradient.addColorStop(1, color(255, 0));

        stroke(255);
        strokeWeight(this.strokeWeight * RES);

        dc.strokeStyle = gradient;

        line(this.start.x*RES, this.start.y*RES,
            this.end.x*RES, this.end.y*RES);
        pop();

        // this.previewCollision();
    }

    previewCollision(){
        push();
        strokeWeight(1);
        stroke("red");
        noFill();    
        this.collisionPoints.forEach(p => circle(p.x * RES, p.y * RES, p.diam * RES));
        pop();
    }
}

class Background{
    constructor(){
        this.getColorFromOrb(ORB_ARR[0]);

        // set html body bg color
        select('body').style(
            'background-color',
            ColorUtils.set(this.col1, {light:20}));

        // gradient points
        let x = .6;
        let rot = 90;
        if(R_LIGHT_INV) rot *= -1;

        this.p1 = createVector(x, 0).rotate(R_LIGHT_ROT - rot).add(.5, .5);
        this.p2 = createVector(x, 0).rotate(R_LIGHT_ROT + rot).add(.5, .5);


        this.stars = [];

        for (let i = 0; i < 500; i++) {
            let p = createVector(r(1), r(1));
            let s = r(0.002, 0.004);
            // s *= r(1) > .95 ? 3 : 1;
            let imgIdx = fr(STARS_COUNT);
            let rot = r(360);

            this.stars.push({p, s, imgIdx, rot});
        }


        this.streaks = [];

        for (let i = 0; i < 10000; i++) {
            if(this.streaks.length == R_BG_STREAKS_COUNT) break;

            let s = new Streak(this.streaks);

            if(s.length < .05) continue;

            let collides = false;

            for (const orb of ORB_ARR) {
                collides = orb.hitbox.collidesStreak(s);
                if(collides) break;
            }

            if(!collides){
                this.streaks.push(s)
            }
        }

    }  

    draw(){
        // draw separate graphics?
        let dc = CANVAS.drawingContext;

        let gradient = dc.createLinearGradient(
            floor(this.p1.x*RES), floor(this.p1.y*RES), 
            floor(this.p2.x*RES), floor(this.p2.y*RES));
        gradient.addColorStop(0, this.col2);
        gradient.addColorStop(1, this.col1);
        dc.fillStyle = gradient;
        noStroke();
        rect(0, 0, RES, RES);

        let gStars = createGraphics(RES, RES);
        gStars.imageMode(CENTER);
        this.stars.forEach(star => {
            gStars.push();
            gStars.translate(star.p.x*RES, star.p.y*RES);
            gStars.rotate(star.rot)
            gStars.image(STARS[star.imgIdx], 0, 0, star.s*RES, star.s*RES)
            gStars.pop();
        });
        
        push();
        gStars.filter(GRAY);
        blendMode(DODGE);
        
        // gStars.filter(BLUR, RES/2000);
        image(gStars, 0, 0);
        
        pop()

        this.streaks.forEach(s => s.draw());
        
    }

    getColorFromOrb(orb){
        this.col1 = ColorUtils.set(orb.col1, {sat: R_BG_SAT, light: R_BG_LIGHT_MIN});
        this.col2 = ColorUtils.set(orb.col2, {sat: R_BG_SAT, light: R_BG_LIGHT_MAX});
    }
}