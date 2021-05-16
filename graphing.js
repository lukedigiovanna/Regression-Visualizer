const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width, height = canvas.height;

canvas.addEventListener("click", function(e){
    rect = canvas.getBoundingClientRect();
    let cw = rect.right - rect.left;
    let ch = rect.bottom - rect.top;
    var x = e.clientX - rect.left,
        y = ch - e.clientY + rect.top;
    data.push([x / cw * graphWidth + minX, y / ch * graphHeight + minY])
    updateTextArea();
    drawGraph();
});

var graphWidth, graphHeight;
var minX, maxX, minY, maxY;

function drawGraph() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    retrieveData(); // update the data from the list
    if (data.length > 0) {
        // find min/max x, y
        minX = data[0][0], maxX = minX;
        minY = data[0][1], maxY = minY;
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] < minX) minX = data[i][0];
            else if (data[i][0] > maxX) maxX = data[i][0];
            if (data[i][1] < minY) minY = data[i][1];
            else if (data[i][1] > maxY) maxY = data[i][1];
        }
        graphWidth = maxX - minX, graphHeight = maxY - minY;
        minX -= 0.1 * graphWidth;
        maxX += 0.1 * graphWidth;
        minY -= 0.1 * graphHeight;
        maxY += 0.1 * graphHeight;
        graphWidth = maxX - minX; 
        graphHeight = maxY - minY;

        // draw regression line
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.lineTo(0, height - (predictLinear(minX) - minY) / graphHeight * height)
        ctx.lineTo(width, height - (predictLinear(maxX) - minY) / graphHeight * height)
        ctx.stroke();

        // draw quadric regression line
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 20) {
            let x = gx / width * graphWidth + minX;
            let y = predictQuadric(x);
            ctx.lineTo(gx, height - (y - minY) / graphHeight * height);
        }
        ctx.stroke();

        // draw nth term regression line
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 5) {
            let x = gx / width * graphWidth + minX;
            let y = predictNthTerm(x);
            ctx.lineTo(gx, height - (y - minY) / graphHeight * height);
        }
        ctx.stroke();

        ctx.fillStyle = "lightgray";
        for (let i = 0; i < data.length; i++) {
            let gx = (data[i][0] - minX) / graphWidth * width;
            let gy = height - (data[i][1] - minY) / graphHeight * height;
            ctx.beginPath();
            ctx.arc(gx, gy, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

drawGraph();