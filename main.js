// all the elements needed
const questionElement = document.getElementById('question');
const footer = document.getElementById('footer');
const scoreText = document.getElementById('scoreText');
const invalidElement = document.getElementById('invalid');

const playAgainButton = document.getElementById('playAgain');
const startButton = document.getElementById('start');

const finishedElement = document.getElementById('finished');
const gameElement = document.getElementById('game');
const startScreenElement = document.getElementById('startScreen');

const topicElement = document.querySelector('select');

const answer1 = document.getElementById('1');
const answer2 = document.getElementById('2');
const answer3 = document.getElementById('3');
const answer4 = document.getElementById('4');

const answersArray = [answer1, answer2, answer3, answer4];

let url;

let rawData;

let totalScore = 0;
let givenScore = 4;

let correctAnswer;
let questions;
let questionNumber = 0;

let started = false;

// html text to regular
function decodeHtml(string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = string;
  const returnedString = txt.value;
  txt.remove();
  return returnedString;
}

function checkAnswer(e) {
  // remove the first 3 chars which are the question number and space (1. )
  if (decodeHtml(e.target.innerHTML.slice(3)) === decodeHtml(correctAnswer)) {
    totalScore += givenScore;
    givenScore = 4;

    e.target.classList.add('correct');
    footer.innerText = 'Correct!';
    footer.classList.add('correct');
    footer.classList.remove('incorrect');

    // gray out the answers
    answersArray.forEach((answer) => {
      answer.removeEventListener('click', checkAnswer);
      answer.innerHTML.slice(3) === e.target.innerHTML.slice(3)
        ? answer.classList.add('disabled-middle')
        : answer.classList.add('disabled');
    });

    // check if it's the end
    questionNumber++;
    if (questionNumber === 25) {
      started = false;
      setTimeout(() => {
        gameElement.classList.add('hidden');
        finishedElement.classList.remove('hidden');
        scoreText.innerHTML = `Your score is <span style="color: lime">${totalScore}!</span>`;
      }, 1000);
      return;
    }

    // show next question after a second.
    setTimeout(() => {
      showQuestion();
    }, 1000);
  } else {
    givenScore--;

    e.target.classList.add('incorrect');
    e.target.classList.add('disabled-middle');

    footer.innerText = 'Wrong :(';
    footer.classList.remove('correct');
    footer.classList.add('incorrect');
  }
}

// return the questions from the API
async function getQuestion() {
  return fetch(url).then((res) => res.json());
}

function showStartScreen() {
  invalidElement.innerText = '';
  topicElement.value = 'default';

  finishedElement.classList.add('hidden');
  gameElement.classList.add('hidden');
  startScreenElement.classList.remove('hidden');
}

function startGame() {
  const topic = topicElement.options[topicElement.selectedIndex].text;
  if (topic === '-- Select an option --') {
    invalidElement.innerText = 'Invalid choice! Choose another topic.';
    return;
  }
  switch (topic) {
    case 'Mythology':
      url = 'https://opentdb.com/api.php?amount=25&category=20&type=multiple';
      break;
    case 'Books':
      url = 'https://opentdb.com/api.php?amount=25&category=10&type=multiple';
      break;
    case 'Movies':
      url = 'https://opentdb.com/api.php?amount=25&category=11&type=multiple';
      break;
    case 'Vehicles':
      url = 'https://opentdb.com/api.php?amount=25&category=28&type=multiple';
      break;
    case 'Computers':
      url = 'https://opentdb.com/api.php?amount=25&category=18&type=multiple';
      break;
    case 'Science & Nature':
      url = 'https://opentdb.com/api.php?amount=25&category=17&type=multiple';
      break;
    case 'Video Games':
      url = 'https://opentdb.com/api.php?amount=25&category=15&type=multiple';
      break;
    case 'Animals':
      url = 'https://opentdb.com/api.php?amount=25&category=27&type=multiple';
      break;
    case 'Politics':
      url = 'https://opentdb.com/api.php?amount=25&category=24&type=multiple';
      break;
    case 'History':
      url = 'https://opentdb.com/api.php?amount=25&category=23&type=multiple';
      break;
    case 'Sports':
      url = 'https://opentdb.com/api.php?amount=25&category=21&type=multiple';
      break;
    case 'Math':
      url = 'https://opentdb.com/api.php?amount=25&category=19&type=multiple';
      break;
    case 'Geography':
      url = 'https://opentdb.com/api.php?amount=25&category=22&type=multiple';
      break;
    case 'Cartoons':
      url = 'https://opentdb.com/api.php?amount=25&category=32&type=multiple';
      break;
    case 'Anime':
      url = 'https://opentdb.com/api.php?amount=25&category=31&type=multiple';
      break;
  }
  showQuestion();
}

async function showQuestion() {
  playAgainButton.classList.add('disabled');
  startButton.classList.add('disabled');

  answersArray.forEach((answer) => {
    answer.addEventListener('click', checkAnswer);
    answer.classList.remove('disabled');
    answer.classList.remove('disabled-middle');
  });

  if (!started) {
    totalScore = 0;
    questionNumber = 0;
    rawData = await getQuestion();
  }
  started = true;

  questions = rawData.results;

  const question = questions[questionNumber].question;
  const answers = [];

  correctAnswer = questions[questionNumber].correct_answer;
  answers.push(correctAnswer);
  questions[questionNumber].incorrect_answers.forEach((answer) => {
    answers.push(answer);
  });

  questionElement.innerHTML = `${questionNumber + 1}. ${question}`;

  for (let i = 1; i <= 4; i++) {
    const index = Math.floor(Math.random() * answers.length);
    const answer = answers[index];

    switch (i) {
      case 1:
        answer1.innerHTML = `${i}. ${answer}`;
        break;
      case 2:
        answer2.innerHTML = `${i}. ${answer}`;
        break;
      case 3:
        answer3.innerHTML = `${i}. ${answer}`;
        break;
      case 4:
        answer4.innerHTML = `${i}. ${answer}`;
        break;
    }
    answers.splice(index, 1);
  }

  answersArray.forEach((answer) => {
    answer.classList.remove('correct');
    answer.classList.remove('incorrect');
  });

  footer.classList.remove('correct');
  footer.classList.remove('incorrect');
  footer.innerText = 'Waiting for an answer...';

  gameElement.classList.remove('hidden');
  finishedElement.classList.add('hidden');
  startScreenElement.classList.add('hidden');

  playAgainButton.classList.remove('disabled');
  startButton.classList.remove('disabled');
}
