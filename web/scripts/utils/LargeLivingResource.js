// Identificacao conservadora: variantes grandes de recursos vivos conhecidas pelo nome interno.
// Nao assume que HP alto sozinho significa um spot grande.
export function isLargeLivingResource(mob) {
    if (!mob || typeof mob.uniqueName !== 'string') return false;
    if (mob.name !== 'Hide' && mob.name !== 'Fiber' && mob.name !== 'Log'
        && mob.name !== 'Rock' && mob.name !== 'Ore') return false;
    const name = mob.uniqueName.toUpperCase();
    if (!name.includes('_MOB_CRITTER_')) return false;
    return /_(VETERAN|ELITE)(?:_|$)/.test(name);
}
