// Canvas Tools
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Element for score keeping
const span = document.querySelector("#score")

// Audios and Effects
const sideCrash = new Audio("assets/sideCrash.wav")
const gameSound = new Audio("assets/gameMusic.mp3")

// Rendering Images
const obstacleImage = [
    document.querySelector("#truck"),
    document.querySelector("#police")
]
const carImage = document.querySelector('#car')

// Score Counter
var scoreCounter = 0
const recentScores = document.querySelector(".recentScores")

// Increasing Difficulty
var scoreMultiplier = 4
var obstacleSpeed = 1
var levelFlag = false


// Records for scores
var records = []
var previousRecords

// Checking for previous records and displaying it with high score being highlighted
try{
    previousRecords = localStorage.getItem('records')
    previousRecords = previousRecords.split(",")
    var highScore = Math.max(...previousRecords)
    previousRecords.forEach(element => {
        recentScores.innerHTML += `<div class="recordDisplay">${element}</div>`
        if(element == highScore){
            document.querySelectorAll(".recordDisplay").forEach(e => {
                if(e.textContent == highScore){
                    e.style.order = '2'
                    e.style.backgroundColor = "yellow"
                }
            });
        }
    });
}
catch(e){
    previousRecords = []
    console.log(e)
}

// flag for gameOver
var gameOver = false

// flag for gameOn
var gameOn = false

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

// Press space to play
ctx.fillStyle = "#71727287"
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.font = "13px Cambria"
ctx.fillStyle = "orange"
ctx.fillText("Press space to play", canvas.width/2-48, canvas.height/2+5, 1000)


// Playing the game background music
gameSound.play()

function gameLoop(ctime) {
    // Repeating the game background music on loop
    gameSound.play()

    // Updating gameOn to true and game started
    gameOn = true

    // Creating Obstacles
    ctx.clearRect(xObstacle, yObstacle, 45, 55)
    yObstacle+=obstacleSpeed
    if(yObstacle >= 200){
        yObstacle = -50
        // Random value for deciding the side of road
        i = Math.floor(Math.random() * 2 + 1)
        xObstacle = i == 1?100:160        
        // Random value for creating the obstacle
        i = Math.floor(Math.random() * 2 + 1)
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
            sideCrash.play()
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,canvas.width, canvas.height)
            ctx.font = "30px Arial"
            ctx.fillStyle = "red"
            ctx.fillText("Game Over", 75, 80, 600)
            ctx.font = "12px Arial"
            ctx.fillStyle = "green"
            ctx.fillText("Play again", 125, 95, 600)
            window.cancelAnimationFrame(gameLoop)
            yObstacle = -50
            records.push(scoreCounter)
            records.forEach(element => {
                recentScores.innerHTML += `<div class="recordDisplay">${element}</div>`
            });
            previousRecords.push(records)
            localStorage.setItem('records', previousRecords)
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
    if(Math.round(ctime)%scoreMultiplier==0){
        scoreCounter += 1
    }

    // Increasing Difficulty
    if(ctime >= 15000 && !levelFlag){
        levelFlag = true
        obstacleSpeed = 2
        roadSpeed = 4
        scoreMultiplier = 2
    }

    // updating the position of car
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(carImage, xVelocity, yVelocity, 37, 47)
    window.requestAnimationFrame(gameLoop)
}

// Key Controls
window.addEventListener('keydown', (e) => {
    e.preventDefault()
    if(!gameOver && gameOn){
        ctx.clearRect(xVelocity, yVelocity, 37, 47)
    }

    // updating the value of xVelocity i.e position of car in X direction
    // and value of yVelocity i.e position of car in Y direction

    if(gameOn){
        if (e.key == "ArrowRight") {
            xVelocity += 4
        }
        else if (e.key == "ArrowLeft") {
            xVelocity -= 4
        }
        else if (e.key == "ArrowUp") {
            yVelocity -= 2
        }
        else if (e.key == "ArrowDown") {
            yVelocity += 2
        }
    }
    if(e.key == "d"){
        localStorage.removeItem('records')
        document.querySelectorAll('.recordDisplay').forEach(e => {
            e.style.display = 'none'
        })
    }
    else if(e.key == "r"){
        window.location.href = "index.html"
    }
    else if(e.key == " "){
        if(!gameOn){
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // initiaing GameLoop
            window.requestAnimationFrame(gameLoop)
        }
    }
    else {
        null
    }
})


