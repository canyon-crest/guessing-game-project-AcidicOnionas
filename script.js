// add javascript here
date.textContent = time();
let score, answer, level;
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
const levelArr = document.getElementsByName("level");
const scoreArr = [];
function time(){
    let d = new Date();
    let str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    return str
}
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }
    answer = Math.floor(Math.random()*level) + 1;
    guess.placeholder = answer;
    msg.textContent = "Guess a number 1-" + level;
    score = 0;
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)){
        msg.textContent = "Please guess a number";
        return;
    }
    score++;
    if(userGuess < answer){
        msg.textContent = "Too Low";
    }
    else if(userGuess > answer){
        msg.textContent = "Too high";
    }
    else{
        msg.textContent = "Correct! It took " + score + " tries.";
        reset();
        updateScore();
    }
}
function reset(){
    guessBtn.disabled = true;
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
    wins.textContent = "Total wings: " + scoreArr.length;
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