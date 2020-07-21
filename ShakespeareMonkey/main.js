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
        showFittest(target);
        toggleForm();
        return;
    }
    
    if (generationData.nextGeneration === null) {
        showFittest('Oops..');
        showError("No parents fit enough to mate in this generation.");
        toggleForm();
        return;
    }

    showFittest(generationData.fitness.fittest);
    showFitnessPercentage(generationData.fitness.fitnessPercentage);
    
    population = generationData.nextGeneration;
    generation++;

    if (generation > getMaxGenerations()) {
        showError(`Exceeded max generations limit.`);
        toggleForm();
        return;
    }

    if (ABORT) {
        showError("Execution aborted.");
        toggleForm();
        return;
    }

    setTimeout(() => mainWorker(target, population, mutationRate, matingAlgo, generation), getAnimationDelay());
}
