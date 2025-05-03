# n8n-nodes-discord-bridge

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

Ce projet est un fork de [n8n-nodes-discord](https://github.com/edbrdi/n8n-nodes-discord) avec des améliorations et des fonctionnalités supplémentaires.

[n8n](https://www.n8n.io) nœuds pour déclencher des workflows depuis Discord ou envoyer des messages interactifs. Utilise l'API des composants qui permet de créer des dialogues (par exemple, attacher des boutons et attendre que l'utilisateur clique dessus).

Ces nœuds n'utilisent pas de webhooks mais un bot Discord pour permettre une communication bidirectionnelle. Le bot se lance automatiquement dans un processus principal une fois configuré et transmet ou reçoit des données des processus enfants lorsqu'un nœud est exécuté.

## Installation

Suivez les instructions d'installation dans la [documentation des nœuds communautaires n8n](https://docs.n8n.io/integrations/community-nodes/installation/).

### Développement local

Pour commencer à développer ce nœud, vous pouvez utiliser les commandes suivantes :

```bash
# Installer les dépendances
npm install

# Démarrer la surveillance des changements
npm run dev

# Construire le nœud
npm run build
```

## Utilisation

Ce nœud fournit un pont entre n8n et Discord, vous permettant de :

- Déclencher des workflows n8n à partir d'événements Discord
- Envoyer des messages interactifs vers les canaux Discord
- Créer des dialogues avec des boutons et attendre les interactions des utilisateurs
- Suivre les réactions sur les messages

## Comment installer

### Nœuds Communautaires (Recommandé)

1. Allez dans **Paramètres > Nœuds Communautaires**.
2. Sélectionnez **Installer**.
3. Entrez `n8n-nodes-discord-bridge` dans **Entrer le nom du package npm**.
4. Acceptez les [risques](https://docs.n8n.io/integrations/community-nodes/risks/) d'utilisation des nœuds communautaires : sélectionnez **Je comprends les risques d'installation de code non vérifié depuis une source publique**.
5. Sélectionnez **Installer**.

Après l'installation du nœud, vous pouvez l'utiliser comme n'importe quel autre nœud. n8n affiche le nœud dans les résultats de recherche du panneau **Nœuds**.

### Installation manuelle

Pour commencer, installez le package dans votre répertoire racine n8n :

`npm install n8n-nodes-discord-bridge`

Pour les déploiements basés sur Docker, ajoutez la ligne suivante avant la commande d'installation de la police dans votre [Dockerfile n8n](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile) :

`RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-discord-bridge`

## Configuration du bot

Pour envoyer, écouter les messages, obtenir la liste des canaux ou des rôles, vous devez configurer un bot en utilisant le [Portail Développeur Discord](https://discord.com/developers/applications).

Premièrement, créez une application en cliquant sur **Nouvelle Application** dans le [Portail Développeur](https://discord.com/developers/applications).

Allez dans **OAuth2** et copiez l'ID client. Sur votre instance n8n, vous allez créer de nouvelles identifiants Discord App (**Identifiants > Nouveau > Rechercher "Discord App" > Continuer**) et coller l'ID Client dans le champ correspondant. Ne fermez pas encore la fenêtre.

![](images/oauth.png)

![](images/credentials.png)

Retournez sur le Portail Développeur Discord de votre application créée, allez dans **Bot** et cliquez sur **Ajouter Bot**. Dans le **Flux d'Autorisation**, désactivez **Bot Public**. Activez tous les **Intents Privilégiés de la Passerelle** puis sauvegardez vos modifications.

![](images/bot-1.png)

Allez dans **OAuth > Générateur d'URL**, sélectionnez les scopes **bot** et **applications.commands**, la permission du bot **administrateur** puis copiez l'URL générée en bas.

![](images/url-gen.png)

Utilisez maintenant ce lien pour ajouter le bot à votre serveur Discord. Vous devez être connecté à Discord sur le navigateur avec le même compte où vous avez les permissions **Gérer le Serveur** ou **Administrateur** sur le serveur où vous voulez ajouter le bot.

Une fois votre bot ajouté à votre serveur, vous devez obtenir le token du bot et l'ajouter à vos identifiants Discord App. Cliquez simplement sur **Copier** sur votre page de bot ou **Réinitialiser le Token** si le bouton **Copier** n'est pas visible.

![](images/bot-2.png)

![](images/credentials-2.png)

Sauvegardez vos identifiants et allez dans **Paramètres > API n8n**, cliquez sur **Créer une Clé API** ou sélectionnez celle existante, copiez la clé, rouvrez vos identifiants Discord App (**Identifiants > Ouvrir**), collez la clé dans le champ **Clé API n8n** et définissez votre URL de base (par exemple https://n8n.example.com/api/v1). N'oubliez pas de sauvegarder à nouveau.

![](images/n8n-api.png)

![](images/credentials-3.png)

Vous pourrez maintenant utiliser les nœuds **Discord Trigger** et **Discord Send** dans vos workflows. La première fois que vous configurez l'un de ces nœuds, il démarrera le bot.

## Référence du Nœud Discord Trigger

- **Identifiants pour Discord App** : Si vous avez suivi le guide de configuration du bot ci-dessus, vous pourrez sélectionner vos identifiants Discord App pour démarrer le bot. Si vous utilisez déjà un autre nœud Discord Trigger (ou Send), faites attention à sélectionner les mêmes identifiants. Il n'est pas prévu pour le moment d'être utilisé avec plusieurs serveurs Discord.
- **Écouter** : Vous permet de sélectionner les canaux texte que vous souhaitez surveiller pour déclencher le workflow. Si aucun n'est sélectionné, tous les canaux seront surveillés. Vos identifiants doivent être configurés et le bot en cours d'exécution, vous avez également besoin d'au moins un canal texte disponible. Si vous ne remplissez pas ces conditions, effectuez les modifications puis fermez et rouvrez la fenêtre (la liste des canaux est chargée lorsque la fenêtre s'ouvre). Pour les types de déclencheurs "Utilisateur", si vous souhaitez utiliser un placeholder, sélectionnez le canal où vous voulez qu'il s'affiche.
- **Depuis les rôles** : La même logique s'applique ici pour les rôles, sauf qu'elle est optionnelle. Si vous ne sélectionnez aucun rôle, il écoutera **@everyone**.
- **Type de déclencheur** : Type d'événement à écouter. Les événements utilisateur doivent spécifier un canal à écouter si vous souhaitez utiliser un placeholder ou l'option "envoyer au canal de déclenchement" dans un nœud Discord Send.
  - **Message** : Écouter les messages envoyés dans les canaux sélectionnés.
  - **Commande** : Écouter les commandes envoyées dans les canaux sélectionnés.
  - **Interaction** : Écouter les boutons/select persistants.
  - **Réaction** : Écouter les réactions ajoutées ou supprimées sur les messages.
  - **Utilisateur rejoint** : Écouter les utilisateurs rejoignant le serveur.
  - **Utilisateur quitte** : Écouter les utilisateurs quittant le serveur.
  - **Mise à jour de présence utilisateur** : Écouter les changements de présence des utilisateurs.
  - **Rôle utilisateur ajouté** : Écouter les rôles ajoutés aux utilisateurs.
  - **Rôle utilisateur supprimé** : Écouter les rôles supprimés des utilisateurs.
- **Présence** : Si le type de déclencheur est une mise à jour de présence. Type de présence à écouter.
  - **Tout changement** : Lorsqu'une présence utilisateur est mise à jour.
  - **En ligne** : Lorsqu'une présence utilisateur est définie sur en ligne.
  - **Hors ligne** : Lorsqu'une présence utilisateur est définie sur hors ligne.
  - **Ne pas déranger** : Lorsqu'une présence utilisateur est définie sur ne pas déranger.
  - **Inactif** : Lorsqu'une présence utilisateur est définie sur inactif.
- **Depuis les rôles** : Lors de l'écoute des mises à jour de rôle utilisateur, sélectionnez quel rôle supprimé ou ajouté doit correspondre.
- **ID du message** : Si le type de déclencheur est une interaction. L'ID du message du bouton/select à écouter.
- **Motif** : Messages uniquement. Sélectionnez comment la valeur ci-dessous sera reconnue. ⚠ Gardez à l'esprit que la valeur sera testée avec toutes les mentions supprimées et un trim appliqué (espaces supprimés au début et à la fin). Par exemple `@bot hello` sera testé sur `hello`.
  - **Égal** : Correspond à la valeur exacte.
  - **Commence par** : Correspond au début du message avec la valeur spécifiée.
  - **Contient** : Correspond à la valeur à n'importe quelle position dans le message.
  - **Se termine par** : Correspond à la fin du message avec la valeur spécifiée.
  - **Regex** : Correspond à l'expression régulière ECMAScript personnalisée fournie.
- **Valeur** : Messages uniquement. La valeur que vous testerez sur tous les messages écoutés.
- **Sensible à la casse** : Messages uniquement. Détermine s'il sera sensible à la casse lors de la correspondance de la valeur.
- **Mention du bot** : Messages uniquement. Si vrai, un message devra également mentionner le bot pour déclencher le workflow (cela n'exclut pas les autres critères).
- **Nom** : Commande uniquement. Le nom de la commande à écouter.
- **Description** : Commande uniquement. La description de la commande à écouter.
- **Type de champ d'entrée** : Commande uniquement. Le type du champ d'entrée.
- **Description du champ d'entrée** : Commande uniquement. La description du champ d'entrée.
- **Champ d'entrée requis** : Commande uniquement. Si le champ d'entrée est requis.
- **Placeholder** : Le placeholder est un message qui apparaîtra dans le canal qui déclenche le workflow. Trois points animés ajoutés au placeholder indiquent que le workflow est en cours d'exécution. À partir d'un nœud Discord Send, vous pouvez configurer un message de réponse qui remplacera alors ce placeholder.

/!\ N'oubliez pas d'activer votre déclencheur, même si vous voulez juste le tester.

### Données retournées

- **content** : Le contenu du message déclencheur (si type message).
- **channelId** : L'ID du canal déclencheur.
- **userId** : L'ID de l'utilisateur déclencheur.
- **userName** : Le nom d'utilisateur déclencheur.
- **userTag** : Le tag de l'utilisateur déclencheur.
- **interactionValues** : Les valeurs d'interaction déclencheuses (si type interaction).
- **messageId** : L'ID du message déclencheur (si type message).
- **presence** : Le statut de présence déclencheur (si type mise à jour de présence).
- **addedRoles** : Le rôle ajouté déclencheur (si type rôle ajouté).
- **removedRoles** : Le rôle supprimé déclencheur (si type rôle supprimé).
- **userRoles** : Liste des IDs de rôles de l'utilisateur déclencheur (si type déclencheur interaction).
- **attachments** : Le tableau des pièces jointes déclencheuses (si type message && pièces jointes envoyées).
- **reactionEmoji** : L'emoji utilisé dans la réaction (si type réaction).
- **reactionAction** : Le type d'action de réaction ('add' ou 'remove') (si type réaction).

## Référence du Nœud Discord Send

- **Identifiants pour Discord App** : Si vous avez suivi le guide de configuration du bot ci-dessus, vous pourrez sélectionner vos identifiants Discord App pour démarrer le bot. Si vous utilisez déjà un autre nœud Discord Trigger (ou Send), faites attention à sélectionner les mêmes identifiants. Il n'est pas prévu pour le moment d'être utilisé avec plusieurs serveurs Discord.
- **Remplacer le placeholder du déclencheur** : Si actif, le message produit par ce nœud remplacera le placeholder précédent défini. Il peut s'agir d'un placeholder défini par le nœud Discord Trigger ou par un autre nœud Discord Send.
- **Envoyer au canal du déclencheur** : Si actif, le message produit sera envoyé au même canal où le workflow a été déclenché (mais ne remplacera pas le placeholder s'il y en a un).
- **Envoyer à** : Vous permet de spécifier les canaux texte où vous souhaitez envoyer le message. Vos identifiants doivent être configurés et le bot en cours d'exécution, vous avez également besoin d'au moins un canal texte disponible. Si vous ne remplissez pas ces conditions, effectuez les modifications puis fermez et rouvrez la fenêtre (la liste des canaux est chargée lorsque la fenêtre s'ouvre).
- **Type** : Vous permet de choisir le type d'interaction que vous souhaitez effectuer.

  - **Message** : C'est le type par défaut, il vous permet d'envoyer un message sans nécessiter de réponse.
    - **Contenu** : Message texte affiché.
    - **Embed** : Si actif, il permettra la création de messages enrichis comme ceci : ![](images/embed.png)
      - **Couleur** (1)
      - **Titre** (2)
      - **URL** (3)
      - **Nom de l'auteur** (4)
      - **URL de l'icône de l'auteur ou base64** (5)
      - **URL de l'auteur** (6)
      - **Description** (7)
      - **URL de la miniature ou base64** (8)
      - **Champs** (9)
        - **Champ** : Si vous ajoutez un champ vide (pas de titre/valeur), il créera un espace dans l'embed.
          - **Titre** (10)
          - **Valeur** (11)
          - **En ligne** (12)
      - **URL de l'image ou base64** (13)
      - **Texte du pied de page** (14)
      - **URL de l'icône du pied de page ou base64** (15)
      - **Date affichée** (16)
    - **Fichiers** : Permet d'attacher jusqu'à 5 images au message.
      - **URL ou base64** : URL/base64 de l'image à attacher (png, jpg).
  - **Invite avec Boutons** : Il vous permet d'envoyer un dialogue interactif avec des boutons sur lesquels les utilisateurs peuvent cliquer. L'exécution du workflow attendra jusqu'à ce que quelqu'un réponde.
    - **Contenu** : Message texte affiché.
    - **Boutons** : Discord permet d'ajouter jusqu'à 5 boutons.
      - **Bouton**
        - **Label** : Label affiché sur le bouton.
        - **Valeur** : Valeur retournée par le nœud si cliqué.
        - **Style** : Vous pouvez choisir entre 4 styles différents (primary, secondary, success, danger).
    - **Délai d'attente** : Temps (secondes) pendant lequel votre workflow attendra avant de passer au nœud suivant (ou d'arrêter l'exécution). Le temps restant sera affiché et mis à jour à la fin du message texte. Si le délai est égal à 0, il attendra indéfiniment.
    - **Restreindre à l'utilisateur déclencheur** : Seul l'utilisateur déclenchant le workflow pourra interagir (les autres seront ignorés).
    - **Restreindre aux rôles mentionnés** : Seuls les utilisateurs ayant l'un des rôles mentionnés pourront interagir (les autres seront ignorés).
  - **Invite avec Select** : Même chose que l'invite avec boutons, mais il affichera une liste déroulante au lieu de boutons.
    - **Contenu** : Message texte affiché.
    - **Select**
      - **Option**
        - **Label** : Label affiché sur l'option.
        - **Description** : Description affichée optionnelle.
        - **Valeur** : Valeur retournée par le nœud si sélectionnée.
    - Les autres paramètres sont les mêmes que pour l'invite avec boutons.
  - **Action** : Au lieu d'envoyer un message, il effectuera une action définie dans le champ suivant.
    - **Action** : Vous permet de choisir le type d'action que vous souhaitez effectuer. D'autres types seront ajoutés à l'avenir.
      - **Supprimer des messages** : Supprimer les derniers messages du canal "envoyer à".
        - **Combien ?** : Nombre de derniers messages à supprimer (l'API Discord permet max 150 et messages < 4 semaines).
      - **Ajouter un rôle à l'utilisateur** : Ajouter un rôle à un utilisateur.
        - **ID utilisateur** : Utilisateur auquel ajouter le rôle.
        - **Quels rôles** : Rôles à ajouter à l'utilisateur.
      - **Supprimer un rôle de l'utilisateur** : Supprimer un rôle d'un utilisateur.
        - **ID utilisateur** : Utilisateur duquel supprimer le rôle.
        - **Quels rôles** : Rôles à supprimer de l'utilisateur.

- **Persistant** : Disponible pour le type invite. Si actif, le bouton/select restera visible même lorsque le workflow est terminé.
  - **Sélection min** : Disponible pour le type invite select. Nombre minimum d'options qui peuvent être sélectionnées.
  - **Sélection max** : Disponible pour le type invite select. Nombre maximum d'options qui peuvent être sélectionnées.
  - **ID du message** : Si vous voulez modifier un message d'invite précédent au lieu d'en créer un nouveau, vous pouvez spécifier l'ID du message.
- **Mentionner les rôles** : Vous permet de spécifier les rôles que vous souhaitez mentionner dans le message. Vos identifiants doivent être configurés et le bot en cours d'exécution, vous avez également besoin d'au moins un rôle (à part @everyone) disponible. Si vous ne remplissez pas ces conditions, effectuez les modifications puis fermez et rouvrez la fenêtre.
- **Placeholder** : Non disponible pour les messages simples. Le placeholder est un message qui apparaîtra dans le canal où le bouton ou l'invite select est affiché. Trois points animés ajoutés au placeholder indiquent que le workflow est en cours d'exécution. À partir d'un autre nœud Discord Send, vous pouvez configurer un message de réponse qui remplacera alors ce placeholder.
- **Personnalisation du bot** : Activez cette option pour personnaliser l'activité et le statut du bot.
  - **Activité du bot** : Lorsque vous définissez une activité du bot, elle sera affichée dans la section "En train de jouer" du profil du bot. Vous devez rafraîchir l'activité périodiquement si vous voulez la maintenir.
  - **Type d'activité du bot** : Vous permet de personnaliser le type d'activité affiché sur le profil du bot.
  - **Statut du bot** : Vous permet de personnaliser le statut du bot (si une activité du bot est également définie).

### Données retournées

- **value** : Si type invite bouton/select, retourne la valeur de la sélection de l'utilisateur.
- **channelId** : L'ID du canal où le message est envoyé.
- **userId** : Si type invite bouton/select, retourne l'ID de l'utilisateur interagissant.
- **userName** : Si type invite bouton/select, retourne le nom d'utilisateur de l'utilisateur interagissant.
- **userTag** : Si type invite bouton/select, retourne le tag de l'utilisateur interagissant.
- **messageId** : L'ID du message envoyé.
- **action** : Si type action, retourne l'action effectuée (pour le moment le seul type disponible est removeMessages).

## Commandes

Pour vous aider à créer et déboguer votre workflow avec les nœuds Discord Trigger/Send, certaines commandes ont été enregistrées pour le bot.

- `/logs` : Affiche les derniers logs stockés en mémoire (max 100).
  - **Avec paramètres**
    - `/logs 10` : Si vous spécifiez un nombre, il affichera le nombre de derniers logs.
    - `/logs clear` : Supprime tous les logs en mémoire.
    - `/logs on` : Les logs sont automatiquement envoyés dans le canal actuel.
    - `/logs off` : Désactive les logs automatiquement envoyés dans le canal.
- `/clear` : Supprime les derniers messages (max 100) dans le canal actuel.
  - **Avec paramètres**
    - `/clear 10` : Si vous spécifiez un nombre, il supprimera le nombre de derniers messages.
- `/test` : Bascule le mode test. Le mode test bascule le bot Discord sur l'URL de test du déclencheur. Utile si vous voulez voir comment un workflow est exécuté et comment les données sont transmises. Une fois le mode test activé, allez dans l'interface Discord Trigger et cliquez sur **Récupérer l'événement de test** puis sur Discord envoyez un message pour déclencher le workflow.
  - **Avec paramètres**
    - `/test true` : Active le mode test.
    - `/test false` : Désactive le mode test.

## Dépannage

- Il y a un [problème connu](https://github.com/edbrdi/n8n-nodes-discord/issues/10) avec le processus de mise à jour ou certaines nouvelles installations résultant en l'icône Discord manquante (nœuds non reconnus). Pour résoudre ce problème, vous devez simplement redémarrer n8n.
- Si vous ne pouvez pas mettre à jour les nœuds via l'interface, essayez de les désinstaller et de les réinstaller.
- Avant de signaler un problème, assurez-vous d'avoir correctement configuré le bot (en particulier les permissions) et que vos déclencheurs sont activés. Vous ne pouvez pas tester un déclencheur non activé.

## Captures d'écran

![](images/screen-1.png)

![](images/screen-2.png)

## Licence

MIT License

Copyright (c) 2024 [https://github.com/edbrdi](https://github.com/edbrdi)

Permission est accordée, gratuitement, à toute personne obtenant une copie
de ce logiciel et des fichiers de documentation associés (le "Logiciel"), de traiter
le Logiciel sans restriction, y compris, sans limitation, les droits
d'utiliser, de copier, de modifier, de fusionner, de publier, de distribuer, de sous-licencier,
et/ou de vendre des copies du Logiciel, et de permettre aux personnes à qui le Logiciel est
fourni de le faire, sous réserve des conditions suivantes :

L'avis de droit d'auteur ci-dessus et cet avis d'autorisation doivent être inclus dans toutes
les copies ou parties substantielles du Logiciel.

LE LOGICIEL EST FOURNI "TEL QUEL", SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU
IMPLICITE, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES DE QUALITÉ MARCHANDE,
D'ADÉQUATION À UN USAGE PARTICULIER ET DE NON-VIOLATION. EN AUCUN CAS LES
AUTEURS OU DÉTENTEURS DU DROIT D'AUTEUR NE SERONT RESPONSABLES DE TOUTE RÉCLAMATION,
DOMMAGE OU AUTRE RESPONSABILITÉ, QUE CE SOIT DANS UNE ACTION DE CONTRAT, DE DÉLIT
OU AUTRE, DÉCOULANT DE, OU EN RELATION AVEC LE LOGICIEL OU L'UTILISATION OU D'AUTRES
TRANSACTIONS DANS LE LOGICIEL.
