'use strict';

const CHOSEN_MAX_HEALTH = 100;
const PLAYER_ATTACK_DAMAGE = 5;
const PLAYER_STRONG_ATTACK_DAMAGE = 13;
const MONSTER_ATTACK_DAMAGE = 10;
const HEAL_VALUE = 20;
const logEntries = [];

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const LOG_EVENT_REMOVE_BONUS_LIFE = 'REMOVE_BONUS_LIFE';

let hasBonusLife = true;
let currentPlayerHealth = CHOSEN_MAX_HEALTH;
let currentMonsterHealth = CHOSEN_MAX_HEALTH;
let logIndex = 0;

adjustHealthBars(CHOSEN_MAX_HEALTH);

const writeToLog = function (event, value, monsterHealth, playerHealth) {
    const logEntry = {
        event,
        value,
        monsterHealth,
        playerHealth,
    };

    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
    }

    logEntries.push(logEntry);
};

const attackPlayer = function (damage) {
    const monsterDamage = dealPlayerDamage(damage);
    currentPlayerHealth -= monsterDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK, monsterDamage, currentMonsterHealth, currentPlayerHealth);
};

const calculateMatchResult = function () {
    // check bonusLife exist
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        setPlayerHealth(CHOSEN_MAX_HEALTH);
        currentPlayerHealth = CHOSEN_MAX_HEALTH;

        writeToLog(LOG_EVENT_REMOVE_BONUS_LIFE, 'REMOVE_BONUS_LIFE', currentMonsterHealth, currentPlayerHealth);

        return;
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER_WON', currentMonsterHealth, currentPlayerHealth);
        alert('You win!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER_WON', currentMonsterHealth, currentPlayerHealth);
        alert('You lost!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
        alert('You have a draw');
    }
};

const attackMonster = function (damage) {
    const playerDamage = dealMonsterDamage(damage);
    currentMonsterHealth -= playerDamage;

    writeToLog(LOG_EVENT_PLAYER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    attackPlayer(MONSTER_ATTACK_DAMAGE);

    calculateMatchResult();
};

attackBtn.addEventListener('click', () => attackMonster(PLAYER_ATTACK_DAMAGE));

strongAttackBtn.addEventListener('click', () => attackMonster(PLAYER_STRONG_ATTACK_DAMAGE));

healBtn.addEventListener('click', () => {
    // check healAmount must not be exceeded CHOSEN_MAX_HEALTH
    if (currentPlayerHealth < CHOSEN_MAX_HEALTH) {
        if ((currentPlayerHealth + HEAL_VALUE) > CHOSEN_MAX_HEALTH) {
            currentPlayerHealth = Math.round(currentPlayerHealth);
            const reducedHealAmount = CHOSEN_MAX_HEALTH - currentPlayerHealth;
            increasePlayerHealth(reducedHealAmount);
            currentPlayerHealth += reducedHealAmount;
            writeToLog(LOG_EVENT_PLAYER_HEAL, reducedHealAmount, currentMonsterHealth, currentPlayerHealth);
        } else {
            increasePlayerHealth(HEAL_VALUE);
            currentPlayerHealth += HEAL_VALUE;
            writeToLog(LOG_EVENT_PLAYER_HEAL, HEAL_VALUE, currentMonsterHealth, currentPlayerHealth);
        }
    }
});

logBtn.addEventListener('click', () => {
    for (const logEntry of logEntries) {
        console.log('#', ++logIndex);
        for (const key in logEntry) {
            console.log(key, logEntry[key]);
        }
    }
});
