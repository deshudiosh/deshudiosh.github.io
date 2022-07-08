class Moon{
    constructor(orb){
        this.orb = orb;
        this.pos = orb.center.copy();
        
        let width = orb.size * r(1.8, 2.6);
        let heightFactor = 1/r(3, 9);

        this.rot = r([r(-60, 60), r(-20, 20)]);

        let weight = max(orb.size, .2) * .003;

        this.ellipse = {
            width, "height": width*heightFactor, weight};


        let moonPos = cv(0, -width/2);
        moonPos.rotate(r(20, 340));
        // moonPos.rotate(180);
        moonPos.mult(1, heightFactor);
        this.moonPos = moonPos;

        this.imgIdx = fr(STARS_COUNT);
        this.moonSize = orb.size/r(15, 25);
    }

    assignColors(){
        let col = ColorUtils.set(this.orb.col1, {light: 65, sat:20});

        this.ellipse.color = col;
    }

    move(offset){
        this.pos.add(offset);
    }

    draw(){
        // graphics with elipse
        let gOrbit = createGraphics(RES, RES);
        gOrbit.ellipseMode(CENTER);
        gOrbit.noFill();
        gOrbit.translate(this.pos.x * RES, this.pos.y * RES);
        gOrbit.angleMode(DEGREES);
        gOrbit.rotate(this.rot);

        gOrbit.strokeWeight(this.ellipse.weight * RES);
        gOrbit.stroke(this.ellipse.color);
        gOrbit.ellipse(0, 0, this.ellipse.width * RES, this.ellipse.height * RES);
        gOrbit.filter(BLUR, RES/1000);

        // gradient mask on top of everything
        let gradMask = createGraphics(RES, RES);
        let dc = gradMask.drawingContext;
        let g1 = cv(this.ellipse.width/2, 0).rotate(this.rot).add(this.pos),
            g2 = cv(this.ellipse.width/2, 0).rotate(this.rot+180).add(this.pos);
        let gradient = dc.createLinearGradient(g1.x * RES, g1.y * RES, g2.x * RES, g2.y * RES);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        gradient.addColorStop(.3, "rgba(255, 255, 255, 0.25)");
        gradient.addColorStop(.7, "rgba(255, 255, 255, 0.25)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
        dc.fillStyle = gradient;
        gradMask.noStroke();
        gradMask.rect(0, 0, RES, RES);
        // image(gradMask, 0, 0); // TEST
        gOrbit = gOrbit.get();
        gOrbit.mask(gradMask);

        // graphics of the moon img
        let gMoonSize = round(this.moonSize * RES);
        let gMoon = createGraphics(gMoonSize, gMoonSize);
        gMoon.image(STARS[this.imgIdx], 0, 0, gMoonSize, gMoonSize);
        gMoon.filter(GRAY);

        let g = createGraphics(RES, RES);
        g.image(gOrbit, 0, 0);

        g.translate(this.pos.x * RES, this.pos.y * RES);
        g.angleMode(DEGREES);
        g.rotate(this.rot);
        g.imageMode(CENTER);
        let tintCol = ColorUtils.copy(this.ellipse.color);
        tintCol.setAlpha(220);
        g.tint(tintCol); // FIX number as first parameter?
        g.image(gMoon, this.moonPos.x * RES, this.moonPos.y * RES);

        // mask cutting off "behind" the planete
        let mask = createGraphics(RES, RES);
        mask.image(this.orb.mask.planetInverse, 0, 0);
        mask.fill(255);
        mask.noStroke();
        mask.translate(this.pos.x * RES, this.pos.y * RES);
        mask.angleMode(DEGREES);
        mask.rotate(this.rot);
        mask.rect(-RES, 0, RES*2, RES*2);        
        g = g.get();
        g.mask(mask);

        // final draw
        image(g, 0, 0);

    }
}