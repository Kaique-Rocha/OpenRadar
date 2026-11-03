import {CATEGORIES} from "../constants/LoggerConstants.js";
import settingsSync from "../utils/SettingsSync.js";

const DungeonType =
{
    Solo: 0,
    Group: 1,
    Corrupted: 2,
    Hellgate: 3
};

class Dungeon
{
    constructor(id, posX, posY, name, type, enchant)
    {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.name = name;
        this.enchant = enchant;

        this.type = type;

        this.drawName = undefined

        this.hY = 0;
        this.hX = 0;
        this.lastUpdateTime = Date.now();

        this.setDrawNameByType();
    }

    touch() {
        this.lastUpdateTime = Date.now();
    }

    setDrawNameByType()
    {
        switch (this.type)
        {
            case DungeonType.Solo:
                this.drawName = "dungeon_" + this.enchant;
                break;

            case DungeonType.Group:
                this.drawName = "group_" + this.enchant;
                break;

            case DungeonType.Corrupted:
                this.drawName = "corrupt";
                break;

            case DungeonType.Hellgate:
                this.drawName = "hellgate";
                break;
        }
    }
}

export class DungeonsHandler
{
    constructor()
    {
        // Import constants once in constructor
        this.dungeonList = [];
    }

    dungeonEvent(parameters)
    {
        const id = parameters[0];
        const position = parameters[1];
        if (!Array.isArray(position) || position.length < 2 ||
            !Number.isFinite(Number(position[0])) || !Number.isFinite(Number(position[1]))) {
            window.logger?.warn(CATEGORIES.DUNGEONS, 'invalid_dungeon_position', {id});
            return;
        }
        // Dragonfire shifted the Mists portal name from [15] to [16].
        const name = [parameters[3], parameters[16], parameters[15]]
            .find(value => typeof value === 'string' && value.length > 0) || '';
        const enchant = parameters[9] ?? 0;
        this.addDungeon(id, Number(position[0]), Number(position[1]), name, enchant);
    }

    addDungeon(id, posX, posY, name, enchant) {
        const existing = this.dungeonList.find(item => item.id === id);
        if (existing) {
            existing.touch();
            return;
        }

        const safeName = typeof name === 'string' ? name : '';
        const upperCaseName = safeName.toUpperCase();
        const lowerCaseName = safeName.toLowerCase();
        // eslint-disable-next-line no-useless-assignment
        let dungeonType = undefined;

        // MISTS portals route through the Mists settings, not Dungeon settings.
        if (upperCaseName.startsWith("MISTS_"))
        {
            const isSolo = upperCaseName.includes("_SOLO_");

            if (isSolo) {
                if (!settingsSync.getBool("settingMistSolo") || !settingsSync.getBool("settingMistE" + enchant)) return;
                dungeonType = DungeonType.Solo;
            } else {
                if (!settingsSync.getBool("settingMistDuo") || !settingsSync.getBool("settingMistE" + enchant)) return;
                dungeonType = DungeonType.Group;
            }
        }
        // Corrupted dungeons have "solo" in their names
        // So check before solo to avoid problems
        // "CORRUPTED_SOLO"
        else if (lowerCaseName.includes("corrupted")) // corrupt
        {
            // Test if corrupt checkbox
            if (!settingsSync.getBool("settingDungeonCorrupted")) return;

            dungeonType = DungeonType.Corrupted;
        }
        else if (lowerCaseName.includes("solo")) // solo
        {
            // Test if solo checkbox
            if (!settingsSync.getBool("settingDungeonSolo") || !settingsSync.getBool('settingDungeonE'+enchant)) return;

            dungeonType = DungeonType.Solo;
        }
        // "HELLGATE_2V2_NON_LETHAL"
        else if (lowerCaseName.includes("hellgate")) // hellgate
        {
            if (!settingsSync.getBool('settingDungeonHellgate')) return;

            dungeonType = DungeonType.Hellgate

        }
        else // group
        {
            if (!settingsSync.getBool('settingDungeonDuo') || !settingsSync.getBool('settingDungeonE'+enchant)) return;
            dungeonType = DungeonType.Group;
        }

        const d = new Dungeon(id, posX, posY, name, dungeonType, enchant);
        this.dungeonList.push(d);
    }

    removeDungeon(id)
    {
        this.dungeonList = this.dungeonList.filter((dungeon) => dungeon.id !== id);
    }

    Clear() {
        this.dungeonList = [];
    }

    cleanupStaleEntities(maxAgeMs = 120000) {
        const now = Date.now();
        const before = this.dungeonList.length;
        this.dungeonList = this.dungeonList.filter(dungeon =>
            (now - dungeon.lastUpdateTime) < maxAgeMs
        );
        const removed = before - this.dungeonList.length;
        if (removed > 0) {
            window.logger?.debug(CATEGORIES.DUNGEONS, 'dungeon_cleanup', {removed, maxAgeMs});
        }
        return removed;
    }
}