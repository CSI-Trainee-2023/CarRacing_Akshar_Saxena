// Canvas Tools
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Element for score keeping
const span = document.querySelector("#score")

// Audios and Effects
const sideCrash = new Audio("assets/sideCrash.wav")

// Rendering Images
const obstacleImage = [
    document.querySelector("#truck"),
    document.querySelector("#police")
]
const carImage = document.querySelector('#car')

// Score Counter
var scoreCounter = 0

// Records for scores
var records = []

// flag for gameOver
var gameOver = false

// initial roadspeed 0 since car is in state of rest
var roadSpeed = 2

// initial position of Obstacle
var yObstacle = -50
var xObstacle = 100


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

// Randomly generating obstacles and deciding the side of road
i = Math.floor(Math.random() * 2 + 1)

// Initialy generating the obstacle
ctx.drawImage(obstacleImage[i-1], xObstacle, yObstacle, 45, 55)

function gameLoop(ctime) {
    // Creating Obstacles
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
        ctx.clearRect(carImage, xVelocity, yVelocity, 37, 47)
        xVelocity = (xVelocity == 90) ? xVelocity + 5 : xVelocity - 5
        sideCrash.play()
    }

    // checking for collision with Obstacle
    if(yObstacle+55>=yVelocity && yObstacle<=yVelocity+47){
        if(xVelocity+30 > xObstacle && xVelocity < xObstacle+35){
            // sideCrash.play()
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,canvas.width, canvas.height)
            ctx.font = "30px Arial"
            ctx.fillStyle = "red"
            ctx.fillText("Game Over", 75, 80, 600)
            ctx.font = "12px Arial"
            ctx.fillStyle = "green"
            ctx.fillText("Play again", 125, 95, 600)
            window.cancelAnimationFrame(gameLoop)
            // ctx.clearRect(xObstacle, yObstacle, 45,55)
            yObstacle = -50
            records.push(scoreCounter)
            localStorage.setItem('records', records)
            scoreCounter = 0
            gameOver = true
            // Checking for play again button
            canvas.addEventListener('click', (e)=>{
                if(e.offsetX >= canvas.offsetLeft*0.57 && e.offsetX <= canvas.offsetLeft*0.76){
                    if(e.offsetY >= canvas.offsetHeight*0.577 && e.offsetY <= canvas.offsetHeight*0.62){
                        gameOver = false
                        ctx.clearRect(0,0,canvas.width, canvas.height)
                    }
                }
            })
            return null
        }
    }

    // updating the score
    span.textContent = String(scoreCounter).padStart(3,0)
    if(ctime%4==0){
        scoreCounter += 1
    }

    // updating the position of car
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(carImage, xVelocity, yVelocity, 37, 47)
    window.requestAnimationFrame(gameLoop)
}

// Key Controls
document.onkeydown = (e) => {
    if(!gameOver){
        ctx.clearRect(xVelocity, yVelocity, 37, 47)
    }
    // updating the value of xVelocity i.e position of car in X direction
    if (e.key == "ArrowRight") {
        xVelocity += 5
    }
    else if (e.key == "ArrowLeft") {
        xVelocity -= 5
    }
    // updating the value of roadSpeed
    else if (e.key == "ArrowUp") {
        // roadSpeed += 1
        yVelocity -= 5
    }
    else if (e.key == "ArrowDown") {
        // if(roadSpeed > 0){
        //     roadSpeed -= 1
        // }
        yVelocity += 5
    }
    else {
        null
    }
}

if(!gameOver){
    // initiaing GameLoop
    window.requestAnimationFrame(gameLoop)
}
