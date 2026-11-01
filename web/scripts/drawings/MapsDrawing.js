import {DrawingUtils} from "../utils/DrawingUtils.js";
import {CATEGORIES} from "../constants/LoggerConstants.js";
import settingsSync from "../utils/SettingsSync.js";
import imageCache from "../utils/ImageCache.js";
import zonesDatabase from "../data/ZonesDatabase.js";

export class MapDrawing extends DrawingUtils
{
    interpolate(curr_map, lpX, lpY , t)
    {
        const hX = lpX;
        const hY = -lpY;

        curr_map.hX = this.lerp(curr_map.hX, hX, t);
        curr_map.hY = this.lerp(curr_map.hY, hY, t);
    }

    draw(ctx, curr_map)
    {
        if (curr_map.id < 0)
            return;

        const zoom = this.getZoomLevel();
        const scaleFactor = 4 * zoom;
        const id = curr_map.id.toString();
        const extent = zonesDatabase.getMapAssetExtent(id);
        const center = zonesDatabase.getMapAssetCenter(id);
        const size = extent * scaleFactor;
        const adjX = (curr_map.hX - center.x) * scaleFactor;
        const adjY = (curr_map.hY + center.y) * scaleFactor;
        this.DrawImageMap(ctx, adjX, adjY, id, size, size);
    }
    DrawImageMap(ctx, x, y, imageName, drawWidth, drawHeight)
    {
        // Fill background => if no map image or corner to prevent glitch textures
        ctx.fillStyle = '#1a1c23';
        ctx.fillRect(0, 0, ctx.width, ctx.height);

        if (!settingsSync.getBool("settingShowMap", true)) return;

        if (imageName === undefined || imageName == "undefined")
            return;

        // Instâncias aleatórias usam UUID e não possuem imagem estática no projeto.
        // Os dois túneis abaixo também foram confirmados ausentes no catálogo.
        // Mantém o fundo neutro e a sobreposição de entidades sem gerar HTTP 404.
        const hasNoStaticAsset = String(imageName).startsWith("@RANDOMDUNGEON@") ||
            imageName === "TNL-272" || imageName === "TNL-281";
        if (hasNoStaticAsset) {
            ctx.save();
            ctx.fillStyle = '#a8afbd';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Mapa interno sem imagem disponível', ctx.width / 2, 24);
            ctx.restore();
            return;
        }

        const src = "/images/Maps/" + imageName + ".webp";

        const preloadedImage = imageCache.GetPreloadedImage(src, "Maps");

        if (preloadedImage === null) return;

        if (preloadedImage)
        {
            ctx.save();

            ctx.scale(1, -1);
            const center = this.getCanvasCenter();
            ctx.translate(center, -center);

            ctx.rotate(-0.785398);
            ctx.translate(-x, y);

            ctx.drawImage(preloadedImage, -drawWidth/2, -drawHeight/2, drawWidth, drawHeight);
            ctx.restore();
        }
        else
        {
            imageCache.preloadImageAndAddToList(src, "Maps")
            .then(() => {
                window.logger?.info(CATEGORIES.MAP, 'map_loaded', {src: src});
            })
            .catch((error) => {
                window.logger?.warn(CATEGORIES.MAP, 'map_load_failed', {src: src, error: error?.message});
            });
        }
    }
}