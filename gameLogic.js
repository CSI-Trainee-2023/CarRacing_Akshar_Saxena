// Canvas Tools
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Audios and Effects
const sideCrash = new Audio("assets/sideCrash.wav")

// Rendering Images
const obstacleImage = [
    document.querySelector("#truck"),
    document.querySelector("#police")
]
const carImage = document.querySelector('#car')


// initial roadspeed 0 since car is in state of rest
var roadSpeed = 2

// initial position of Obstacle
var yObstacle = -50
var xObstacle = 160


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

i = Math.floor(Math.random() * 2 + 1)

ctx.drawImage(obstacleImage[i-1], xObstacle, yObstacle, 45, 55)
function gameLoop() {
    // obstacle Obstacles
    ctx.clearRect(xObstacle, yObstacle, 45, 55)
    yObstacle+=0.5
    if(yObstacle == 200){
        yObstacle = -50
        i = Math.floor(Math.random() * 2 + 1)
        xObstacle = i == 1?100:160
        
    }
    ctx.drawImage(obstacleImage[i-1], xObstacle, yObstacle, 45, 55)


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

    // checking for collision with Obstacle
    if(yObstacle+55>=yVelocity && yObstacle<=yVelocity+40){
        if(xVelocity+20 > xObstacle && xVelocity < xObstacle+30){
            alert("Game Over")
            ctx.clearRect(xObstacle, yObstacle, 45,55)
            yObstacle = -50
        }
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
