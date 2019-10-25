
document.getElementById("numslits").value = slits.num
document.getElementById("numslits").addEventListener("change", function (ev) {
    slits.num = parseInt(this.value)
    calculateslits()
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
document.getElementById("screen-distance").innerHTML = ((((impactscreen.x - slits.margin) * conversion.x) + conversion.xmin) / 1000).toFixed(2)
document.getElementById("slider-screen-distance").addEventListener("input", function (ev) {
    document.getElementById("screen-distance").innerHTML = ((((impactscreen.x - slits.margin - this.value) * conversion.x) + conversion.xmin) / 1000).toFixed(2)
    slits.x=this.value

})
