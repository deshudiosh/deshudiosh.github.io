class OrbSpec{
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

        // this.isShaped = false; // TEST TEST

        let i;
        for (let _ = 0; _ < 1000; _++) {
            if(this.isShaped){
                i = fr(SHAPED_COUNT);
                if(OrbSpec.shapedIdxUsed.includes(i) == false) break;
            }
            else{
                i = fr(PLANETS_COUNT);
                if(OrbSpec.planetIdxUsed.includes(i) == false) break;
            }
        }

        this.imgIdx = i;

        if(this.isShaped) OrbSpec.shapedIdxUsed.push(i);
        else OrbSpec.planetIdxUsed.push(i);

    }

    static resetUsed(){
        OrbSpec.planetIdxUsed = [];
        OrbSpec.shapedIdxUsed = [];
    }
}