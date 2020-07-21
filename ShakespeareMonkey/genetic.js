/**
 * The allowed character set for the members of this population.
 */
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!";

/**
 * Generates a random string of the specified length
 * consisting of the characters allowed by CHARSET.
 * 
 * @param {Number} len 
 */
const generateRandomString = (len) => {
    let string = "";

    for (let i = 0; i < len; i++) {
        string += CHARSET.charAt(Math.random() * CHARSET.length);
    }

    return string;
};

/**
 * Generates a random population of 'memberCount' number
 * of members, each as long as the specified memberSize.
 * 
 * @param {Number} memberSize 
 * @param {Number} memberCount
 */
const generatePopulation = (memberSize, memberCount) => {
    const initialPopulation = new Array(memberCount);

    for (let i = 0; i < initialPopulation.length; i++) {
        initialPopulation[i] = generateRandomString(memberSize);
    }

    return initialPopulation;
};

/**
 * Computes the fitness score for the current member string
 * in comparison with the target string by calculating the number
 * of matching characters.
 * 
 * For example, "unicorn" (target) and "popcorn" (current) have 4/7 characters common.
 * Hence, we would see a score of 4.
 * 
 * @param {String} target the target string
 * @param {String} current the current member string from the population
 */
const getFitnessScore = (target, current) => {
    if (target.length !== current.length) {
        console.error(`Member sizes do not match: ${target} and ${current}.`);
        return 0.0;
    }

    let sameLetters = 0;
    for (let i = 0; i < target.length; i++) {
        if (target.charAt(i) === current.charAt(i)) {
            sameLetters++;
        }
    }

    return sameLetters;
};

const getPopulationFitnessData = (target, population) => {
    const fitnessMap = {};

    let totalFitness = 0;
    let fittest = 0;
    for (let i = 0; i < population.length; i++) {
        const member = population[i];
        const score = getFitnessScore(target, member);
        if (score <= 0) continue;

        if (fitnessMap[member]) {
            fitnessMap[member] += score;
        } else {
            fitnessMap[member] = score;
        }

        if (score >= fitnessMap[population[fittest]]) {
            fittest = i;
        }

        totalFitness += score;
    }

    let fitnessPercentage = Object.keys(fitnessMap).length / population.length * 100;
    // Round percentage to 2 decimal places
    fitnessPercentage = Math.round(fitnessPercentage * 100) / 100;

    return {
        fitnessPercentage: fitnessPercentage,
        fitnessMap: fitnessMap,
        totalFitness: totalFitness,
        fittest: population[fittest]
    };
};

class ParentsSelector {
    constructor(popFitnessData) {
        this.parentsArray = new Array(popFitnessData.totalFitness);

        let i = 0;
        for (const member in popFitnessData.fitnessMap) {
            for (let j = 0; j < popFitnessData.fitnessMap[member]; j++, i++) {
                this.parentsArray[i] = member;
            }
        }
    }

    selectParents = () => {
        const parents = new Array(2);

        for (let i = 0; i < parents.length; i++) {
            const randomIndex = Math.floor(Math.random() * this.parentsArray.length);
            parents[i] = this.parentsArray[randomIndex];
        }

        return parents;
    };
}

const mate = (parents, algorithm) => {
    if (parents.length !== 2) {
        console.error("Need 2 parents to mate.");
        return;
    }

    if (parents[0].length !== parents[1].length) {
        console.error("Parents have unequal lengths.");
        return;
    }
    
    let offspring;
    switch (algorithm) {
        case "alternate":
            offspring = new Array(parents[0].length);

            for (let i = 0; i < parents[0].length; i++) {
                if (i % 2 === 0) {
                    offspring[i] = parents[0].charAt(i);
                } else {
                    offspring[i] = parents[1].charAt(i);
                }
            }

            return offspring.join('');
        case "halfEach":
            const len0 = Math.floor(parents[0].length / 2);

            offspring = parents[0].substring(0, len0);
            offspring += parents[1].substring(len0);

            return offspring;
    }
};

const mutate = (member, mutationRate) => {
    const memberArray = member.split('');

    for (let i = 0; i < memberArray.length; i++) {
        if (Math.random() < mutationRate) {
            memberArray[i] = CHARSET.charAt(Math.random() * CHARSET.length);
        }
    }

    return memberArray.join('');
};

const findTarget = (population, target) => {
    for (const member of population) {
        if (member === target) return true;
    }

    return false;
};

const executeGeneration = (target, population, mutationRate, matingAlgo) => {
    if (findTarget(population, target)) {
        return {
            targetFound: true,
            nextGeneration: null
        };
    }

    const fitnessData = getPopulationFitnessData(target, population);
    if (fitnessData.totalFitness === 0) {
        return {
            targetFound: false,
            nextGeneration: null
        };
    }

    const parentsSelector = new ParentsSelector(fitnessData);

    const nextGeneration = new Array(population.length);
    let nextGenPushIndex = 0;

    for (let i = 0; i < population.length; i++) {
        const parents = parentsSelector.selectParents();
        const offspring = mutate(mate(parents, matingAlgo), mutationRate);
        nextGeneration[nextGenPushIndex++] = offspring;
    }

    return {
        targetFound: false,
        nextGeneration: nextGeneration,
        fitness: fitnessData
    };
};