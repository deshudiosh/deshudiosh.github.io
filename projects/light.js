class Light{
    constructor (orb){
        let pos = createVector(0, -R_LIGHT_BIAS * orb.size);
        pos.rotate(R_LIGHT_ROT);
        pos.add(orb.center);
        
        this.pos = pos;

        let shadowOffset = createVector(0, 1);
        shadowOffset.rotate(R_LIGHT_ROT);
        if(R_LIGHT_INV) shadowOffset.mult(-1);        

        shadowOffset.setMag(0.1 * orb.size);

        this.shadowOffset = shadowOffset;

        // this.draw();
        let ratherLeft = !(R_LIGHT_ROT > 0 && R_LIGHT_ROT < 180);
        if(R_LIGHT_INV) ratherLeft = !ratherLeft;
        // console.log(ratherLeft);
        this.ratherLeft = ratherLeft;
    }

    draw(){
        push();
        strokeWeight(10);
        stroke(255, 0, 0);
        point(this.pos.x * RES, this.pos.y * RES);
        pop();
    }
}