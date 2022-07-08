let SEED;

let R_LIGHT_ROT, R_LIGHT_BIAS, R_LIGHT_INV, R_LIGHT_MASK_SHARPNESS;

let R_BG_SAT, R_BG_LIGHT_MIN, R_BG_LIGHT_MAX, R_BG_STREAKS_COUNT;

let ORBS, R_ORBS_SPEC;

function randomize(){
    SEED = floor(10000000+fxrand()*89999999);
    // SEED = 25374118;
    console.log(`Orb ${SEED}`);
    randomSeed(SEED);
    noiseSeed(SEED);


    /// LIGHT
    let ea = 40; // excluded angle
    R_LIGHT_ROT = fr([r(-0+ea/2, 180-ea/2), r(180+ea/2, 360-ea/2)]);
    R_LIGHT_BIAS = r(.35, 1);
    // R_LIGHT_BIAS = 1; // TEST
    R_LIGHT_MASK_SHARPNESS = map(R_LIGHT_BIAS, .35, 1, .04, .1);
    R_LIGHT_INV = rYesNo();

    // BACKGROUND
    R_BG_SAT = r(2, 10);
    R_BG_LIGHT_MIN = r(6, 10);
    R_BG_LIGHT_MAX = R_BG_LIGHT_MIN + r(12, 20);

    R_BG_STREAKS_COUNT = 0;
    if(rYesNo(.7)) R_BG_STREAKS_COUNT = r([1, fr(2, 6)]);
    // R_BG_STREAKS_COUNT = 1; // TEST

    /// ORBS
    R_ORBS_SPEC = [];
    let orbCount = r([1, 2, 3]);

    // orbCount = 1; // TEST
    
    let orb1, orb2, orb3;
    switch (orbCount) {
        case 1:
            orb1 = new Spec();
            orb1.size = r(.4, .7);
            // orb1.size = .4; // TEST
            // orb1.pos = cv(.5, .5); // TEST
            // orb1.moon = true; // TEST
            break;
    
        case 2:            
            orb1 = new Spec();
            orb1.size = r(.3, .6);

            orb2 = new Spec();
            orb2.size = r(.1, .3);
            orb2.ring = rYesNo(.7);

            if(!orb1.city) orb2.city = true;

            break;

        case 3:            
            orb1 = new Spec();
            orb1.size = r(.3, .6);

            orb2 = new Spec();
            orb2.size = r(.1, .3);
            orb2.ring = rYesNo(.7);

            orb3 = new Spec();
            orb3.size = r(.05, .1);
            orb3.ring = rYesNo();

            if(!orb1.city) orb2.city = true;

            break;
    }

    R_ORBS_SPEC.push(orb1);
    if(orb2) R_ORBS_SPEC.push(orb2);
    if(orb3) R_ORBS_SPEC.push(orb3);

    

    // SPAWN ORBS
    let spawner = new OrbSpawner();
    ORBS = [];
    R_ORBS_SPEC.forEach(spec => spawner.add(spec));

    // POST SPAWN SMALL PLANETS ADJUSTMENTS
    let small = .1;
    ORBS.forEach(orb => {
        if(orb.size < small){
            orb.city = undefined; // 100% city remove chance
            if(orb.ring && rYesNo()) orb.ring = undefined; // 50% ring remove chance
        }
    });

    ORBS.reverse();
    
    
    // FEATURES
    let F_COMP;
    switch (ORBS.length){
        case 1:
            F_COMP = "Alone";
            break;
        case 2:
            F_COMP = "Two Bodies";
            break;
        case 3:
            F_COMP = "Trinity";
            break;
    }

    //////////////////////////
    // make features object //
    //////////////////////////
    window.$fxhashFeatures = {
        "Situation": F_COMP,
    };

    console.log(window.$fxhashFeatures);
}