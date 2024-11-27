const compositeNumbers = [
    119, 121, 133, 143, 161, 169, 187, 203, 209, 217, 221, 247, 253, 259, 287, 289, 299,
    301, 319, 323, 329, 341, 343, 361, 371, 377, 391, 403, 407, 413, 427, 437, 451, 469,
    473, 481, 493, 497, 511, 517, 527, 529, 533, 539, 551, 553, 559, 581, 583, 589, 611,
    623, 629, 637, 649, 667, 671, 679, 689, 697, 703, 707, 713, 721, 731, 737, 749, 763,
    767, 779, 781, 791, 793, 799, 803, 817, 833, 841, 847, 851, 869, 871, 889, 893, 899,
    901, 913, 917, 923, 931, 943, 949, 959, 961, 973, 979, 989
];

let score = 0;

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

function highlightHighestScore(buttons, scores) {
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

function handleSelection(buttons, selectedNumbers, scores, number, smallestFactor) {
    score += smallestFactor;

    document.getElementById('score').textContent = `Score: ${score}`;

    buttons.forEach((button, index) => {
        updateFactors(button, selectedNumbers[index], `factor-display-${index + 1}`);
    });

    highlightHighestScore(buttons, scores);

    const details = document.getElementById('details');
    const factors = primeFactors(number);
    details.innerHTML = `Selected number: ${number}<br>Prime factors: ${factors.join(' × ')}`;

    generateNumbers();
}

function generateNumbers() {
    const buttons = document.querySelectorAll('#buttons button');
    const selectedNumbers = [];
    while (selectedNumbers.length < 4) {
        const num = compositeNumbers[Math.floor(Math.random() * compositeNumbers.length)];
        if (!selectedNumbers.includes(num)) selectedNumbers.push(num);
    }

    const scores = selectedNumbers.map(num => Math.min(...primeFactors(num)));

    buttons.forEach((button, index) => {
        button.textContent = selectedNumbers[index];
        button.onclick = () => handleSelection(buttons, selectedNumbers, scores, selectedNumbers[index], scores[index]);
    });
}

generateNumbers();
