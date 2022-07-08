class Building{
    constructor(city, pivot, yScale){
        this.city = city;

        let wR = r(.03, .08) * city.scale.x;
        let hR = r(.1, .4) * yScale * city.scale.y;

        let w = wR * city.orb.size;
        let h = hR * city.orb.size;
        this.w = w;
        this.h = h;
        // let s = w * r(.2, .4); //slope

        let m = 0.05; // draw margin
        this.drawMargin = m;
        this.drawSize = createVector(w+m*2, h+m*2);
        
        //slope
        let spin = r(-30, 30); // degrees
        // spin = r(0, 35);
        let bias = map(spin, -45, 45, 0, 1, true);
        this.bias = bias;
        let s = w * .25;
        let sl = s * (1-bias);
        let sr = s * bias;
        let bDiv = 3; // bottom slope divisor  
        
        this.pivot = pivot.copy().add(0, m);

        // construct quads
        let leftV = {};
        leftV.r = w*bias + m;
        leftV.lt = cv(m, sl+m);
        leftV.rt = cv(leftV.r, 0 + m);
        leftV.rb = cv(leftV.r, h + m);
        leftV.lb = cv(0 + m, h-sl/bDiv + m);

        let leftQuad = {"verts": leftV, "main": true, "leftSide": true};
        
        let rightV = {};
        rightV.lt = cv(leftV.r, leftV.rt.y);
        rightV.rt = cv(leftV.r + w*(1-bias), sr + m);
        rightV.rb = cv(leftV.r + w*(1-bias), h-sr/bDiv + m);
        rightV.lb = cv(leftV.r, leftV.rb.y);
        
        let rightQuad = {"verts": rightV, "main": true, "leftSide": false};
        

        this.quads = []

        // spike
        if(r() > .3){
            let sW2 = w/30;
            let sH = h + h * r(.1, .2);
            
            let spikeV = {};
            spikeV.lt = cv(w/2 - sW2 + m, h + m - sH);
            spikeV.rt = cv(w/2 + sW2 + m, h + m - sH);
            spikeV.rb = cv(w/2 + sW2 + m, h + m);
            spikeV.lb = cv(w/2 - sW2 + m, h + m);

            this.quads.push({"verts": spikeV, "spike": true});
        }

        // main quads
        this.quads.push(leftQuad, rightQuad);
        
        // windows
        if(true && r()>.4){
            this.windowSpec = {"parentQuad": bias > .5 ? leftQuad : rightQuad, wR, hR};
        }
    }

    initPostSpawn(){
        if(this.windowSpec)
            this.addWindows();

        this.assignColors();
    }

    assignColors(){
        let brighter = ColorUtils.copy(this.city.orb.col1);
        // col = ColorUtils.set(col, {light:60, sat:5});
        brighter = ColorUtils.rand(brighter, {hue:15, light:5});
        if(!this.city.daytime) brighter = ColorUtils.set(brighter, {light:20})

        let strokeBrighter = ColorUtils.offset(brighter, {light:15});   

        let darker = ColorUtils.copy(this.city.orb.col2);
        darker = ColorUtils.set(darker, {light:20});
        darker = ColorUtils.rand(darker, {hue:10, light:7});
        if(!this.city.daytime) darker = ColorUtils.set(darker, {sat: 10, light:10})

        let strokeDarker = ColorUtils.offset(darker, {light:15});

        let colLeft, strokeLeft, colRight, strokeRight;

        if(this.city.orb.light.ratherLeft){
            colLeft = brighter;
            strokeLeft = strokeBrighter;
            colRight = darker;
            strokeRight = strokeDarker;
        }else{
            colLeft = darker;
            strokeLeft = strokeDarker;
            colRight = brighter;
            strokeRight = strokeBrighter;
        }

        this.quads.forEach(q => {
            if(q.main){
                q.col = q.leftSide ? colLeft : colRight;
                q.stroke = q.leftSide ? strokeLeft : strokeRight;
            }
            if(q.spike){
                let colSpike = this.bias < .5 ? colRight : colLeft;
                let strokeSpike = this.bias < .5 ? strokeRight : strokeLeft;
    
                if(this.city.daytime){
                    colSpike = ColorUtils.offset(colSpike, {light: -20});
                    strokeSpike = ColorUtils.offset(strokeSpike, {light: -20});
                }

                q.col = colSpike;
                q.stroke = strokeSpike;
            }
            if(q.window){
                let winCol;
                if(this.city.daytime){
                    // col = color(255,255,255,120);
                    winCol = ColorUtils.offset(q.parentQuad.col, {light:30});

                    winCol = ColorUtils.rand(winCol, {light:20});
                }
                else{
                    winCol = color(200, 200, 200, 30);
                    
                    if(r() > .75){
                        winCol = color(249, 245, 200, 255);
                    }

                    winCol = ColorUtils.rand(winCol, {light:15});
                }

                q.col = winCol;
            }
        });

    }

    addWindows(){
        let parentQuad = this.windowSpec.parentQuad;
        let wR = this.windowSpec.wR;
        let hR = this.windowSpec.hR;

        let v = parentQuad.verts;

        let xCount = round(wR * 120);
        let xStep = 1/xCount;
        let xW = xStep * .3;
        let xMar = (1 - xW*xCount)/(xCount+1);
        xStep = (1-xMar)/xCount;

        let yCount = xCount * round(hR/wR/2);
        let yStep = 1/yCount;
        let yW = yStep * .4;
        let yMar = (1 - yW*yCount)/(yCount+1);
        yStep = (1-yMar)/yCount;

        for (let y = yMar/2 + yStep/2; y < 1; y+=yStep) {
                
            for (let x = xMar/2 + xStep/2; x < 1; x += xStep) {         
                let lt = p5.Vector.lerp(v.lt, v.rt, x-xW/2);
                let rt = p5.Vector.lerp(v.lt, v.rt, x+xW/2);
                let rb = p5.Vector.lerp(v.lb, v.rb, x+xW/2);
                let lb = p5.Vector.lerp(v.lb, v.rb, x-xW/2);

                let lty = lt.y, lby = lb.y;
                let rty = rt.y, rby = rb.y;

                lt.y = lerp(lty, lby, y-yW/2);
                lb.y = lerp(lty, lby, y+yW/2)

                rt.y = lerp(rty, rby, y-yW/2);
                rb.y = lerp(rty, rby, y+yW/2)

                let verts = {lt, rt, rb, lb};

                this.quads.push({verts, parentQuad, "window": true})
            }       
        }
    }

    getGraphics(){
        let g = createGraphics(round(this.drawSize.x * RES), round(this.drawSize.y * RES));
        // g.stroke(255, 90);
        // g.background(255,0,0,128);
        g.strokeWeight(0.001*RES);

        this.quads.forEach(q => {
            g.fill(q.col);

            if(q.stroke)g.stroke(q.stroke);
            else g.noStroke();

            let lt = q.verts.lt.copy().mult(RES);
            let rt = q.verts.rt.copy().mult(RES);
            let rb = q.verts.rb.copy().mult(RES);
            let lb = q.verts.lb.copy().mult(RES);          

            g.quad(lt.x, lt.y, rt.x, rt.y, rb.x, rb.y, lb.x, lb.y);    
        });

        return g;
    }

    getMask(){
        let mask = createGraphics(round(this.drawSize.x * RES), round(this.drawSize.y * RES));
        mask.strokeWeight(0.001*RES);
        mask.fill(255, 0, 0, 255);
        mask.stroke(255, 0, 0, 255);

        this.quads.forEach(q => {
            if(!q.window){
                let lt = q.verts.lt.copy().mult(RES);
                let rt = q.verts.rt.copy().mult(RES);
                let rb = q.verts.rb.copy().mult(RES);
                let lb = q.verts.lb.copy().mult(RES);          

                mask.quad(lt.x, lt.y, rt.x, rt.y, rb.x, rb.y, lb.x, lb.y);    
            }
        });

        return mask;
    }
}