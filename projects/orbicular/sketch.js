let CANVAS, RES, ORB_ARR;

let resizeDelayTimer;
let callPreview = true;
let drawingDone = false;

let TESTING_AUTOSAVE = false;
// TESTING_AUTOSAVE = true; // TEST
let savedImgs = 0;
let saveTotal = 121;

let BG, GRAIN;

let PLANETS_COUNT = 52, SHAPED_COUNT = 12, STARS_COUNT = 12;
let PLANETS = [];
let SHAPED = [], SHAPED_MASKS = [];
let STARS = [];
let TEST_IMG;

let MEASURE = 0;

function preload(){
    pixelDensity(1); 
    frameRate(TESTING_AUTOSAVE ? 5 : 60);
    angleMode(DEGREES);

    randomize(); 

    let texPath = `./projects/orbicular/tex`;

    console.log("VERSION >40<");

    // load all images if testing, load only needed otherwise
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

    for (let i = 0; i < STARS_COUNT; i++) {
        STARS[i] = loadImage(`${texPath}/stars/star_${String(i+1).padStart(2, '0')}.png`);
    }
}

function setup() {
    initalize();
}

function initalize(){
    units();

    RES = 1000; // TEST

    CANVAS = createCanvas(RES, RES);
    CANVAS.parent('drawing'); 

    ORB_ARR.forEach(orb => {
        orb.initPostSpawn();
    });

    BG = new Background();

    GRAIN = new Grain();
}

function draw(){
    if(drawingDone == false){
        if(BG) BG.draw();

        ORB_ARR.forEach(orb => {
            orb.draw();
        });

        if(GRAIN) GRAIN.draw();

        drawingDone = true;
    }

    else{
        if(callPreview){
            fxpreview();
            callPreview = false;
        }
        if(TESTING_AUTOSAVE) autoSaveImg();
    }    
}

function autoSaveImg(){
    if(savedImgs<saveTotal){
        noLoop();
        savedImgs++;
        saveCanvas(`Orb ${SEED}`, "png");
    
        OrbSpec.resetUsed();
        resetDrawing();
        randomize();            
        initalize();
        loop();
    }
}

function resetDrawing(){
    drawingDone = false;
}

function units(){
    RES = min(windowWidth, windowHeight);
    // console.log(`res = ${RES}x${RES}`);
}

function windowResized() {
    clearTimeout(resizeDelayTimer);
    resizeDelayTimer = setTimeout(function() {
        units();
        resizeCanvas(RES, RES, true);
        resetDrawing();
    }, 200);
}

function saveHires(){
    let px = 2000;
    let highres = createGraphics(px, px);

    bg.resetBuffer(px);

    bg.fill(highres)
    leafs.drawHighRes(highres, px);
    bg.draw(highres);

    save(highres, `Padina ${SEED}`, "png");

    resetDrawing();
}

function keyReleased(){
    if(key === "s") saveHires();
}




