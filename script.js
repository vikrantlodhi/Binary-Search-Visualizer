
const arrayInput = document.getElementById('arrayInput');
const targetInput = document.getElementById('targetInput');
const arrayContainer = document.getElementById('arrayContainer');
const stepsContainer = document.getElementById('stepsContainer');
const startSearchButton = document.getElementById('startSearch');
const clearInputButton = document.getElementById('clearInput');
const prevStepButton = document.getElementById('prevStep');
const nextStepButton = document.getElementById('nextStep');

let array = [];
let target = null;
let currentStep = 0;
let steps = [];

function displayArray() {
    arrayContainer.innerHTML = '';
    array.forEach(num => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = num;
        arrayContainer.appendChild(box);
    });
}

arrayInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        const value = arrayInput.value.trim();
        if (value) {
            array.push(parseInt(value));
            arrayInput.value = '';
            displayArray();
        }
    }
});

targetInput.addEventListener('input', () => {
    target = parseInt(targetInput.value.trim());
});

clearInputButton.addEventListener('click', () => {
    array = [];
    target = null;
    arrayInput.value = '';
    targetInput.value = '';
    displayArray();
    stepsContainer.innerHTML = '';
    currentStep = 0;
});

startSearchButton.addEventListener('click', () => {
    if (target !== null && array.length > 0) {
        array.sort((a, b) => a - b);
        displayArray();
        steps = []; // Reset previous steps
        stepsContainer.innerHTML = ''; // Clear the steps container
        currentStep = 0;
        binarySearch(array, target);
    }
});

prevStepButton.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateStep();
    }
});

nextStepButton.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateStep();
    }
});

function highlightBox(left, right, mid, found) {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.style.border = '';
    });

    if (found) {
        boxes[mid].style.border = '3px solid green';  // Highlight found element
    } else {
        if (left >= 0) boxes[left].style.border = '3px solid yellow';
        if (right < boxes.length) boxes[right].style.border = '3px solid yellow';
        boxes[mid].style.border = '3px solid red';  // Highlight current middle
    }
}

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;

    function searchStep() {
        if (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const found = arr[mid] === target;
            highlightBox(left, right, mid, found);

            const step = {
                description: `Step ${steps.length + 1}: Checking value ${arr[mid]} at index ${mid}`,
                left, right, mid, found
            };
            steps.push(step);

            const stepElement = document.createElement('p');
            stepElement.textContent = step.description;
            stepsContainer.appendChild(stepElement);

            setTimeout(() => {
                if (found) {
                    highlightBox(left, right, mid, true);  // Highlight the found target in green
                    const successStep = {
                        description: `Target found at index ${mid}`,
                        left: null,
                        right: null,
                        mid,
                        found: true
                    };
                    steps.push(successStep);
                    currentStep = steps.length - 1; // Jump to the target found step
                    updateStep();
                } else if (arr[mid] < target) {
                    left = mid + 1;
                    searchStep();
                } else {
                    right = mid - 1;
                    searchStep();
                }
            }, 1000);
        } else {
            const failureStep = {
                description: 'Target not found',
                left: null,
                right: null,
                mid: null,
                found: false
            };
            steps.push(failureStep);
            updateStep();
        }
    }

    searchStep();
}

function updateStep() {
    stepsContainer.innerHTML = '';
    const step = steps[currentStep];

    steps.forEach((s, index) => {
        const stepElement = document.createElement('p');
        stepElement.textContent = s.description;
        if (index === currentStep) {
            stepElement.classList.add('current-step');
        }
        stepsContainer.appendChild(stepElement);
    });

    highlightBox(step.left, step.right, step.mid, step.found);
}
