let CANVAS, RES, ORB_ARR;

let resizeDelayTimer;
let callPreview = true;
let drawingDone = false;

let autoSave = false;
// autoSave = true;
let savedImgs = 0;
let saveTotal = 20;

let BG, GRAIN;

let PLANETS_COUNT = 70, SHAPED_COUNT = 13, STARS_COUNT = 13;
let PLANETS = [];
let SHAPED = [], SHAPED_MASKS = [];
let STARS = [];

let MEASURE = 0;

function preload(){
    pixelDensity(1); 
    frameRate(autoSave ? 10 : 60);
    angleMode(DEGREES);

    randomize(); 

    let texPath = `${PROJECT_PATH}/tex`;

    console.log(texPath);

    console.log('pre planets');

    for (let i = 0; i < PLANETS_COUNT; i++) {
        PLANETS[i] = loadImage(`${texPath}/planets/t_${String(i+1).padStart(2, '0')}.jpg`);
    }

    console.log('pre shaped');
    for (let i = 0; i < SHAPED_COUNT; i++) {
        SHAPED[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}.jpg`);
        SHAPED_MASKS[i] = loadImage(`${texPath}/planets_shaped/shaped_${String(i+1).padStart(2, '0')}_mask.jpg`);
    }

    console.log('pre stars');
    for (let i = 0; i < STARS_COUNT; i++) {
        STARS[i] = loadImage(`${texPath}/stars/star_${String(i+1).padStart(2, '0')}.png`);
    }
}

function setup() {
    console.log('setup');
    init();
}

function init(){
    console.log('pre units');
    units();
    console.log('post units');

    RES = 600; // TEST

    console.log('pre canvas');
    CANVAS = createCanvas(RES, RES);
    CANVAS.parent('drawing'); 
    console.log(CANVAS);
    console.log('post canvas');

    console.log('pre orbs init');
    ORB_ARR.forEach(orb => {
        console.log('   > pre init');
        orb.initPostSpawn();
        console.log('   > post init');
    });

    console.log('pre background');
    BG = new Background();
    // GRAIN = new Grain();
    
}

function draw(){
    if(drawingDone == false){
        console.log('pre bg draw');
        if(BG) BG.draw();

        console.log('pre orbs draw');
        ORB_ARR.forEach(orb => {
            orb.draw();            
        });

        if(GRAIN) GRAIN.draw();

        drawingDone = true;

        console.log("drawing done");
    }

    else{
        if(callPreview){
            fxpreview();
            callPreview = false;
        }
        if(autoSave) autoSaveImg();

        console.log("drawing post");
        noLoop();
    }    
}

function autoSaveImg(){
    if(savedImgs<saveTotal){
        savedImgs++;
        saveCanvas(`Orb ${SEED}`, "png");
        
        resetDrawing();
        randomize();            
        init();    
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




