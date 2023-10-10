const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const sideCrash = new Audio("assets/sideCrash.wav")
const carImage = document.querySelector('#car')

var roadSpeed = 2

var xVelocity = 0
var yVelocity = 0

const roadMarks = [
    {
        x: 149,
        y: -10,
        height: "20",
        width: "7"
    },
    {
        x: 149,
        y: 25,
        height: "20",
        width: "7"
    },
    {
        x: 149,
        y: 60,
        height: "20",
        width: "7"
    },
    {
        x: 149,
        y: 95,
        height: "20",
        width: "7"
    },
    {
        x: 149,
        y: 130,
        height: "20",
        width: "7"
    }
]



function gameLoop() {
    for (let i in roadMarks) {
        ctx.clearRect(roadMarks[i].x, roadMarks[i].y, roadMarks[i].width, roadMarks[i].height)
        if (roadMarks[0].y >= -10 && roadMarks[0].y <= 16) {
            roadMarks[i].y += roadSpeed
        }
        else {
            roadMarks[i].y = roadMarks[i].y - 27
        }
        ctx.fillStyle = "white"
        ctx.fillRect(roadMarks[i].x, roadMarks[i].y, roadMarks[i].width, roadMarks[i].height)
    }
    if (xVelocity == 90 || xVelocity == 185) {
        ctx.clearRect(carImage, xVelocity, yVelocity, 30, 45)
        xVelocity = (xVelocity == 90) ? xVelocity + 5 : xVelocity - 5
        sideCrash.play()
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(carImage, xVelocity, yVelocity, 30, 45)
    window.requestAnimationFrame(gameLoop)
}

document.onkeydown = (e) => {
    ctx.clearRect(xVelocity, yVelocity, 30, 45)
    if (e.key == "ArrowRight") {
        xVelocity += 5
    }
    else if (e.key == "ArrowLeft") {
        xVelocity -= 5
    }
    else if (e.key == "ArrowUp") {
        yVelocity -= 5
    }
    else if (e.key == "ArrowDown") {
        yVelocity += 5
    }
    else {
        null
    }
}

window.requestAnimationFrame(gameLoop)
