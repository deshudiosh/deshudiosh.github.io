let UTIL_START = undefined;
let LOG_TOTAL = 0;

let MIN_FPS = 999;

function drawFPS(){
    push();
    let fps = frameRate().toFixed(2);
    fill(0);
    noStroke();
    rect(0, height-30, 160, 30);
    fill(255);

    if(frameCount > 30) // after first xx frames
        if(fps < MIN_FPS && fps>.1) MIN_FPS = fps;

    text(`FPS: ${fps} : MIN: ${MIN_FPS}`, 10, height - 10);
    pop();
}

function timeStart(){
    UTIL_START = performance.now();
}

function timeEnd(consoleOutput = true){
    let amount = performance.now() - UTIL_START;

    UTIL_START = 0;
    LOG_TOTAL += amount;
    
    if(consoleOutput) console.log("This took: " + amount.toFixed(3) + "ms.")
    
    return amount;
}

function timeLogTotal(){
    console.log("Total time: " + LOG_TOTAL.toFixed(3) + "ms.")
}