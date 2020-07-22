const main = (target, populationSize, mutationRate, matingAlgo) => {
    showGenResultsBox();
    showMutationRate(mutationRate);

    let population = generatePopulation(target.length, populationSize);
    setTimeout(() => mainWorker(target, population, mutationRate / 100, matingAlgo, 1), getAnimationDelay());
};

const mainWorker = (target, population, mutationRate, matingAlgo, generation) => {
    const generationData = executeGeneration(target, population, mutationRate, matingAlgo);
    
    showPopulation(population, target);
    showGeneration(generation);

    if (generationData.targetFound) {
        showAlert("Target found!");
        showFittest(target, 100);
        toggleForm();
        return;
    }
    
    if (generationData.nextGeneration === null) {
        showFittest('Oops..');
        showAlert("No parents fit enough to mate in this generation.");
        toggleForm();
        return;
    }

    const fittestPercentage = Math.round(generationData.fitness.fittest.score / target.length * 100);
    showFittest(generationData.fitness.fittest.member, fittestPercentage);
    showFitnessPercentage(generationData.fitness.fitnessPercentage);
    
    population = generationData.nextGeneration;
    generation++;

    if (generation > getMaxGenerations()) {
        showAlert(`Exceeded max generations limit.`);
        toggleForm();
        return;
    }

    if (ABORT) {
        showAlert("Execution aborted.");
        toggleForm();
        return;
    }

    setTimeout(() => mainWorker(target, population, mutationRate, matingAlgo, generation), getAnimationDelay());
}
