
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const functionsTag = document.getElementById("functions");
const iterations = document.getElementById("iterations");

var functions = []; 

function deleteFunction(index) {
    functions[index].stopTraining = true;
    colors.push(functions[index].color);
    functions.splice(index, 1);
    updateDisplay();
    drawGraph();
}
var colors = ["red","orange","green","blue","magenta"]

function updateDisplay() {
    let s = "<p class='label'>Functions:</p>";
    for (let i = 0; i < functions.length; i++) {
        s+="<p class='label'>"+functions[i].name+" <span style='color:"+functions[i].color+"'>#</span><button class='delete' onmouseover=\"this.style='color:darkred;'\" onmouseout=\"this.style='color:red;'\" onclick=\"deleteFunction("+i+");\">X</button></p>";
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
    var order = parseInt(prompt("What degree?"))
    var name;
    if (order < 0) return;
    else if (order == 0) name = "Constant";
    else if (order == 1) name = "Linear";
    else if (order == 2) name = "Quadric";
    else if (order == 3) name = "Cubic";
    else {
        digit = order % 10;
        var suffix = "th";
        if (digit == 1) suffix = "st";
        else if (digit == 2) suffix = "nd";
        else if (digit == 3) suffix = "rd";
        name = order + suffix + " degree";
    }
    new Regression(name, order + 1);
    updateDisplay();
}


class Regression {
    constructor(name, numberOfTerms) {
        let colorIndex = Math.floor(Math.random()*colors.length)
        this.color = colors[colorIndex];
        colors.splice(colorIndex, 1);
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
        ctx.strokeStyle = this.color;
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
            for (let i = 0; i < parseInt(iterations.value); i++)
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