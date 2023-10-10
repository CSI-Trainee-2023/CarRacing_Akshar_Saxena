// Canvas Tools
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Audios and Effects
const sideCrash = new Audio("assets/sideCrash.wav")

// Rendering Car Image
const carImage = document.querySelector('#car')


// initial roadspeed 0 since car is in state of rest
var roadSpeed = 0


// position of car in X and Y direction
var xVelocity = 105
var yVelocity = 95


// co-ordinates of road
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
    // rendering road
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

    // checking for side crash
    if (xVelocity == 90 || xVelocity == 185) {
        ctx.clearRect(carImage, xVelocity, yVelocity, 30, 45)
        xVelocity = (xVelocity == 90) ? xVelocity + 5 : xVelocity - 5
        sideCrash.play()
    }

    // updating the position of car
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(carImage, xVelocity, yVelocity, 30, 45)
    window.requestAnimationFrame(gameLoop)
}

// Key Controls
document.onkeydown = (e) => {
    ctx.clearRect(xVelocity, yVelocity, 30, 45)
    // updating the value of xVelocity i.e position of car in X direction
    if (e.key == "ArrowRight") {
        xVelocity += 5
    }
    else if (e.key == "ArrowLeft") {
        xVelocity -= 5
    }
    // updating the value of roadSpeed
    else if (e.key == "ArrowUp") {
        roadSpeed += 1
    }
    else if (e.key == "ArrowDown") {
        if(roadSpeed > 0){
            roadSpeed -= 1
        }
    }
    else {
        null
    }
}

// initiaing GameLoop
window.requestAnimationFrame(gameLoop)
