class OrbColorSampler{
    constructor(orb){
        this.orb = orb;

        let zoom = 1.1; // central part of the image to be used
        let gRes = 300;

        let g = createGraphics(gRes, gRes);
        this.graphics = g;
        g.imageMode(CENTER);
        g.angleMode(DEGREES);
        g.translate(gRes/2, gRes/2)
        g.rotate(orb.rot);
        // g.rotate(175); // TEST
        g.scale(zoom * orb.imgSafeScale);
        g.background(255);
        g.image(orb.img, 0, 0, gRes, gRes);
        // g.filter(BLUR, gRes/50);
        StackBlur.canvasRGBA(g.canvas, 0, 0, g.width, g.width, gRes/50);


        // define sampling circles
        let sampleAngle =  6;
        let sampleLayers = 10;

        let circleDeinitions = [];
        for (let layer = 1; layer <= sampleLayers; layer++) {
            circleDeinitions.push({
                "angle": sampleAngle * (sampleLayers / layer),
                "amp": .45 * (layer/sampleLayers)
            });
        }
        circleDeinitions.reverse();

        // calculate sampling points for each circle
        // if there is a city, rotate samples so first (main) sample will be under city
        let cityRot = orb.city ? orb.city.rot : 0; 

        let points = [cv(.5, .5)];
        circleDeinitions.forEach(cd =>{
            for (let angle = 0; angle < 360; angle += cd.angle) {
                let p = cv(0, -cd.amp).rotate(angle+cityRot).add(.5, .5);
                points.push(p);
            }       
        })

        // TEST force specific sample points
        // points = [cv(.5, .5), cv(0, -.45).add(.5, .5),
        //     cv(0, -.45).rotate(90).add(.5, .5),
        //     cv(0, -.45).rotate(140).add(.5, .5),
        //     cv(0, -.45).rotate(220).add(.5, .5),
        //     cv(0, -.45).rotate(270).add(.5, .5),]; 

        let sampledColors = [];

        points.forEach((p, idx) => {
            let col = color(g.get(round(p.x*gRes), round(p.y*gRes)));

            col._hue = Number(hue(col).toFixed(2));
            col._light = Number(lightness(col).toFixed(2));
            col._sat = Number(saturation(col).toFixed(2));

            sampledColors.push(col);
        });

        // purge canvas
        g.remove();

        // store avarages
        this.avgLight = 0;
        this.avgSat = 0;
        this.avgHue = 0;

        // Find second color farthests from primary, weighting HSL
        let weightHue = 3, weightLight = 1.5, weightSat = 1.5;

        let primIdx = 1, secondIdx, biggestHslDist = -1;
        const firstCol = sampledColors[primIdx];

        for (let i = 0; i < sampledColors.length; i++) {
            if(i == primIdx) continue;

            const curCol = sampledColors[i];

            let hueDist = abs(firstCol._hue - curCol._hue);
            if(hueDist>180) hueDist = 180-(hueDist-180);
            hueDist /= 3.6; // normalize 0-360 to 0-100;

            let lightDist = abs(firstCol._light - curCol._light);

            let satDist = abs(firstCol._sat - curCol._sat);

            // hue+light+sat distance
            let hslDist = hueDist * weightHue + lightDist * weightLight + satDist * weightSat;
            
            if(hslDist > biggestHslDist){
                biggestHslDist = hslDist;
                secondIdx = i;
            }

            // avrages
            this.avgLight += curCol._light;
            this.avgSat += curCol._sat;
            this.avgHue += curCol._hue;
        }

        const secondCol = sampledColors[secondIdx];

        // main colors, primary is brighter, secondary is darker;
        if(firstCol._light > secondCol._light){
            this.primary = firstCol;
            this.secondary = secondCol;    
        }
        else{
            this.primary = secondCol;
            this.secondary = firstCol;
        }

        // additional colors
        this.onOrbTop = firstCol;
        this.shadowTint = ColorUtils.set(this.secondary, {sat: R_BG_SAT, light: 25});

        // avrages
        this.avgLight /= sampledColors.length;
        this.avgSat /= sampledColors.length;
        this.avgHue /= sampledColors.length;

        // preview stuff
        points[primIdx].chosen = true;
        points[secondIdx].chosen = true;
        this.points = points;
    }

    preview(){
        image(this.graphics, 0, 0);
        let gRes = this.graphics.width;

        push();
        resetMatrix();
        stroke('red');
        noFill();
        this.points.forEach(p => {
            strokeWeight(p.chosen ? 5 : 1.5);
            point(p.x * gRes, p.y * gRes);
        });


        stroke(255);
        fill(this.primary);
        rect(0, gRes, gRes/2, gRes/5);
        fill(this.secondary);
        rect(gRes/2, gRes, gRes/2, gRes/5);

        pop();
    }
}