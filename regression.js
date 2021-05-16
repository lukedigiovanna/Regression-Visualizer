
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// linear vars
var slope = 0;
var intercept = 0;

// quadric vars
var a = 0;
var b = 0;
var c = 0;

const n = 5;
var nthTerm = []
for (let i = 0; i < n; i++)
    nthTerm.push(0);

function stepLinearFit(learningRate = 0.0005) {
    let slopeGradient = 0;
    let interceptGradient = 0;
    for (let i = 0; i < data.length; i++) {
        interceptGradient += predictLinear(data[i][0]) - data[i][1];
        slopeGradient += (predictLinear(data[i][0]) - data[i][1]) * data[i][0];
    }
    slope -= slopeGradient * learningRate;
    intercept -= interceptGradient * learningRate * 6;

    drawGraph();
}

async function linearFit(learningRate = 0.0005) {
    for (let i = 0; i < 2000; i++) {
        stepLinearFit(learningRate);
        await sleep(20);
    }
}

function stepQuadricFit(learningRate = 0.000005) {
    let aGradient = 0;
    let bGradient = 0;
    let cGradient = 0;
    for (let i = 0; i < data.length; i++) {
        let r = predictQuadric(data[i][0]) - data[i][1];
        cGradient += r;
        bGradient += r * data[i][0];
        aGradient += r * data[i][0] * data[i][0];
    }
    a -= aGradient * learningRate;
    b -= bGradient * learningRate * 4;
    c -= cGradient * learningRate * 50;

    drawGraph();
}

async function quadricFit(learningRate = 0.000005) {
    for (let i = 0; i < 2000; i++) {
        stepQuadricFit(learningRate);
        await sleep(20);
    }
}

var nthLR = 1;
var lastCost = 0;
var lrIterations = 0;
function stepNthTermFit() {
    let gradient = [];
    for (let i = 0; i < nthTerm.length; i++) {
        gradient.push(0);
    }
    for (let i = 0; i < data.length; i++) {
        let r = predictNthTerm(data[i][0]) - data[i][1];
        for (let j = 0; j < nthTerm.length; j++) {
            gradient[j] += r * Math.pow(data[i][0], j);    
        }
    }

    for (let j = 0; j < nthTerm.length; j++) {
        nthTerm[j] -= gradient[j] * nthLR * Math.pow(50, nthTerm.length - 1 - j);
    }

    let cost = getNthTermCost();
    if (lrIterations > 0 && Math.abs(cost - lastCost) > 1000) {
        nthLR /= 10;
        for (let i = 0; i < nthTerm.length; i++)
            nthTerm[i] = 0;
        lrIterations = 0;
    }
    else {
        lrIterations++;
        lastCost = cost;
    }
    drawGraph();
}

async function nthTermFit() {
    for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < 3000; j++)
        stepNthTermFit();
        await sleep(20);
    }
}

function predictLinear(x) {
    return slope * x + intercept;
}

function predictQuadric(x) {
    return a * x * x + b * x + c;
}

function predictNthTerm(x) {
    let result = 0;
    for (let i = 0; i < nthTerm.length; i++) {
        result += nthTerm[i] * Math.pow(x, i)
    }
    return result;
}

function getLinearCost() {
    let cost = 0;
    for (let i = 0; i < data.length; i++) {
        let residual = predictLinear(data[i][0]) - data[i][1];
        cost += residual * residual;
    }
    return cost;
}

function getQuadricCost() {
    let cost = 0;
    for (let i = 0; i < data.length; i++) {
        let residual = predictQuadric(data[i][0]) - data[i][1];
        cost += residual * residual;
    }
    return cost;
}

function getNthTermCost() {
    let cost = 0;
    for (let i = 0; i < data.length; i++) {
        let residual = predictNthTerm(data[i][0]) - data[i][1];
        cost += residual * residual;
    }
    return cost;
}

const linearCostP = document.getElementById("linear-cost");
const slopeP = document.getElementById("slope");
const interceptP = document.getElementById("intercept");

const quadricCostP = document.getElementById("quadric-cost");
const aP = document.getElementById("quadric-a");
const bP = document.getElementById("quadric-b");
const cP = document.getElementById("quadric-c");

const nthTermCostP = document.getElementById("nth-cost");
const nthEquationP = document.getElementById("nth-equation");

function updateDisplay() {
    linearCostP.innerHTML = Math.round(getLinearCost() * 100) / 100;
    slopeP.innerHTML = Math.round(slope * 100) / 100;
    interceptP.innerHTML = Math.round(intercept * 100) / 100;

    quadricCostP.innerHTML = Math.round(getQuadricCost() * 100) / 100;
    aP.innerHTML = Math.round(a * 100) / 100;
    bP.innerHTML = Math.round(b * 100) / 100;
    cP.innerHTML = Math.round(c * 100) / 100;

    nthTermCostP.innerHTML = Math.round(getNthTermCost() * 100) / 100;
    let s = "y = ";
    for (let i = 0; i < nthTerm.length; i++) {
        s += Math.round(nthTerm[i] * 100) / 100 + "x^" + i;
        if (i < nthTerm.length - 1)
            s += " + ";
    }
    nthEquationP.innerHTML = s;
}