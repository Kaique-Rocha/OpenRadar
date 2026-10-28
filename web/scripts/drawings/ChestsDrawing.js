import {DrawingUtils} from "../utils/DrawingUtils.js";
import settingsSync from "../utils/SettingsSync.js";

export class ChestsDrawing extends DrawingUtils {
    interpolate(chests, lpX, lpY, t) {
        for (const chestOne of chests) {
            this.interpolateEntity(chestOne, lpX, lpY, t);
        }
    }

    // Resolve a chest's visual rarity without discarding unrecognised treasure names.
    // Unknown chests are deliberately shown as green instead of silently disappearing.
    getChestColor(chest) {
        const name = String(chest.chestName ?? '').toLowerCase();
        if (/(legendary|yellow|gold)/.test(name)) return ['settingChestYellow', 'legendary'];
        if (/(rare|purple|epic)/.test(name)) return ['settingChestPurple', 'rare'];
        if (/(uncommon|blue)/.test(name)) return ['settingChestBlue', 'blue'];
        if (/(standard|common|green)/.test(name)) return ['settingChestGreen', 'green'];
        // Never guess that an unknown name is a high-value chest.
        // Numeric rarity values vary by event, so do not pretend they are a verified tier.
        return ['settingChestGreen', 'green'];
    }

    invalidate(ctx, chests) {
        for (const chest of chests) {
            const [setting, asset] = this.getChestColor(chest);
            if (!settingsSync.getBool(setting)) continue;
            const point = this.transformPoint(chest.hX, chest.hY);
            this.DrawCustomImage(ctx, point.x, point.y, asset, 'Resources', 35);
        }
    }
}
