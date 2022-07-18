class OrbSpec{

    constructor(){

        // defaults
        this.isShaped = rYesNo(SHAPED_COUNT / PLANETS_COUNT);
        this.maskPts = r(20, 150);
        this.ring = true;
        this.city = rYesNo(.7);
        this.size = .3;
        this.moon = rYesNo();

        let i;
        for (let _ = 0; _ < 1000; _++) {
            if(this.isShaped){
                i = fr(SHAPED_COUNT);
                if(SHAPED_IDX_USED.includes(i) == false) break;
            }
            else{
                i = fr(PLANETS_COUNT);
                if(PLANET_IDX_USED.includes(i) == false) break;
            }
        }

        this.imgIdx = i;

        if(this.isShaped) SHAPED_IDX_USED.push(i);
        else PLANET_IDX_USED.push(i);
    }

    static resetUsed(){
        PLANET_IDX_USED = [];
        SHAPED_IDX_USED = [];
    }
}