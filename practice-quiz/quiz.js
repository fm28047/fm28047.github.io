/* Micah Friedman - 8 Jan 2023 */

const maxQuestions = 10;

let score = 0;

let questionsAnswered = 0;

var questions;

// stolen from https://stackoverflow.com/a/41133213
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

questions = JSON.parse(loadFile("questions.json"))["questions"];

function loadQuestions(amount, list) {
    let questions = [];
    let available = [];
    for (i = 0; i < list.length; i++) available[i] = i;
    for (i = 0; i < amount; i++) {
        let index = randint(0, available.length);
        questions.push(list[available[index]]);
        available.splice(index, 1);
    }
    return questions;
}

async function quiz(selectedQuestions, currentQuestion) {
    let quizContent = document.getElementById("quiz-content");

    if (currentQuestion > maxQuestions) {
        quizContent.innerHTML = `
            <h2 center>You did it!</h2>
            <p center><strong>Your score: ${score}/${maxQuestions}</strong></p>
            <p center><a href="#" onclick="window.location.reload(false)">Play again</a></p>
            <p center><a href="https://github.com/fm28047/fm28047.github.io/tree/main/practice-quiz" target="_blank">View source</a></p>
        `
        return;
    }

    // init stuff

    // for (currentQuestion = 1; currentQuestion <= 1; currentQuestion++) {
        
        quizContent.innerHTML = `
            <h2 center>Question <span id="question-number"></span> of <span id="question-limit"></span></h2>
            <p center>Unit <span id="unit"></span>.<span id="eq"></span>: <span id="question"></span></p>
            <div id="special" center></div>
            <div id="answers"></div>
            `
        document.getElementById("question-number").innerHTML = currentQuestion;
        document.getElementById("question-limit").innerHTML = maxQuestions;

        const activeQuestion = selectedQuestions[currentQuestion-1];

        document.getElementById("unit").innerHTML = activeQuestion["unit"];
        document.getElementById("eq").innerHTML = activeQuestion["eq"];

        // choose if q/a should be flipped or not
        var flipped = (activeQuestion["type"] == "matching" || activeQuestion["type"] == "imageMatching") && activeQuestion["reversable"] ? Math.random() >= 0.5 : false;

        // get question name and possibly flip q/a
        let question = flipped ? activeQuestion["questionReverse"] : activeQuestion["question"];

        let answers = [], otherAnswers = activeQuestion["options"], questionItem;
        
        if (flipped) otherAnswers = invert(otherAnswers);

        
        // choose random correct answer and remove it
        questionItem = randomKey(otherAnswers);
        answers[0] = otherAnswers[questionItem];
        delete otherAnswers[questionItem];

        // correct the question name
        question = question.replace("${}", questionItem);

        // if matching question do stuff
        if (activeQuestion["type"] == "matching" || activeQuestion["type"] == "imageMatching") {
            // generate incorrect answers
            for (i = 1; i < activeQuestion["answerCount"]; i++) {
                let index = randint(0, Object.keys(otherAnswers).length);
                let keyList = Object.keys(otherAnswers);
                answers[i] = otherAnswers[keyList[index]];
                delete otherAnswers[keyList[index]];
            }
        }
        else if (activeQuestion["type"] = "example") {
            // get random correct answer
            answers[0] = randomListItem(answers[0]);

            // generate incorrect answers
            incorrect = []
            
            for (group in otherAnswers) {
                incorrect = incorrect.concat(otherAnswers[group]);
            }

            for (i = 1; i < activeQuestion["answerCount"]; i++) {
                let index = randint(0, Object.keys(incorrect).length);
                answers[i] = incorrect[index];
                incorrect.splice(index, 1);
            }
        }

        // show image if it has it
        if (activeQuestion["type"] == "imageMatching") {
            document.getElementById("special").innerHTML = `<img height=450 src="${activeQuestion["imagePath"]}">`;
        }

        document.getElementById("question").innerHTML = question;

        let correctAnswer = answers[0];
        delete answers[0];
        let correctLocation = randint(0, activeQuestion["answerCount"]);

        let answersStr = "";

        for (i = 0; i < activeQuestion["answerCount"]; i++) {
            answersStr += `<div center class="button hover-color" id="answer-${i}">`
            if (i == correctLocation) answersStr += correctAnswer;
            else if (i > correctLocation) answersStr += answers[i];
            else answersStr += answers[i+1];
            answersStr += "</div>";
        }

        document.getElementById("answers").innerHTML = answersStr;

        let firstAttempt = true;
        let alreadyClicked = false;

        for (i = 0; i < activeQuestion["answerCount"]; i++) {
            let element = document.getElementById(`answer-${i}`);
            if (i == correctLocation) {
                element.addEventListener("click", function() {
                    if (!alreadyClicked) {
                        alreadyClicked = true;
                        element.classList.add("correct");
                        element.classList.remove("hover-color");
                        if (firstAttempt) score++;
                        setTimeout(function(){ 
                            quiz(selectedQuestions, currentQuestion+1);
                        }, 3000);
                    }
                });
            }
            else {
                element.addEventListener("click", function() {
                    if (!alreadyClicked) {
                        firstAttempt = false;
                        element.classList.add("incorrect");
                        element.classList.remove("hover-color");
                    }
                });
            }
        }
        
    // }
}

// get 10 random questions
let selectedQuestions = loadQuestions(maxQuestions, questions);

document.getElementById("quiz").addEventListener("click", function(){quiz(selectedQuestions, 1)});
