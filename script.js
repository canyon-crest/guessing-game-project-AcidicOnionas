startBtn.addEventListener("click", function(){
    titleScreen.style.display = "none";
    gameContent.style.display = "block";
});

date.textContent = time();
setInterval(function(){
    date.textContent = time();
}, 1000);

guessBtn.style.background = "#cccccc";
guessBtn.style.color = "#666666";
guessBtn.style.cursor = "not-allowed";
giveUpBtn.style.background = "#cccccc";
giveUpBtn.style.color = "#666666";
giveUpBtn.style.cursor = "not-allowed";

let userName = "";
let score, answer, level, startMs;
let fastestTime = null;
let totalTime = 0;
let gamesPlayed = 0;

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
const levelArr = document.getElementsByName("level");
const scoreArr = [];
function time(){
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
    let month = months[d.getMonth()];
    let day = d.getDate();
    let year = d.getFullYear();
    let suffix = getDaySuffix(day);
    let timeStr = d.toLocaleTimeString();
    return month + " " + day + suffix + ", " + year + ", " + timeStr;
}
function getDaySuffix(day){
    if(day >= 11 && day <= 13){
        return "th";
    }
    let lastDigit = day % 10;
    if(lastDigit === 1){
        return "st";
    } else if(lastDigit === 2){
        return "nd";
    } else if(lastDigit === 3){
        return "rd";
    } else {
        return "th";
    }
}
function play(){
    let name = nameInput.value.trim();
    if(name === ""){
        msg.textContent = "Please enter a valid name!";
        return;
    }

    let firstChar = name.charAt(0);
    if(firstChar >= 'a' && firstChar <= 'z'){
        userName = firstChar.toUpperCase() + name.slice(1);
    } else if(firstChar >= 'A' && firstChar <= 'Z'){
        userName = name;
    } else {
        userName = name;
    }
    
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guessBtn.style.background = "#667eea";
    guessBtn.style.color = "white";
    guessBtn.style.cursor = "pointer";
    guess.disabled = false;
    giveUpBtn.disabled = false;
    giveUpBtn.style.background = "#764ba2";
    giveUpBtn.style.color = "white";
    giveUpBtn.style.cursor = "pointer";
    for(let i = 0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }
    answer = Math.floor(Math.random()*level) + 1;
    guess.placeholder = answer;
    msg.textContent = userName + ", guess a number 1-" + level;
    temp.textContent = "";
    score = 0;
    startMs = new Date().getTime();
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)){
        msg.textContent = userName + ", please guess a number";
        return;
    }
    score++;
    if(userGuess < answer){
        let difference = Math.abs(userGuess - answer);
        let tempText = "";

        let hotThreshold = level * 0.05; 
        let warmThreshold = level * 0.15;
        if(difference <= hotThreshold){
            tempText = "HOT! 🔥";
        } else if(difference <= warmThreshold){
            tempText = "Warm";
        } else {
            tempText = "Cold";
        }
        msg.textContent = "Too low, " + userName + "!";
        temp.textContent = tempText;
    }
    else if(userGuess > answer){
        let difference = Math.abs(userGuess - answer);
        let tempText = "";
        
        let hotThreshold = Math.ceil(level * 0.05); 
        let warmThreshold = Math.ceil(level * 0.15);
        if(difference <= hotThreshold){
            tempText = "HOT! 🔥";
        } else if(difference <= warmThreshold){
            tempText = "Warm";
        } else {
            tempText = "Cold";
        }
        msg.textContent = "Too high, " + userName + "!";
        temp.textContent = tempText;
    }
    else{
        let endMs = new Date().getTime();
        let rating = rateScore(score, level);
        msg.textContent = "Correct, " + userName + "! It took " + score + " tries. " + rating;
        temp.textContent = "";
        showConfetti();
        updateTimers(endMs);
        reset();
        updateScore();
    }
}
function showConfetti(){
    let colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    for(let i = 0; i < 50; i++){
        let confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.width = "10px";
        confetti.style.height = "10px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "-10px";
        confetti.style.zIndex = "9999";
        document.body.appendChild(confetti);
        
        let fallSpeed = Math.random() * 5 + 5;
        let interval = setInterval(function(){
            let currentTop = parseInt(confetti.style.top);
            confetti.style.top = (currentTop + fallSpeed) + "px";
            
            if(currentTop > window.innerHeight){
                clearInterval(interval);
                document.body.removeChild(confetti);
            }
        }, 20);
    }
}
function rateScore(score, level){
    let ideal = Math.ceil(Math.log2(parseInt(level)));
    if(score <= ideal){
        return "Excellent! 🌟";
    } else if(score <= ideal + 2){
        return "Good job! 👍";
    } else if(score <= ideal + 5){
        return "Not bad!";
    } else {
        return "You can do better!";
    }
}
function updateTimers(endMs){
    let elapsed = endMs - startMs;
    gamesPlayed++;
    totalTime += elapsed;
    
    if(fastestTime === null || elapsed < fastestTime){
        fastestTime = elapsed;
    }
    
    let fastestSeconds = (fastestTime / 1000).toFixed(2);
    let avgSeconds = (totalTime / gamesPlayed / 1000).toFixed(2);
    
    fastest.textContent = "Fastest Game: " + fastestSeconds + " seconds";
    avgTime.textContent = "Average Time: " + avgSeconds + " seconds";
}
function reset(){
    guessBtn.disabled = true;
    guessBtn.style.background = "#cccccc";
    guessBtn.style.color = "#666666";
    guessBtn.style.cursor = "not-allowed";
    giveUpBtn.disabled = true;
    giveUpBtn.style.background = "#cccccc";
    giveUpBtn.style.color = "#666666";
    giveUpBtn.style.cursor = "not-allowed";
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i = 0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score);
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a,b) => a-b);
    const lb = document.getElementsByName("leaderboard");
    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i< lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}
function giveUp(){
    let endMs = new Date().getTime();
    score = parseInt(level);
    msg.textContent = userName + ", you gave up! The answer was " + answer + ". Score: " + score;
    temp.textContent = "";
    updateTimers(endMs);
    reset();
    updateScore();
}