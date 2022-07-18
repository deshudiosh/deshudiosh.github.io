let SEED;

let R_LIGHT_ROT, R_LIGHT_BIAS, R_LIGHT_INV, R_LIGHT_MASK_SHARPNESS;

let R_BG_SAT, R_BG_LIGHT_MIN, R_BG_LIGHT_MAX, R_BG_STREAKS_COUNT, R_BG_STARS_COUNT;

let R_ORBS_SPEC;

function randomize(){
    SEED = floor(10000000+fxrand()*89999999);
    // SEED = 68226679; // used for profiling
    SEED = 21641113;
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

    // STREAKS - fianlly only 0 or 1 streaks, not more;
    R_BG_STREAKS_COUNT = rYesNo(.7) ? 1 : 0;
    // R_BG_STREAKS_COUNT = 5; // TEST

    // STARS
    R_BG_STARS_COUNT = rYesNo(.7) ? 500 : 200;

    /// ORBS
    R_ORBS_SPEC = [];
    let orbCount = r([1, 2, 3]);

    // orbCount = 3; // TEST
    
    let orb1, orb2, orb3;
    switch (orbCount) {
        case 1:
            orb1 = new OrbSpec();
            orb1.size = r(.4, .7);
            // orb1.size = .8; // TEST
            // orb1.pos = cv(.5, .85); // TEST
            orb1.city = true; // TEST
            break;
    
        case 2:            
            orb1 = new OrbSpec();
            orb1.size = r(.3, .6);

            orb2 = new OrbSpec();
            orb2.size = r(.1, .3);
            orb2.ring = rYesNo(.7);

            if(!orb1.city) orb2.city = true;

            break;

        case 3:            
            orb1 = new OrbSpec();
            orb1.size = r(.3, .6);

            orb2 = new OrbSpec();
            orb2.size = r(.1, .3);
            orb2.ring = rYesNo(.7);

            orb3 = new OrbSpec();
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
    ORB_ARR = [];
    R_ORBS_SPEC.forEach(spec => spawner.add(spec));

    let F_COLONIZED = "No";

    // POST SPAWN SMALL PLANETS ADJUSTMENTS
    let small = .1;
    ORB_ARR.forEach(orb => {
        if(orb.size < small){
            orb.city = undefined; // 100% city remove chance
            if(orb.ring && rYesNo()) orb.ring = undefined; // 50% ring remove chance
        }

        if(orb.city) F_COLONIZED = "Yes";
    });

    
    // ORB ORDER
    // ORB_ARR.reverse();
    let order = [0];
    if(ORB_ARR.length == 2) order = [0, 1];
    if(ORB_ARR.length == 3) order = [0, 1, 2];
    order = order.sort(() => 0.5 - r());
    let tempArr = [];
    for (let i = 0; i < ORB_ARR.length; i++) { tempArr.push(ORB_ARR[order[i]]) };
    ORB_ARR = tempArr;


    
    // FEATURES
    let F_COMP = "⬤";
    if(ORB_ARR.length == 2) F_COMP = "⬤ ⬤";
    if(ORB_ARR.length == 3) F_COMP = "⬤ ⬤ ⬤";

    //////////////////////////
    // make features object //
    //////////////////////////
    window.$fxhashFeatures = {
        "Constellation": F_COMP,
        "Colonized": F_COLONIZED
    };

    console.log(window.$fxhashFeatures);
}