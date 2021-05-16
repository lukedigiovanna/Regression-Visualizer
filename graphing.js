const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width, height = canvas.height;
const rect = canvas.getBoundingClientRect();
const cw = rect.right - rect.left;
const ch = rect.bottom - rect.top;

var dragDown = false;
canvas.addEventListener("mousedown", function(event) {
    if (event.button == 1)
        dragDown = true;
});
canvas.addEventListener("mouseup", function(event) {
    dragDown = false;
    if (event.button == 0) {
        var x = event.clientX - rect.left,
            y = ch - event.clientY + rect.top;
        data.push([x / cw * graphWidth + minX, y / ch * graphHeight + minY])
        updateTextArea();
        drawGraph();
    }
});

var lastX, lastY;
canvas.addEventListener("mousemove", function(event) {
   if (dragDown) {
        let dx = (event.clientX - lastX) / cw * graphWidth;
        let dy = (event.clientY - lastY) / ch * graphHeight;
        translateView(-dx, dy);
        drawGraph();
   } 
   lastX = event.clientX;
   lastY = event.clientY;
});

canvas.addEventListener("wheel", function(event) {
    if (event.deltaY < 0)
        zoom(0.95);
    else
        zoom(1.05);
});

var graphWidth = 10, graphHeight = 10;
var minX = -5, maxX = 5, minY = -5, maxY = 5;

// fits the view of the graph to contain just the data
function fitZoom() {
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
    drawGraph();
}

function translateView(dx, dy) {
    maxX += dx;
    minX += dx;
    maxY += dy;
    minY += dy;
}

function zoom(factor) {
    graphWidth *= factor;
    graphHeight *= factor;
    let cx = (minX + maxX) / 2;
    let cy = (minY + maxY) / 2;
    minX = cx - graphWidth / 2;
    maxX = cx + graphWidth / 2;
    minY = cy - graphHeight / 2;
    maxY = cy + graphHeight / 2;
    drawGraph();
}

function xtgx(x) {
    return (x - minX) / graphWidth * width;
}

function ytgy(y) {
    return height - (y - minY) / graphHeight * height;
}

function drawGraph() {
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, width, height);
    retrieveData(); // update the data from the list

    let horizontalPlaces = Math.round(Math.log10(graphWidth));
    let horizontalFactor = Math.pow(10, -(horizontalPlaces - 1));
    let horizontalIncrement = Math.pow(10, horizontalPlaces - 1);
    let startX = Math.round(minX * horizontalFactor) / horizontalFactor;
    for (let x = startX; x < maxX; x += horizontalIncrement) {
        if (x == 0) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgb(50,50,50)";
        } else {
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 2;
        }
        ctx.beginPath();
        ctx.lineTo(xtgx(x), 0);
        ctx.lineTo(xtgx(x), height);
        ctx.stroke();
    }
    let verticalPlaces = Math.round(Math.log10(graphHeight));
    let verticalFactor = Math.pow(10, -(verticalPlaces - 1));
    let verticalIncrement = Math.pow(10, verticalPlaces - 1);
    let startY = Math.round(minY * verticalFactor) / verticalFactor;
    for (let y = startY; y < maxY; y += verticalIncrement) {
        if (y == 0) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgb(50,50,50)";
        } else {
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 2;
        }
        ctx.beginPath();
        ctx.lineTo(0, ytgy(y));
        ctx.lineTo(width, ytgy(y));
        ctx.stroke();
    }

    if (data.length > 0) {
        for (let i = 0; i < functions.length; i++) {
            ctx.strokeStyle = functions[i].color;
            functions[i].draw();
        }

        ctx.fillStyle = "black";
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