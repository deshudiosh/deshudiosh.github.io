class Ring{
    constructor(orb){
        this.orb = orb;
        this.center = orb.center.copy();

        let width = orb.size * r(1.2, 2.2);  
        let heightFactor = 1/r(2.8, 6);
        heightFactor = min(heightFactor, orb.size * .8)
        let height = width * heightFactor;

        this.width = width;
        this.height = height;
        this.heightFactor = heightFactor;
        
        this.rot = r([r(-45, 45), r(-20, 20)]);
    }

    initPostSpawn(){
        let outerW = this.width;
        let innerW = this.orb.size*r(1.1, 1.8); 
        innerW = min(innerW, outerW-.08); // musi byc mniejsze niz najmniejszy mozliwe outerW
        let spread = .004;

        this.ellipses = [];
        for(let w = outerW; w > innerW; w-=spread){
            let h = w * this.heightFactor;

            let weight = .001;

            this.ellipses.push({w, h, weight});
        }

        this.assignColors();
    }

    assignColors(){
        this.ellipses.forEach(e => {
            let col = ColorUtils.set(this.orb.colors.primary, {sat:7});
            if(lightness(col) < 40)
                col = ColorUtils.offset(col, {light:20});
            // col = ColorUtils.rand(col, {sat:20});
            col.setAlpha(r(40,120));

            e.col = col;
        });
    }

    move(offset){
        this.center.add(offset);
    }

    draw(){
        let g = createGraphics(RES, RES);
        g.ellipseMode(CENTER);
        g.noFill();
        g.translate(this.center.x * RES, this.center.y * RES);
        g.angleMode(DEGREES);
        g.rotate(this.rot);

        this.ellipses.forEach(e => {
            g.strokeWeight(e.weight * RES);
            g.stroke(e.col);
            g.ellipse(0, 0, e.w * RES, e.h * RES);
        });

        // g.filter(BLUR, RES/1000);
        StackBlur.canvasRGBA(g.canvas, 0, 0, g.width, g.width, RES/1000);

        let ringMask = createGraphics(RES, RES);
        ringMask.image(this.orb.mask.planetInverse, 0, 0);

        ringMask.fill(255);
        ringMask.noStroke();
        ringMask.translate(this.center.x * RES, this.center.y * RES);
        ringMask.angleMode(DEGREES);
        ringMask.rotate(this.rot);
        ringMask.rect(-RES, 0, RES*2, RES*2);
        // image(ringMask, 0, 0);        

        let gImg = g.get();
        g.remove();
        gImg.mask(ringMask);
        ringMask.remove();

        image(gImg, 0, 0);
    }

}