# Correções locais – 27/10/2026

## Alterado
- `web/scripts/drawings/ChestsDrawing.js`: baús com nomes não reconhecidos deixam de ser omitidos; são apresentados como verdes (raridade não verificada), desde que a opção de baús verdes esteja ativa. A identificação de raridades por nome mantém os critérios existentes.
- `web/scripts/handlers/ChestsHandler.js`: atualiza dados e posição de baús existentes; ignora eventos com coordenadas inválidas evitando falhas.
- `web/scripts/handlers/MobsHandler.js`: remove expressão inútil sem efeito.

## Limitações importantes
- O erro T1->T4 sugere desalinhamento entre IDs de criaturas do servidor e a ordem do catálogo local. **Não foi corrigido nem validado** sem um dump atual do jogo e captura do protocolo correspondente. Alterar o OFFSET arbitrariamente criaria mais mobs errados.
- Os eventos `NewTreasureChest` e `NewTreasureDestinationObject` não estão implementados na rota de renderização e não há dados de protocolo atualizados para interpretar suas coordenadas ou nomes com segurança. A presença de *todos* os tesouros dos Mists/Falls **não está garantida**.
- Esta é a fonte alterada, não um executável Windows recompilado. O Go 1.26 não pôde ser instalado neste ambiente offline.
- Para usar essas alterações é necessário recompilar o servidor Go que incorpora os recursos web via embed.
- Ferramentas de radar podem contrariar as regras do jogo; avalie o risco para a conta.
