const targetStringBox = document.getElementById("targetStringBox");
const populationSizeBox = document.getElementById("populationSizeBox");
const mutationRateBox = document.getElementById("mutationRateBox");

const start = () => {
    if (targetStringBox.value === '') {
        alert("Please enter a target string.");
        return;
    }

    if (populationSizeBox.value === '') {
        alert("Please enter a population size.");
        return;
    }

    if (mutationRateBox.value === '') {
        alert("Please enter a mutation rate.");
        return;
    }

    const targetString = targetStringBox.value;
    const populationSize = Number.parseInt(populationSizeBox.value);
    if (populationSize < 2) {
        alert("Need at least 2 parents.");
        return;
    }

    const mutationRate = Number.parseFloat(mutationRateBox.value);
    if (mutationRate < 0 || mutationRate > 100) {
        alert("Mutation rate must be between 0 and 100.");
        return;
    }

    hideError();
    toggleForm();
    ABORT = false;
    main(targetString, populationSize, mutationRate, getMatingAlgorithm());
};

let ABORT = false;
const abort = () => {
    ABORT = true;
}

const fittestHeading = document.getElementById("fittest");
const showFittest = (fittest) => {
    fittestHeading.innerHTML = fittest;
};

const generationHeading = document.getElementById("generation");
const showGeneration = (generation) => {
    generationHeading.innerHTML = "#" + generation;
};

const fitnessPercentageHeading = document.getElementById("fitnessPercentage");
fitnessPercentageHeading.innerHTML = 'N/A';
const showFitnessPercentage = (fitnessPercentage) => {
    fitnessPercentageHeading.innerHTML = fitnessPercentage + "%";
};

const mutationRateHeading = document.getElementById("mutationRate");
const showMutationRate = (mutationRate) => {
    mutationRateHeading.innerHTML = `${mutationRate}%`;
};

const populationTable = document.getElementById("population");
const showPopulation = (population, target) => {
    const populationTableBody = document.getElementById("populationBody");

    let newTableBody = document.createElement("tbody");
    newTableBody.id = "populationBody";

    let lastColumn = 0;
    let currentRow = document.createElement("tr");

    for (let i = 0; i < population.length; i++) {
        if (lastColumn === 5) {
            newTableBody.appendChild(currentRow);
            currentRow = document.createElement("tr");
            lastColumn = 0;
        }

        let cell = document.createElement("td");
        cell.innerText = population[i];
        currentRow.appendChild(cell);

        if (population[i] === target) {
            cell.classList.add("targetMember");
        }

        lastColumn++;
    }

    if (currentRow.childNodes.length > 0)
        newTableBody.appendChild(currentRow);

    populationTable.replaceChild(newTableBody, populationTableBody);
};

const animationDelayBox = document.getElementById("animationDelayBox");
const getAnimationDelay = () => {
    if (animationDelayBox.value === '') {
        animationDelayBox.value = 5;
        return 5;
    }

    return Number.parseInt(animationDelayBox.value);
};

const matingAlgorithmBox = document.getElementById("matingAlgorithmBox");
const getMatingAlgorithm = () => {
    return matingAlgorithmBox.value;
};

const genResultsBox = document.getElementById("genResultsBox");
const showGenResultsBox = () => {
    genResultsBox.style.visibility = '';
};

const errorBox = document.getElementById("errorBox");
const showAlert = (msg) => {
    if (errorBox.innerHTML !== '') {
        errorBox.innerHTML += '<br>' + msg;
    } else {
        errorBox.innerHTML = msg;
    }

    errorBox.style.display = '';
};

const hideError = () => {
    errorBox.innerHTML = '';
    errorBox.style.display = 'none';
};

const maxGenerationsBox = document.getElementById("maxGenerationsBox");
const getMaxGenerations = () => {
    if (maxGenerationsBox.value === '') {
        maxGenerationsBox.value = 1000;
        return 1000;
    }

    return Number.parseInt(maxGenerationsBox.value);
};

const startBtnWrapper = document.getElementById("startBtnWrapper");
const abortBtnWrapper = document.getElementById("abortBtnWrapper");
const toggleForm = () => {
    targetStringBox.disabled = !targetStringBox.disabled;
    populationSizeBox.disabled = !populationSizeBox.disabled;
    mutationRateBox.disabled = !mutationRateBox.disabled;
    matingAlgorithmBox.disabled = !matingAlgorithmBox.disabled;
    maxGenerationsBox.disabled = !maxGenerationsBox.disabled;

    startBtnWrapper.style.display = startBtnWrapper.style.display === 'none' ? '' : 'none';
    abortBtnWrapper.style.display = abortBtnWrapper.style.display === 'none' ? '' : 'none';
};

const animationDelaySlider = document.getElementById("animationDelaySlider");
const updateAnimationDelayBox = () => {
    animationDelayBox.value = animationDelaySlider.value;
}

const updateAnimationDelaySlider = () => {
    animationDelaySlider.value = animationDelayBox.value;
}

updateAnimationDelayBox();