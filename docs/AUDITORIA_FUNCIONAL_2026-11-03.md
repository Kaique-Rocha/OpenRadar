# OpenRadar — auditoria funcional e validação em jogo (03/11/2026)

Base revisada: `07171de8ad98cc6b55489967d0c8fed82e182293`.
**A implementação no código não equivale a um teste confirmado dentro do Albion.**

## Critérios
- **CONFIRMADO (usuário)**: comportamento observado em execução, não necessariamente correto em todas as situações.
- **IMPLEMENTADO / PENDENTE**: há handler/código, mas não foi confirmado no jogo atual.
- **FALHA RELATADA**: problema registrado pelo usuário que ainda precisa ser retestado.
- **NÃO IMPLEMENTADO**: caso reconhecido explicitamente como não utilizado pelo roteador.

| Função | Estado | Evidência / próximo teste |
|---|---|---|
| Iniciar aplicação e abrir radar no PC | CONFIRMADO (usuário) | Aplicação abre; não garante que o mapa seja preenchido |
| Receber e decodificar eventos Photon | CONFIRMADO (usuário) | Console mostrou evento 44 com campos 0, 1 e 252 |
| Evento 44 / NewSilverObject | IMPLEMENTADO / PENDENTE | Catálogo local mapeia 44 para NewSilverObject; validar código e renderização na versão atual |
| Desempenho em repouso | FALHA RELATADA | Logs aumentam mesmo parado e o jogo/PC travam; fix de supressão requer teste de FPS/CPU |
| Mostrar jogadores no mapa | IMPLEMENTADO / PENDENTE | NewCharacter/Move/Leave roteados; verificar jogo real |
| Posição do jogador local | IMPLEMENTADO / PENDENTE | Move Request/JoinMap com testes automatizados; verificar posição real |
| Mobs e níveis T1–T4 | FALHA RELATADA | Relato de mobs T1–T4 ausentes; retestar |
| Mobs de coleta, aspectos e drones avalonianos | FALHA RELATADA | Relato de entidades ausentes, apesar de correções de classificação |
| Recursos comuns e encantados | FALHA RELATADA | unknown_type_number: 33, 34, 43, 48, 49, 53 |
| Nós já vistos mantidos por distância | IMPLEMENTADO / PENDENTE | Commit c2d6211 altera raio de retenção |
| Baús, inclusive Tesouro Escondido | FALHA RELATADA | invalid_chest_position e desconhecidos; Tesouro não confirmado |
| Masmorras e portais Mists/Avalon | IMPLEMENTADO / PENDENTE | Handlers presentes; fluxos Mists/Falls foram relatados incompletos |
| Jaulas de wisps | IMPLEMENTADO / PENDENTE | NewCagedObject / CagedObjectStateUpdated no roteador |
| Pesca | IMPLEMENTADO / PENDENTE | NewFishingZoneObject / FishingFinished no roteador |
| Mapa e imagem de zona | FALHA RELATADA | 404 em TNL-278.webp |
| Interface, painel e filtros | IMPLEMENTADO / PENDENTE | Commits 79450e2, 07324c7 e teste estrutural 07171de; conferir uso real |
| Inventário, fama e dinheiro no radar | NÃO IMPLEMENTADO | Eventos explicitamente no-op no roteador |
| Executável Windows 10 x64 validado | PENDENTE | Build Go/Windows não validada pelo usuário para esta revisão |

## Ajustes de desempenho deste commit
1. Elimina duas emissões e a montagem duplicada de dados brutos para **cada** evento no EventRouter.
2. Remove dois testes anteriores que exigiam os logs volumosos; adiciona teste de não regressão para ausência de dump.
3. Limita logs frontend por categoria/evento a uma ocorrência por janela de 15 segundos, com mapa de chaves limitado.
4. Evita alocar entradas quando console e encaminhamento de logs estão desligados.
5. Sanitiza estruturas aninhadas de diagnóstico e reduz o buffer de transmissão de 200 para 100.
6. **Não modifica handlers de gameplay nem faz alegações de FPS medido**.

## Roteiro de confirmação do usuário
- Iniciar Albion e radar: idle 5 minutos, observar contador de logs, FPS, CPU e memória.
- Andar e mudar de mapa: posição, zona, mapa e imagem.
- Encontrar jogadores; mobs T1–T4; mobs T6/T7; recursos T4–T8 e encantamentos .1/.2/.3.
- Aproximar-se de aspectos, mobs de coleta, drones avalonianos e baús, incluindo Tesouro Escondido.
- Entrar em Mists, verificar wisps/jaulas e Abadia; sair e verificar limpeza dos elementos.
- Conferir que **DEBUG e dumps são desligados em uso normal**. Log de erro pontual permanece.
- Marcar cada item como PASSOU/FALHOU/SEM TESTE com versão do EXE e evidência.

## Limites desta auditoria
Não foi executado teste ao vivo de Albion nem compilação Windows neste commit. Testes no repositório verificam contratos de código; não provam comportamento real em jogo.
