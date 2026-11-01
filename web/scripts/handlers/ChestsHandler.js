import {CATEGORIES} from "../constants/LoggerConstants.js";

class Chest {
    constructor(id, posX, posY, name, rarity = null) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.chestName = name;
        this.rarity = rarity;
        this.hX = 0;
        this.hY = 0;
        this.lastUpdateTime = Date.now();
    }

    touch() {
        this.lastUpdateTime = Date.now();
    }
}

export class ChestsHandler {
    constructor() {
        this.chestsList = [];
    }

    addChest(id, posX, posY, name, rarity = null) {
        const existing = this.chestsList.find(chest => chest.id === id);
        if (existing) {
            existing.posX = posX;
            existing.posY = posY;
            existing.chestName = name ?? existing.chestName;
            existing.rarity = rarity ?? existing.rarity;
            existing.touch();
            return;
        }
        const h = new Chest(id, posX, posY, name, rarity);
        this.chestsList.push(h);
    }

    removeChest(id) {
        this.chestsList = this.chestsList.filter(chest => chest.id !== id);
    }

    Clear() {
        this.chestsList = [];
    }

    cleanupStaleEntities(maxAgeMs = 120000) {
        const now = Date.now();
        const before = this.chestsList.length;
        this.chestsList = this.chestsList.filter(chest =>
            (now - chest.lastUpdateTime) < maxAgeMs
        );
        const removed = before - this.chestsList.length;
        if (removed > 0) {
            window.logger?.debug(CATEGORIES.DUNGEONS, 'chest_cleanup', {removed, maxAgeMs});
        }
        return removed;
    }

    addChestEvent(Parameters)
    {
        // Ultra-detailed debug: Log ALL parameters to identify patterns
        const allParams = {};
        for (let key in Parameters) {
            if (Parameters.hasOwnProperty(key)) {
                allParams[`param[${key}]`] = Parameters[key];
            }
        }
        window.logger?.debug(CATEGORIES.DUNGEONS, 'new_chest_all_params', {
            chestId: Parameters[0],
            position: Parameters[7],
            allParameters: allParams,
            parameterCount: Object.keys(Parameters).length
        });

        const chestId = Parameters[0];
        // Em alguns eventos atuais Parameters[1] passou a ser um valor escalar
        // (ex.: 6, 7, 8). Procurar somente coordenadas explícitas [x, y].
        const isCoordinate = value => Array.isArray(value) && value.length >= 2 &&
            Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]));
        const chestsPosition = isCoordinate(Parameters[1]) ? Parameters[1] :
            [7, 2, 8, 9].map(index => Parameters[index]).find(isCoordinate);
        let chestName = Parameters[3];
        const rarity = Parameters[5] ?? null;

        if (typeof chestName === 'string' && chestName.toLowerCase().includes("mist")) {
            chestName = Parameters[4];
        }
        if (!Array.isArray(chestsPosition) || chestsPosition.length < 2 ||
            !Number.isFinite(Number(chestsPosition[0])) || !Number.isFinite(Number(chestsPosition[1]))) {
            window.logger?.warn(CATEGORIES.DUNGEONS, 'invalid_chest_position', {chestId, originalPosition: Parameters[1], coordinateCandidates: [2, 7, 8, 9].map(index => ({index, value: Parameters[index]}))});
            return;
        }
        this.addChest(chestId, Number(chestsPosition[0]), Number(chestsPosition[1]), chestName, rarity);
    }
}
