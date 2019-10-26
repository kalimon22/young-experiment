
function setslitsslider() {
    sliderslitsdistance = document.getElementById("slider-slits-distance")
    if (slits.num == 1) {
        sliderslitsdistance.disabled = true
        document.getElementById("slits-distance").innerHTML = "--"
    }
    else {
        sliderslitsdistance.disabled = false
        sliderslitsdistance.min = 0
        sliderslitsdistance.max = Math.floor((contextHeight - slits.num * slits.size) / (slits.num - 1))
        sliderslitsdistance.value = slits.length
        document.getElementById("slits-distance").innerHTML = calculateslitslength(slits.length)
    }


}
document.getElementById("numslits").value = slits.num
setslitsslider()
document.getElementById("numslits").addEventListener("change", function (ev) {
    slits.num = parseInt(this.value)
    calculateslits()
    setslitsslider()
})
document.getElementById("clean-impacts").addEventListener("click", function (ev) {
    drawpointslayer();
})

document.getElementById("canvas").addEventListener('mousemove', function (ev) {
    pos = normalize(ev)
    if (pos.x > impactscreen.x)
        document.getElementById("position").innerHTML = (((contextHeight / 2 - pos.y) * conversion.y) / 1000).toFixed(2)
})
document.getElementById("slider-screen-distance").min = slits.margin;
document.getElementById("slider-screen-distance").max = impactscreen.x - slits.margin;
document.getElementById("screen-distance").innerHTML = calculatedistance(0)
document.getElementById("slider-screen-distance").addEventListener("input", function (ev) {
    document.getElementById("screen-distance").innerHTML = calculatedistance(this.value)
    slits.x = this.value
})
document.getElementById("slider-screen-distance").addEventListener("change", function (ev) {
    document.getElementById("screen-distance").innerHTML = calculatedistance(this.value)
    slits.x = this.value

})
document.getElementById("slider-wavelength").min = wave.min
document.getElementById("slider-wavelength").value = wave.min
document.getElementById("slider-wavelength").max = wave.max
document.getElementById("wavelength").innerHTML = wave.min
document.getElementById("slider-wavelength").addEventListener("input", function (ev) {
    document.getElementById("wavelength").innerHTML = this.value
    wave.lambda = Math.floor(this.value)
})
document.getElementById("slider-wavelength").addEventListener("change", function (ev) {
    document.getElementById("wavelength").innerHTML = this.value
    wave.lambda = Math.floor(this.value)
})
document.getElementById("slider-slits-distance").addEventListener("input", function (ev) {
    document.getElementById("slits-distance").innerHTML = calculateslitslength(this.value)
    slits.length = Math.floor(this.value)
    slits.initial = Math.floor((contextHeight - slits.num * slits.size - slits.length * (slits.num - 1)) / 2)
})
document.getElementById("slider-slits-distance").addEventListener("change", function (ev) {
    document.getElementById("slits-distance").innerHTML = calculateslitslength(this.value)
    slits.length = Math.floor(this.value)
    slits.initial = Math.floor((contextHeight - slits.num * slits.size - slits.length * (slits.num - 1)) / 2)

})
