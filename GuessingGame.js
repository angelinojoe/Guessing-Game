function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
               
    }
Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
} 

Game.prototype.isLower = function(){
    if (this.playersGuess < this.winningNumber){
        return true;
    }
    else{
        return false;
    }
}  

Game.prototype.playersGuessSubmission = function(guess){
    if (guess < 1 || guess > 100 || isNaN(guess)){
        throw "That is an invalid guess.";
    }
    
    this.playersGuess = guess;
    return this.checkGuess();    
}

Game.prototype.checkGuess = function(){

    function resetMessage(){
        $('#headers > h1').text('Click Reset to Play Again!');
    }

    function higherLower(bool){
        if (bool){     
            return 'Guess Higher!';
        }
        else{
            return 'Guess Lower!';
        }
    }

    function disableButtons(){
        //.prop to add properties to an html element
        $("#menu-btns button:nth-child(2)").prop('disabled',true);
        $('#submit').prop('disabled',true);
    }

    if (this.playersGuess == this.winningNumber){
        resetMessage();
        disableButtons();
        return "You Win!";
    }
    else if (this.pastGuesses.includes(this.playersGuess)){
        return "You have already guessed that number.";
    }
    else if(!this.pastGuesses.includes(this.playersGuess)){
        this.pastGuesses.push(this.playersGuess);
        //add guesses to guess boxes
        $('#guesses li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
        if (this.pastGuesses.length >=5){
            resetMessage();
            disableButtons();
            return "You Lose.";
        }
        else if (this.difference() < 10){           
            return "You\'re burning up! " + higherLower(this.isLower());
        }
        else if(this.difference() < 25){
            return "You\'re lukewarm. " + higherLower(this.isLower());
        }
        else if(this.difference() < 50){
            return "You\'re a bit chilly. " + higherLower(this.isLower());
        }
        else{
            return "You\'re ice cold! " + higherLower(this.isLower());
        }
    }
} 

Game.prototype.provideHint =function(){
    var hintArr = [];
    hintArr.push(this.winningNumber);
    hintArr.push(generateWinningNumber());
    hintArr.push(generateWinningNumber());
    return shuffle(hintArr);
}   

function generateWinningNumber(){
    return Math.floor((Math.random() * 100) + 1);
}

function shuffle(array) {
  var m = array.length, temp, index;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    index = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    temp = array[m];//pulls off last element of array
    array[m] = array[index];//puts random chosen element to back of array
    array[index] = temp;//plugs the hole
  }

  return array;
}

function newGame(){
    return new Game;
}

$(document).ready(function(){
    var currentGame = new Game();
    //if submit button clicked
    $('#submit').on('click', function(){
       makeGuess(currentGame);
    });
    //if enter button clicked. 
    $('#player-input').keypress(function(){
        //event.which gets keycode of key pressed to trigger event, 13 is value of enter key
        if (event.which == 13){
            makeGuess(currentGame);
        }
    });

    //when submit button or enter clicked, get val from input, clear input field, and submit guess
    function makeGuess(currentGame){
        var input = $('#player-input').val();
        $('#player-input').val('');
        var output = currentGame.playersGuessSubmission(parseInt(input,10));
        $('#headers > h3').text(output);
    }
    //when reset is hit, restore original text, clear guess boxes, set disable to false
    $("#menu-btns button:nth-child(1)").on('click',function(){
        currentGame = new Game();
        $('#headers h1').text('Guessing Game');
        $('#headers h3').text('Guess A Number Between 1 And 100');
        $('#guesses li').text('-');
        $("#menu-btns button:nth-child(2), #submit").prop('disabled',false);
    });

    //when hint button is hit, give 3 hint options
    $("#menu-btns button:nth-child(2)").on('click',function(){
        $('#hints').text("The answer is one of these: " + currentGame.provideHint());
    });
});