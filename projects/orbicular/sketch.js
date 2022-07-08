let CANVAS, RES;

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

    for (let i = 0; i < PLANETS_COUNT; i++) {
        PLANETS[i] = loadImage(`./projects/orbicular/tex/planets/t_${String(i+1).padStart(2, '0')}.jpg`);
    }

    for (let i = 0; i < SHAPED_COUNT; i++) {
        SHAPED[i] = loadImage(`./projects/orbicular/tex/planets_shaped/shaped_${String(i+1).padStart(2, '0')}.jpg`);
        SHAPED_MASKS[i] = loadImage(`./projects/orbicular/tex/planets_shaped/shaped_${String(i+1).padStart(2, '0')}_mask.jpg`);
    }

    for (let i = 0; i < STARS_COUNT; i++) {
        STARS[i] = loadImage(`./projects/orbicular/tex/stars/star_${String(i+1).padStart(2, '0')}.png`);
    }
}

function setup() {
    init();
}

function init(){
    units();

    // RES = 600; // TEST

    CANVAS = createCanvas(RES, RES);
    CANVAS.parent('drawing'); 

    ORBS.forEach(orb => {
        orb.initPostSpawn();
    });

    BG = new Background();
    // GRAIN = new Grain();
    
}

function draw(){
    if(drawingDone == false){
        if(BG) BG.draw();

        ORBS.forEach(orb => {
            
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
        if(autoSave) autoSaveImg();
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




