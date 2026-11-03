// Os aspectos de coleta constam como MINIGUARDIAN no catalogo do Albion.
// GUARDIAN representa o guardiao maior e nao e confundido com mobs comuns.
const TYPES = new Set(['HIDE', 'FIBER', 'WOOD', 'ROCK', 'ORE']);
export function getResourceGuardianClass(mob) {
    if (!mob) return null;
    const loot = String(mob.lootType || '').toUpperCase();
    const name = String(mob.uniqueName || '').toUpperCase();
    const match = loot.match(/^(HIDE|FIBER|WOOD|ROCK|ORE)_(MINIGUARDIAN|GUARDIAN)(?:_ROADS)?$/);
    if (match && TYPES.has(match[1])) return match[2] === 'MINIGUARDIAN' ? 'aspect' : 'guardian';
    // Fallback conservador para registros cujo lootType nao foi enviado.
    const byName = name.match(/^T[1-8]_MOB_(?:(?:HIDE|FIBER|WOOD|ROCK|ORE)_)?(MINIGUARDIAN|GUARDIAN)(?:_|$)/);
    if (byName) return byName[1] === 'MINIGUARDIAN' ? 'aspect' : 'guardian';
    return null;
}
export function isResourceAspect(mob) {
    return getResourceGuardianClass(mob) === 'aspect';
}
export function isResourceGuardian(mob) {
    return getResourceGuardianClass(mob) === 'guardian';
}
