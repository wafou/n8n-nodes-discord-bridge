# Changelog

## [0.1.0] - 2024-03-19

### Initial

- Fork du projet original [n8n-nodes-discord](https://github.com/edbrdi/n8n-nodes-discord)
- Renommage du projet en `n8n-nodes-discord-bridge`

### Ajouté

- Support des réactions Discord (ajout/suppression)
  - Nouveau type de déclencheur "Reaction" dans le nœud Discord Trigger
  - Ajout des champs `reactionEmoji` et `reactionAction` dans les données retournées
  - Possibilité de filtrer les réactions par canal et rôle
  - Support des emojis standards et personnalisés
