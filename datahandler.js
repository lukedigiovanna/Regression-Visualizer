var data = []

const textarea = document.getElementById("data-text");

textarea.addEventListener('input', function() {
    drawGraph();
}, false);

function retrieveData() {
    data = []
    // get the text from the text area
    let text = textarea.value;
    let points = text.split("\n");
    for (let i = 0; i < points.length; i++) {
        let vals = points[i].split(",");
        if (vals.length == 2) {
            let x = parseFloat(vals[0]);
            let y = parseFloat(vals[1])
            data.push([x, y]);
        }
    }
    updateDisplay();
}

function generateRandom(n = 50, slope = 1, intercept = 0, randomness = 10.0, a = 0, b = 10) {
    data = []
    let string = "";
    for (let i = 0; i < n; i++) {
        let x = Math.random() * (b - a) + a;
        let y = x * slope + intercept + Math.random() * 0.5 * randomness - randomness * 0.5;
        string += Math.round(x*10)/10 + ", " + Math.round(y*10)/10 + "\n";
        data.push([x, y]);
    }
    textarea.value = string;
    drawGraph();
}

function updateTextArea() {
    let string = "";
    for (let i = 0; i < data.length; i++) {
        string += Math.round(data[i][0] * 10) / 10 + ", " + Math.round(data[i][1] * 10) / 10 + "\n";
    }
    textarea.value = string;
}