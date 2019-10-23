var canvas;
var ctx;
var contextWidth;
var contextHeight;
var dragslitsX = false;
var dragslitsY = false;
var wavespeed = {
    radio: 0,
    speed: 5,
    moment: 0
}
var slits = {
    x: 30,
    size: 10,
    margin: 10,
    length: 0,
    initial: 0,
    num: 4
}
var screen = {
    x: 700,
    width: 50
}
var conversion = {
    x: 4, //milímetros
    y: 20, //micrómetros
    l: 10, //nanometros
}
var wave = {
    lambda: 480,
    delta: 0
}

function normalize(e) {
    return {
        x: e.offsetX * canvas.width / canvas.clientWidth | 0,
        y: e.offsetY * canvas.height / canvas.clientHeight | 0
    }
}

function isinslitsX(pos) {
    if (pos.x >= slits.x - 5 && pos.x <= slits.x + slits.size)
        return true
    else return false
}

function isinslitsY(pos) {
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
    if (isinslitsX(pos) || dragslitsX || dragslitsY) {
        if (isinslitsY(pos) || dragslitsY)
            canvas.style.cursor = "s-resize"
        else
            canvas.style.cursor = "w-resize"
    }
    else canvas.style.cursor = "default"
    if (dragslitsX && pos.x > slits.margin && pos.x < screen.x - slits.margin)
        slits.x = pos.x
    if (dragslitsY) {
        if (pos.y > contextHeight / 2 && pos.y < contextHeight - slits.margin && pos.y > contextHeight / 2 + slits.margin)
            slits.initial = contextHeight - pos.y
        if (pos.y < contextHeight / 2 && pos.y > slits.margin && pos.y < contextHeight / 2 - slits.margin)
            slits.initial = pos.y
        slits.length = (contextHeight - slits.num * slits.size - 2 * slits.initial) / (slits.num - 1)
    }
}

function mousedown(e) {
    pos = normalize(e)
    if (isinslitsX(pos)) {
        if (isinslitsY(pos))
            dragslitsY = true
        else
            dragslitsX = true;
    }
}

function mouseup(e) {
    dragslitsX = false;
    dragslitsY = false;
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function drawslits() {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(81,45,168)";
    ctx.beginPath();
    limit = 0;
    for (i = 0; i <= slits.num; i++) {
        ctx.moveTo(slits.x, limit);
        if (i == 0 || i == slits.num)
            step = slits.initial
        else
            step = slits.length
        ctx.lineTo(slits.x, limit + step)
        limit = limit + step + slits.size;
    }
    ctx.stroke();
}

function drawpointslayer() {
    ctx.fillStyle = "rgb(66,66,66)";
    rect(screen.x, 0, screen.width, contextHeight);
}

function drawpoint() {
    let x = Math.floor(Math.random() * (screen.x + screen.width - screen.x)) + screen.x;
    let y = Math.floor(Math.random() * contextWidth)
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, 1, 1)
}

function drawwaves() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = "rgb(166,166,166)";
    ctx.lineWidth = 1;
    let radiostep = Math.floor(wave.lambda / conversion.l)
    wavespeed.moment++;
    if (wavespeed.moment == wavespeed.speed) {
        wavespeed.moment = 0
        if (wavespeed.radio >= radiostep)
            wavespeed.radio = 0
        else
            wavespeed.radio++
    }
    let limit = slits.initial
    for (i = 0; i < slits.num; i++) {
        radio = radiostep + wavespeed.radio;
        let varY = limit + Math.round(slits.size / 2)
        while (radio < contextWidth) {
            ctx.beginPath();
            ctx.arc(slits.x, varY, radio, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.stroke();
            radio += radiostep;
        }
        limit = limit + slits.size + slits.length
    }
    ctx.globalCompositeOperation = 'source-over';

}

function clear() {
    ctx.clearRect(0, 0, screen.x, contextHeight);
    ctx.clearRect(screen.x + screen.width, 0, contextWidth, contextHeight);
    ctx.fillStyle = "#FAF7F8";
    rect(screen.x + screen.width, 0, contextWidth, contextHeight);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    contextWidth = canvas.width;
    contextHeight = canvas.height;
    slits.length = (contextHeight - slits.num * slits.size) / (slits.num + 1)
    slits.initial = slits.length;
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
    drawwaves();
}

init();
