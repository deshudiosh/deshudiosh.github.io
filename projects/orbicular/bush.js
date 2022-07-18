class Bush{
    constructor(city){
        this.city = city;
        let orb = city.orb;
        this.orb = orb;

        let cityWidth = {"min": 1, "max": 0};
        let cityHeight = 0;

        let spawnPoints = [];
        city.buildings.forEach((b, idx) => {
            let pivot = b.pivot.copy().sub(0, b.drawMargin);

            // note spread before rotating
            if(pivot.x < cityWidth.min) cityWidth.min = pivot.x;
            if(pivot.x > cityWidth.max) cityWidth.max = pivot.x;
            cityHeight = max(cityHeight, b.h);

            // rotate around orb center
            pivot.sub(orb.center).rotate(city.rot).add(orb.center);
            
            pivot.randYMult = r(0, 2);
            
            spawnPoints.push(pivot);
        });

        cityWidth = cityWidth.max - cityWidth.min;
        let cityAvgSize = (cityWidth + cityHeight) / 2;
        
        let numPt = cityWidth * 15000;
        let shakeX = cityAvgSize / 2;
        let shakeY = cityHeight / 11;
        let baseWeight = orb.size / 250;


        this.points = [];
        for (let i = 0; i < numPt; i++) {
            let p = r(spawnPoints);
            let noiz = noise(i*2);
            let noiz2 = noise(i/2);
            // console.log(noiz);
            // let shake = cv(
            //     r(-shakeX, shakeX),
            //     r(-shakeY/3, shakeY * p.randYMult)
            // );
            let shake = cv(
                map(noiz, 0, 1, -shakeX, shakeX),
                map(noiz2, 0, 1, -shakeY/2, shakeY),
            );

            shake.rotate(city.rot);
           
            p = p.copy().add(shake);
            
            let x = p.x;
            let y = p.y;
            let weight = baseWeight * r(.75, 1.5);

            let color = ColorUtils.copy(orb.colors.onOrbTop);
            if(city.daytime) {
                color = ColorUtils.set(color, {sat: orb.colors.avgSat *.8});    
                color = ColorUtils.set(color, {light:lightness(color)*.8});
            }
            else{
                let orgLig = lightness(orb.colors.onOrbTop) * (lightness(orb.colors.shadowTint) / 100);
                let lig = lightness(orb.colors.shadowTint)/1.5;
                if(lig > orgLig) lig = orgLig;

                color = ColorUtils.set(color, {light:lig});
                    // sat:saturation(orb.colors.shadowTint)+orb.colors.avgSat/2});
                
                color = ColorUtils.set(color, {sat: max(saturation(orb.colors.shadowTint), orb.colors.avgSat/2)});
                color = ColorUtils.set(color, {hue: orb.colors.avgHue});
            }
            color = ColorUtils.rand(color, {light:15});
            

            color.setAlpha(r(100, 200));

            this.points.push({x, y, color, weight});
        }      
    }

    draw(){
        let g = createGraphics(RES, RES);
        g.angleMode(DEGREES);

        this.points.forEach(p => {
            g.stroke(p.color);
            g.strokeWeight(p.weight * RES);
            // gBush.stroke("red");
            // gBush.strokeWeight(4);
            g.point(p.x * RES, p.y * RES);
        });

        let gImg = g.get();
        gImg.mask(this.orb.mask.planet);

        image(gImg, 0, 0);

        g.remove();
    }
}