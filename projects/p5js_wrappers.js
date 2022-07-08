// one letter wrapper over p5js.random()
function r(...args){
    if(args.length == 0){
        return random(1);
    }
    else if(args.length == 1){
        if(typeof(args[0]) == 'number')
            return random(args[0]);
        else if (Array.isArray(args[0]))
            return random([...(args[0])]);
    }
    else if(args.length == 2){
        return random(args[0], args[1]);
    }
    else{
        throw new Error(`r() doesn't support ${args.length} arguments`);
    }
}

function fr(...args){
    return floor(r(...args));
}

function rYesNo(yesChance = .5){
    return r() <= yesChance;
}

function cv(x, y){
    return createVector(x, y);
}