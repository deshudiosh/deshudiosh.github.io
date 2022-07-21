///////////////////////////////////
// Created by Pawel Grzelak 2022 //
////// www.pawelgrzelak.com ///////
///////////////////////////////////
/////// ALL RIGHTS RESERVED ///////
///////////////////////////////////

// debugging and testing vars
let TESTING_AUTOSAVE = false;
// TESTING_AUTOSAVE = true; // TEST
let savedImgs = 0, saveTotal = 5;

// sketch vars
let resizeDelayTimer;
let CANVAS, RES, ORB_ARR;
let BG, GRAIN, GRAIN_GRAPHICS, TEST_IMG;

let PLANETS_COUNT = 52, SHAPED_COUNT = 12, STARS_COUNT = 12;
let PLANETS = [];
let SHAPED = [], SHAPED_MASKS = [];
let STARS = [];
let PLANET_IDX_USED = [], SHAPED_IDX_USED = [];

function preload(){
    pixelDensity(1); 
    frameRate(TESTING_AUTOSAVE ? 5 : 60);
    angleMode(DEGREES);

    randomize(); 

    let texPath = `./projects/orbicular/tex`;

    // console.log("VERSION >43<");

    // IMAGE PREALOADING
    // load all images if testing 
    if(TESTING_AUTOSAVE){
        TEST_IMG = loadImage(`${texPath}/colorcheck1.jpg`);

        for (let i = 0; i < PLANETS_COUNT; i++) {
            let img = loadImage(`${texPath}/planets/planet_${String(i+1).padStart(2, '0')}.jpg`);
            PLANETS[i] = img;
        }
        for (let i = 0; i < SHAPED_COUNT; i++) {
            SHAPED[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}.jpg`);
            SHAPED_MASKS[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}_mask.jpg`);
        }
    }
    // load only needed otherwise
    else{
        ORB_ARR.forEach(orb => {
            let i = orb.imgIdx;
            if(orb.isShaped){
                SHAPED[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}.jpg`);
                SHAPED_MASKS[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}_mask.jpg`);
            }
            else{
                PLANETS[i] = loadImage(`${texPath}/planets/planet_${String(i+1).padStart(2, '0')}.jpg`);
            }
        });
    }

    // load stars
    for (let i = 0; i < STARS_COUNT; i++) {
        STARS[i] = loadImage(`${texPath}/stars/star_${String(i+1).padStart(2, '0')}.png`);
    }
}

function setup() {
    initDrawingRoutine();

    fxpreview();
}

function initDrawingRoutine(forcedRES = undefined){
    if(TESTING_AUTOSAVE) forcedRES = 1000;

    updateRES(forcedRES);

    CANVAS = createCanvas(RES, RES);
    CANVAS.parent('drawing'); 

    ORB_ARR.forEach(orb => {
        orb.initPostSpawn();
    });

    BG = new Background();

    GRAIN = new Grain();

    myDrawToCanvas();
}

function myDrawToCanvas(){
    if(BG) BG.draw();

    ORB_ARR.forEach(orb => {
        orb.draw();
    });

    if(GRAIN) GRAIN.draw();
}

function draw(){    
    if(TESTING_AUTOSAVE){
        autoSaveImg();
    }
}

function autoSaveImg(){
    if(savedImgs<saveTotal){
        savedImgs++;
        saveCanvas(`Orb ${SEED}`, "png");
    
        OrbSpec.resetUsed();
        randomize();            
        initDrawingRoutine();
    }
}

function updateRES(forcedRES = undefined){
    if(!forcedRES) RES = min(windowWidth, windowHeight);
    else RES = forcedRES;
}

function windowResized() {
    clearTimeout(resizeDelayTimer);
    resizeDelayTimer = setTimeout(function() {
        updateRES();
        resizeCanvas(RES, RES, true);
        myDrawToCanvas();
    }, 200);
}

function saveHires(){
    let highres_px = 2000;
    initDrawingRoutine(highres_px);

    save(CANVAS, `Orbicular ${SEED}`, "png");

    initDrawingRoutine();
}

function keyReleased(){
    if(key === "s") saveHires();
}




