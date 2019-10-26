var canvas;
var ctx;
var contextWidth;
var contextHeight;
var dragslitsX = false;
var dragslitsY = false;
var wavespeed = {
    radio: 0,
    speed: 2,
    moment: 0
}
var slits = {
    x: 30,
    size: 10,
    margin: 10,
    length: 0,
    initial: 0,
    num: 2
}
var impactscreen = {
    x: 700,
    width: 50
}
var conversion = {
    x: 8, //milímetros por pixel
    xmin: 500,
    y: 20, //micrómetros por pixel
    l: 8, //nanometros por pixel
}
var wave = {
    lambda: 480,
    delta: 0,
    min: 300,
    max: 800
}

function calculatedistance(pixels) {
    return ((((impactscreen.x - slits.margin - pixels) * conversion.x) + conversion.xmin) / 1000).toFixed(2)
}
function calculateslitslength(pixels) {
    return ((pixels * conversion.y) / 1000).toFixed(2)
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
    if (slits.num != 1) {
        if ((pos.y >= step && pos.y <= slits.initial + slits.size) || (pos.y >= contextHeight - slits.initial - slits.size && pos.y <= contextHeight - step))
            return true
        else return false
    }
}

function mousemove(e) {
    pos = normalize(e)
    if (pos.x < impactscreen.x) {
        let sliderScreenDistance = document.getElementById("slider-screen-distance")
        let screenDistance = document.getElementById("screen-distance")
        if (isinslitsX(pos) || dragslitsX || dragslitsY) {
            if (isinslitsY(pos) || dragslitsY)
                canvas.style.cursor = "s-resize"
            else
                canvas.style.cursor = "w-resize"
        }
        else canvas.style.cursor = "default"
        if (dragslitsX && pos.x > slits.margin && pos.x < (impactscreen.x - slits.margin)) {
            slits.x = pos.x
            sliderScreenDistance.value = pos.x
            screenDistance.innerHTML = calculatedistance(pos.x)
        }
        if (dragslitsY) {
            let sliderslitsdistance = document.getElementById("slider-slits-distance")
            let slitsdistance = document.getElementById("slits-distance")
            if (pos.y > contextHeight / 2 && pos.y < contextHeight - slits.margin && pos.y > contextHeight / 2 + slits.margin)
                slits.initial = contextHeight - pos.y
            if (pos.y < contextHeight / 2 && pos.y > slits.margin && pos.y < contextHeight / 2 - slits.margin)
                slits.initial = pos.y
            slits.length = (contextHeight - slits.num * slits.size - 2 * slits.initial) / (slits.num - 1)
            sliderslitsdistance.value = slits.length
            slitsdistance.innerHTML = calculateslits(slits.length)
        }
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
    rect(impactscreen.x, 0, impactscreen.width, contextHeight);
}

function drawpoint() {
    let x = Math.floor(Math.random() * (impactscreen.x + impactscreen.width - impactscreen.x)) + impactscreen.x;
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
    ctx.clearRect(0, 0, impactscreen.x, contextHeight);
    ctx.fillStyle = "#FAF7F8";
    rect(impactscreen.x + impactscreen.width, 0, contextWidth, contextHeight);
}

function calculateslits() {
    slits.length = (contextHeight - slits.num * slits.size) / (slits.num + 1)
    slits.initial = slits.length;
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    contextWidth = canvas.width;
    contextHeight = canvas.height;
    calculateslits()
    wave.lambda = wave.min
    canvas.addEventListener('mousemove', mousemove)
    canvas.addEventListener('mousedown', mousedown)
    canvas.addEventListener('mouseup', mouseup)
    drawpointslayer();
}

function draw() {
    clear();
    drawslits();
    drawpoint();
    drawwaves();
    requestAnimationFrame(draw)
}

init();
draw();
