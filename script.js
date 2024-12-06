const compositeNumbers = [
    119, 121, 133, 143, 161, 169, 187, 203, 209, 217, 221, 247, 253, 259, 287, 289, 299,
    301, 319, 323, 329, 341, 343, 361, 371, 377, 391, 403, 407, 413, 427, 437, 451, 469,
    473, 481, 493, 497, 511, 517, 527, 529, 533, 539, 551, 553, 559, 581, 583, 589, 611,
    623, 629, 637, 649, 667, 671, 679, 689, 697, 703, 707, 713, 721, 731, 737, 749, 763,
    767, 779, 781, 791, 793, 799, 803, 817, 833, 841, 847, 851, 869, 871, 889, 893, 899,
    901, 913, 917, 923, 931, 943, 949, 959, 961, 973, 979, 989
];

let score = 0;
let time;
let timeLeft;
let questionCount = 0;
let timerInterval;
let answeredQuestions = [];
let selectedNumbers = [];
let NumberQuestions;
let numberOfChoices;
let buttons;
let checkboxes;

function startGame() {
    const detailsDiv = document.getElementById("errorDisplay");
    detailsDiv.innerHTML = "";

    NumberQuestions = parseInt(document.getElementById('problems').value);
    numberOfChoices = parseInt(document.getElementById('choices').value);
    const timeInput = parseInt(document.getElementById('timeLimit').value);

    if (!Number.isInteger(NumberQuestions) || NumberQuestions < 1) {
        detailsDiv.innerHTML = "問題数は1以上の整数を入力してください。";
        return;
    }

    if (!Number.isInteger(numberOfChoices) || numberOfChoices < 2 || numberOfChoices > 8) {
        detailsDiv.innerHTML = "選択肢は2以上8以下の整数を入力してください。";
        return;
    }

    if (!Number.isInteger(timeInput) || timeInput < 1) {
        detailsDiv.innerHTML = "制限時間は1以上の整数を入力してください。";
        return;
    }
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    const allButtons = document.querySelectorAll('#buttons button');
    buttons = Array.from(allButtons).slice(0, numberOfChoices);
    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes = Array.from(allCheckboxes).slice(0, numberOfChoices);
    time = timeInput * 60;
    timeLeft = time;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('question').textContent = `問1 / ${NumberQuestions}`;
    for (let i = numberOfChoices; i < allButtons.length; i++) {
        allButtons[i].style.display = 'none';
        allCheckboxes[i].style.display = 'none';
    }
    startTimer();
    generateNumbers();
}

function startTimer() {
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        } else {
            timeLeft--;
        }
    }, 1000);
}

function endGame() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    const totalTime = time - timeLeft;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const d_minutes = Math.floor(time / 60);
    const d_seconds = time % 60;

    document.getElementById('finalScore').textContent = `得点: ${score} / ${NumberQuestions}`;
    document.getElementById('finalTime').textContent = `時間: ${minutes}:${seconds.toString().padStart(2, '0')} / ${d_minutes}:${d_seconds.toString().padStart(2, '0')}`;
    document.getElementById('numChoices').textContent = `選択肢の数: ${numberOfChoices}`;

    const questionResults = answeredQuestions.map((result, index) => {
        const separator = ((index + 1) % 5 === 0) ? '<br>' : ' ';
        return `問${index + 1}:${result.correct ? '○' : '×'}${separator}`;
    }).join('');
    document.getElementById('questionResults').innerHTML = questionResults;
}

function primeFactors(n) {
    const factors = [];
    for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
            factors.push(i);
            n /= i;
        }
    }
    return factors;
}

function updateFactors(button, number, factorDisplayId) {
    const factors = primeFactors(number);
    const smallestFactor = Math.min(...factors);

    let html = factors.map(factor =>
        factor === smallestFactor ? `<span class="smallest-factor">${factor}</span>` : factor
    ).join(' × ');

    html = number + " = " + html;

    const factorDisplay = document.getElementById(factorDisplayId);
    factorDisplay.innerHTML = html;
}

function highlightHighestScore(scores) {
    const highestScore = Math.max(...scores);
    buttons.forEach((button, index) => {
        const factorDiv = button.nextElementSibling;
        if (scores[index] === highestScore) {
            factorDiv.classList.add('highest-score');
        } else {
            factorDiv.classList.remove('highest-score');
        }
    });
}

function clearDisplays() {

    const details = document.getElementById('details');
    details.innerHTML = "<br><br>";

    const factorDisplays = document.querySelectorAll('.factor-display');
    factorDisplays.forEach(factorDisplay => {
        factorDisplay.innerHTML = "";
    });

    const highlighted = document.querySelectorAll('.highest-score');
    highlighted.forEach(element => element.classList.remove('highest-score'));
}

function handleSelection(scores, number, smallestFactor) {
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    buttons.forEach((button, index) => {
        updateFactors(button, selectedNumbers[index], `factor-display-${index + 1}`);
    });

    highlightHighestScore(scores);

    const details = document.getElementById('details');
    const factors = primeFactors(number);
    details.innerHTML = `選択した数: ${number}<br>式: ${factors.join(' × ')}`;

    const questionResults = (smallestFactor == Math.max(...scores));

    answeredQuestions.push({ correct: questionResults, number });

    score += questionResults;
    document.getElementById('score').textContent = `得点: ${score}`;

    questionCount++;

    const currentQuestionNumber = questionCount + 1;
    document.getElementById('question').textContent = `問${currentQuestionNumber} / ${NumberQuestions}`;

    setTimeout(() => {
        if (questionCount + 1 === currentQuestionNumber) {
            clearDisplays();
        }
    }, 5000);

    if (questionCount >= NumberQuestions) {
        endGame();
    } else {
        generateNumbers();
    }
}

function generateNumbers() {
    selectedNumbers = [];
    while (selectedNumbers.length < numberOfChoices) {
        const num = compositeNumbers[Math.floor(Math.random() * compositeNumbers.length)];
        if (!selectedNumbers.includes(num)) selectedNumbers.push(num);
    }

    const scores = selectedNumbers.map(num => Math.min(...primeFactors(num)));

    buttons.forEach((button, index) => {
        button.textContent = selectedNumbers[index];
        button.onclick = () => handleSelection(scores, selectedNumbers[index], scores[index]);
    });
}

generateNumbers();
