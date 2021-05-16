
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const functionsTag = document.getElementById("functions");

var functions = []; 

function updateDisplay() {
    let s = "<p class='label'>Functions:</p>";
    for (let i = 0; i < functions.length; i++) {
        s+="<p class='label'>"+functions[i].name+"</p>";
        s+="<button onclick='functions["+i+"].fit();'>Train</button>";
        s+="<button onclick='functions["+i+"].reset();'>Reset</button>";
        s+="<p class='descriptor'>Cost: "+Math.round(functions[i].getCost()*100)/100+"</p>";
        s+="<p class='descriptor'>"+functions[i].getEquation()+"</p>";
    }
    if (functions.length == 0) {
        s += "<p class='label>None</p>";
    }
    functionsTag.innerHTML = s;
}

function addFunction() {
    let order = parseInt(prompt("What degree?"))
    new Regression(order+"th term", order);
    updateDisplay();
}

class Regression {
    
    constructor(name, numberOfTerms) {
        this.color = 'black';
        this.name = name;
        this.terms = []
        for (let i = 0; i < numberOfTerms; i++)
            this.terms.push(0);
        this.learningRate = 0.1;
        this.learningRateIterations = 0;
        this.lastCost = 0;

        this.stopTraining = false;

        functions.push(this);
    }

    draw() {
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 5) {
            let x = gx / width * graphWidth + minX;
            let y = this.predict(x);
            ctx.lineTo(gx, ytgy(y));
        }
        ctx.stroke();
    }

    predict(x) {
        let result = 0;
        for (let i = 0; i < this.terms.length; i++) {
            result += this.terms[i] * Math.pow(x, i)
        }
        return result;
    }

    getCost() {
        let cost = 0;
        for (let i = 0; i < data.length; i++) {
            let residual = this.predict(data[i][0]) - data[i][1];
            cost += residual * residual;
        }
        return cost;
    }

    stepFit() {
        let gradient = [];
        for (let i = 0; i < this.terms.length; i++) {
            gradient.push(0);
        }
        for (let i = 0; i < data.length; i++) {
            let r = this.predict(data[i][0]) - data[i][1];
            for (let j = 0; j < this.terms.length; j++) {
                gradient[j] += r * Math.pow(data[i][0], j);    
            }
        }
    
        for (let j = 0; j < this.terms.length; j++) {
            this.terms[j] -= gradient[j] * this.learningRate * Math.pow(50, this.terms.length - 1 - j);
        }
    
        let cost = this.getCost();
        if (this.learningRateIterations > 0 && Math.abs(cost - this.lastCost) > 1000) {
            this.learningRate /= 10;
            for (let i = 0; i < this.terms.length; i++)
                this.terms[i] = 0;
            this.learningRateIterations = 0;
        }
        else {
            this.learningRateIterations++;
            this.lastCost = cost;
        }

        // find the l2 norm of the gradient
        let l2 = 0;
        for (let i = 0; i < gradient.length; i++) {
            l2 += gradient[i] * gradient[i];
        }
        if (l2 < 0.0000001)
            this.stopTraining = true; // when the gradient is so small, it's negligible

        drawGraph();
    }

    async fit() {
        this.stopTraining = false;
        while (!this.stopTraining) {
            this.stepFit();
            await sleep(20);
        }
    }

    getEquation() {
        let s = "y = ";
        for (let i = 0; i < this.terms.length; i++) {
            s += Math.round(this.terms[i] * 100) / 100 + "x^" + i;
            if (i < this.terms.length - 1)
                s += " + ";
        }
        return s;
    }

    reset() {
        this.learningRate = 0.1;
        for (let i = 0; i < this.terms.length; i++) {
            this.terms[i] = 0;
        }
        this.learningRateIterations = 0;
        this.stopTraining = false;
        drawGraph();
    }
}

/*
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
    linearCostP.innerHTML = Math.round(linearRegression.getCost() * 100) / 100;
    slopeP.innerHTML = Math.round(linearRegression.terms[1] * 100) / 100;
    interceptP.innerHTML = Math.round(linearRegression.terms[0] * 100) / 100;

    quadricCostP.innerHTML = Math.round(quadricRegression.getCost() * 100) / 100;
    aP.innerHTML = Math.round(quadricRegression.terms[2] * 100) / 100;
    bP.innerHTML = Math.round(quadricRegression.terms[1] * 100) / 100;
    cP.innerHTML = Math.round(quadricRegression.terms[0] * 100) / 100;

    nthTermCostP.innerHTML = Math.round(nthTermRegression.getCost() * 100) / 100;
    nthEquationP.innerHTML = nthTermRegression.getEquation();
}
*/