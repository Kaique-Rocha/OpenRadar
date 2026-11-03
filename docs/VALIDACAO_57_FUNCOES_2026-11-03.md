# OpenRadar — registro de 57 verificações (03/11/2026)

Origem: checklist preenchido pelo jogador usando o executável do workflow 41645624476.

**IMPORTANTE:** coluna de status refere-se à versão **antes** deste commit. Uma alteração de código não muda automaticamente o status de um teste real.

Resumo: 30 funcionavam, 12 falhavam, 15 não testados.

| Nº | Função | Estado anterior | Observações |
|---:|---|---|---|
| 1 | Abrir radar no Windows | Funcionava no teste | — |
| 2 | Abrir painel no navegador | Funcionava no teste | — |
| 3 | Conectar WebSocket | Funcionava no teste | — |
| 4 | Selecionar placa de rede | Funcionava no teste | — |
| 5 | Captura Photon | Não testado | — |
| 6 | Evento 44 (prata no chão) | Não testado | — |
| 7 | Personagem parado por 5 minutos | Não testado | — |
| 8 | Andando / combate | Não testado | — |
| 9 | DEBUG desativado | Não testado | — |
| 10 | Erros relevantes no console | Não testado | — |
| 11 | Gravação de pacotes PCAP | Não testado | — |
| 12 | Carregar imagem do mapa | Funcionava no teste | — |
| 13 | Zona atual correta | Funcionava no teste | — |
| 14 | Posição do personagem | Funcionava no teste | — |
| 15 | Troca de mapas | Funcionava no teste | — |
| 16 | Zoom do radar | Funcionava no teste | — |
| 17 | Tamanho do radar | Funcionava no teste | — |
| 18 | Tamanho dos ícones | Funcionava no teste | — |
| 19 | Mostrar/ocultar mapa | Funcionava no teste | — |
| 20 | Detectar jogadores próximos | Funcionava no teste | — |
| 21 | Diferenciar hostis / facção / passivos | Funcionava no teste | — |
| 22 | Alertas sonoros | Funcionava no teste | Funciona de forma intermitente (relato do jogador) |
| 23 | Alertas visuais / flash | Não testado | — |
| 24 | Mobs T1–T4 | Funcionava no teste | — |
| 25 | Mobs T5–T8 | Funcionava no teste | — |
| 26 | Mobs encantados / buffados | Funcionava no teste | — |
| 27 | Mobs de coleta | Funcionava no teste | — |
| 28 | Aspectos | Falha relatada | Aparece, mas não é diferenciado visualmente |
| 29 | Guardiões | Falha relatada | — |
| 30 | Drones avalonianos | Não testado | Ainda não encontrado no jogo |
| 31 | Inimigos não gerenciados | Não testado | Jogador não reconheceu esta categoria |
| 32 | Inimigos de evento | Não testado | Jogador não reconheceu esta categoria |
| 33 | Recursos T4–T8 | Funcionava no teste | — |
| 34 | Recursos .1 / .2 / .3 | Funcionava no teste | — |
| 35 | Quantidades disponíveis | Funcionava no teste | — |
| 36 | Distância dos recursos | Funcionava no teste | — |
| 37 | Agrupamento dos recursos | Falha relatada | — |
| 38 | Permanência / remoção por distância | Funcionava no teste | — |
| 39 | Recursos vivos / cadáveres | Funcionava no teste | — |
| 40 | Baú verde | Falha relatada | — |
| 41 | Baú azul | Falha relatada | — |
| 42 | Baú roxo | Falha relatada | — |
| 43 | Baú amarelo/dourado | Falha relatada | — |
| 44 | Tesouros escondidos | Funcionava no teste | — |
| 45 | Posicionamento de baús | Falha relatada | — |
| 46 | Portais e masmorras | Falha relatada | — |
| 47 | Mists comuns e letais | Funcionava no teste | — |
| 48 | Jaulas de wisps | Funcionava no teste | — |
| 49 | Abadia de Knightfall | Falha relatada | — |
| 50 | Saída de Mists/Abadia | Falha relatada | — |
| 51 | Pesca | Não testado | — |
| 52 | Filtros rápidos | Não testado | — |
| 53 | Painéis, abas e layout | Funcionava no teste | — |
| 54 | Configuração persistente | Funcionava no teste | — |
| 55 | Arquivos de log | Não testado | — |
| 56 | Logs por categoria | Não testado | — |
| 57 | Portal sazonal do evento de Halloween | Falha relatada | Portal luminoso de Halloween; pacote de origem não identificado |

## Nova versão: retestes obrigatórios
- Aspectos e guardiões: verificar identificação especial e contraste do círculo
- Agrupamento de recursos: repetir com limites padrão (raio 30, mínimo 2), incluindo zonas movimentadas
- Baús verde, azul, roxo e dourado: testar cada cor, coordenadas e identificação efetiva (sem presumir que todos estejam corrigidos)
- Portais e masmorras: verificar spawns, coordenadas, visibilidade e remoção
- Abadia de Knightfall: verificar entrada com nome em índices 16, 15 ou 3
- Saída de Mists/Abadia: verificar limpeza ao mudar de mapa
- Portal sazonal de Halloween: **não corrigido/sem evento conhecido**; requer fixture PCAP ou log estruturado de spawn
- Desempenho: repouso 5 minutos, FPS, CPU e logs, sem ativar DEBUG contínuo

Nenhuma execução de Albion ao vivo ocorreu durante esta revisão. 
