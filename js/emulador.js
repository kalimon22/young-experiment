var canvas;
var ctx;
var contextWidth;
var contextHeight;
var dragslits = false;
var dragslit = false;
var slits = {
    x: 30,
    size: 10,
    margin: 10,
    initial: 0,
    num: 4
}
var pointslayer = {
    x: 700,
    width: 50
}

function normalize(e) {
    return {
        x: e.offsetX * canvas.width / canvas.clientWidth | 0,
        y: e.offsetY * canvas.height / canvas.clientHeight | 0
    }
}

function isinslits(pos) {
    if (pos.x >= slits.x - 5 && pos.x <= slits.x + slits.size)
        return true
    else return false
}

function isinslit(pos) {
    let step
    if (slits.initial == 0)
        step = (contextHeight - slits.num * slits.size) / (slits.num + 1)
    else
        step = slits.initial
    if ((pos.y >= step && pos.y <= step + slits.size) || (pos.y >= contextHeight - step - slits.size && pos.y <= contextHeight - step))
        return true
    else return false
}

function mousemove(e) {
    pos = normalize(e)
    if (isinslits(pos) || dragslits || dragslit) {
        if (isinslit(pos) || dragslit)
            canvas.style.cursor = "s-resize"
        else
            canvas.style.cursor = "w-resize"
    }
    else canvas.style.cursor = "default"
    if (dragslits && pos.x > slits.margin && pos.x < pointslayer.x - slits.margin)
        slits.x = pos.x
    if (dragslit) {
        console.log("slit")
        if (pos.y > contextHeight / 2 && pos.y < contextHeight - slits.margin && pos.y > contextHeight / 2 + slits.margin)
            slits.initial = contextHeight - pos.y
        if (pos.y < contextHeight / 2 && pos.y > slits.margin && pos.y < contextHeight / 2 - slits.margin)
            slits.initial = pos.y
        console.log(slits.initial)
    }
}

function mousedown(e) {
    pos = normalize(e)
    if (isinslits(pos)) {
        if (isinslit(pos))
            dragslit = true
        else
            dragslits = true;
    }
}

function mouseup(e) {
    dragslits = false;
    dragslit = false;
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function drawslits() {
    let length
    if (slits.initial == 0)
        length = (contextHeight - slits.num * slits.size) / (slits.num + 1)
    else
        length = (contextHeight - 2 * slits.initial - slits.num * slits.size) / (slits.num - 1)
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(81,45,168)";
    ctx.beginPath();
    limit = 0;
    for (i = 0; i <= slits.num; i++) {
        ctx.moveTo(slits.x, limit);
        if ((i == 0 || i == slits.num) && slits.initial != 0)
            step = slits.initial
        else
            step = length
        ctx.lineTo(slits.x, limit + step)
        limit = limit + step + slits.size;
    }
    ctx.stroke();
}

function drawpointslayer() {
    ctx.fillStyle = "rgb(66,66,66)";
    rect(pointslayer.x, 0, pointslayer.width, contextHeight);
}

function drawpoint() {
    let x = Math.floor(Math.random() * (pointslayer.x + pointslayer.width - pointslayer.x)) + pointslayer.x;
    let y = Math.floor(Math.random() * contextWidth)
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, 1, 1)
}

function clear() {
    ctx.clearRect(0, 0, pointslayer.x, contextHeight);
    ctx.clearRect(pointslayer.x + pointslayer.width, 0, contextWidth, contextHeight);
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, pointslayer.x, contextHeight);
    rect(pointslayer.x + pointslayer.width, 0, contextWidth, contextHeight);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    contextWidth = canvas.width;
    contextHeight = canvas.height;
    canvas.addEventListener('mousemove', mousemove)
    canvas.addEventListener('mousedown', mousedown)
    canvas.addEventListener('mouseup', mouseup)
    drawpointslayer();
    return setInterval(draw, 10);
}

function draw() {
    clear();
    drawslits();
    drawpoint();

}

init();
