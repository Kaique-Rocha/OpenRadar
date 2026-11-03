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
        const chestId = Parameters[0];
        // Em alguns eventos atuais Parameters[1] passou a ser um valor escalar
        // (ex.: 6, 7, 8). Procurar somente coordenadas explícitas [x, y].
        const asCoordinate = value => {
            if (Array.isArray(value) && value.length >= 2 &&
                Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
                return [Number(value[0]), Number(value[1])];
            }
            if (value?.type === 'Buffer' && Array.isArray(value.data) && value.data.length >= 8) {
                const view = new DataView(new Uint8Array(value.data).buffer);
                const x = view.getFloat32(0, true);
                const y = view.getFloat32(4, true);
                if (Number.isFinite(x) && Number.isFinite(y)) return [x, y];
            }
            return null;
        };
        const chestsPosition = [1, 7, 2, 8, 9]
            .map(index => asCoordinate(Parameters[index])).find(Boolean);
        let chestName = typeof Parameters[3] === 'string' ? Parameters[3] :
            (typeof Parameters[4] === 'string' ? Parameters[4] : 'UNKNOWN_CHEST');
        const rarity = Parameters[5] ?? null;

        if (typeof chestName === 'string' && chestName.toLowerCase().includes("mist")) {
            chestName = Parameters[4];
        }
        if (!chestsPosition) {
            window.logger?.warn(CATEGORIES.DUNGEONS, 'invalid_chest_position', {chestId, originalPosition: Parameters[1], coordinateCandidates: [2, 7, 8, 9].map(index => ({index, value: Parameters[index]}))});
            return;
        }
        this.addChest(chestId, Number(chestsPosition[0]), Number(chestsPosition[1]), chestName, rarity);
    }
}
