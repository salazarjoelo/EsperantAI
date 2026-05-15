# EsperantAI — Manuel utilisateur

> **Gestes sincères.** Contrôlez votre logiciel de streaming avec votre visage et vos mains. Pas de Stream Deck. Pas de matériel supplémentaire.

**Version** : 3.0 · **Langue** : Français (traductions disponibles dans 12 autres langues)

---

## Table des matières

1. [Qu'est-ce qu'EsperantAI ?](#quest-ce-quesperantai-)
2. [Configuration minimale](#configuration-minimale)
3. [Achat et activation](#achat-et-activation)
4. [Première utilisation](#première-utilisation)
5. [Connecter votre logiciel de streaming](#connecter-votre-logiciel-de-streaming)
6. [Configurer les gestes et les scènes](#configurer-les-gestes-et-les-scènes)
7. [Catégories de gestes](#catégories-de-gestes)
8. [Connecter les plateformes de streaming](#connecter-les-plateformes-de-streaming)
9. [Combinaisons Événement + Geste (Avancé)](#combinaisons-événement--geste-avancé)
10. [Sensibilité et zone morte](#sensibilité-et-zone-morte)
11. [Raccourcis clavier](#raccourcis-clavier)
12. [Historique des déclencheurs](#historique-des-déclencheurs)
13. [Changer la langue](#changer-la-langue)
14. [Gérer votre licence](#gérer-votre-licence)
15. [Dépannage](#dépannage)
16. [Confidentialité](#confidentialité)
17. [Support](#support)

---

## Qu'est-ce qu'EsperantAI ?

EsperantAI est une **application web** qui utilise l'intelligence artificielle pour détecter vos expressions faciales et vos gestes des mains en temps réel, et les traduit en commandes pour votre logiciel de streaming. Compatible avec :

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (bêta)

Et reçoit des événements de plateformes telles que :

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (pont multiplateforme)

### Pourquoi « gestes sincères » ?

Les expressions faciales de base et la rotation de la tête sont **universelles dans toutes les cultures humaines** (Paul Ekman, 1972). Elles ne mentent pas, elles ne varient pas selon la géographie. EsperantAI les appelle des gestes « 🌐 Universels » et les distingue des gestes « ⚠️ Culturels » (signes de la main), dont la signification peut varier selon les pays.

C'est vous qui décidez quels gestes utiliser en fonction de votre audience.

---

## Configuration minimale

### Matériel

- **N'importe quelle webcam USB** (recommandation : 1080p ou supérieur)
- **CPU** : tout processeur 4 cœurs ou plus des 5 dernières années
- **RAM** : 8 Go minimum. 16 Go recommandés si vous streamez simultanément.
- **GPU** : n'importe quel GPU avec support WebGL (même les GPU intégrés récents fonctionnent)

### Logiciel

- **OS** : Windows 10/11, macOS 12+ ou Linux avec noyau récent
- **Navigateur** : Chrome 90+, Edge 90+ ou Firefox 100+
- **Logiciel de streaming** (au moins un) : OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Requis pour **activer votre licence** et tous les **7 jours** pour la revalidation
- Fonctionne **jusqu'à 7 jours hors ligne** (période de grâce)

---

## Achat et activation

1. Rendez-vous sur **https://esperantai.com**
2. Cliquez sur **« Buy License »**
3. Effectuez le paiement via LemonSqueezy (carte, PayPal, etc.)
4. Vous recevrez un e-mail contenant :
   - Votre **clé de licence** (format : `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Un lien pour utiliser EsperantAI
5. Ouvrez EsperantAI dans votre navigateur
6. L'écran d'activation apparaîtra. Collez votre clé de licence
7. Cliquez sur **« Activate License »**
8. C'est fait ! 🎉

### Combien d'appareils ?

Une licence peut être activée sur **jusqu'à 3 appareils**. Pour transférer votre licence vers un autre appareil :

1. Sur l'ancien appareil : panneau **Advanced** → **License** → **Deactivate on this device**
2. Sur le nouvel appareil : activez normalement

---

## Première utilisation

### Étape 1 : Autoriser l'accès à la caméra

Lorsque vous ouvrez EsperantAI pour la première fois, votre navigateur vous demandera l'autorisation d'accéder à la caméra. **Acceptez**.

> Important : EsperantAI n'envoie jamais votre vidéo vers un serveur. Le traitement est 100 % local sur votre ordinateur.

### Étape 2 : Sélectionner la caméra

Si vous disposez de plusieurs caméras, choisissez celle à utiliser dans le menu déroulant.

### Étape 3 : Vérifier la détection

Vous verrez votre visage dans le panneau de gauche. Lorsqu'EsperantAI détecte votre visage, les indicateurs Yaw / Pitch / Roll commenceront à afficher des valeurs.

### Étape 4 : Assistant de calibrage (Pro+)

Si vous possédez une licence Pro ou Pro+, l'**Assistant de calibrage** se lance automatiquement lors de la première utilisation. Il mesure votre amplitude naturelle de mouvement et définit une sensibilité optimale. Vous pouvez le relancer à tout moment via le bouton **Recalibrate**.

---

## Connecter votre logiciel de streaming

### OBS Studio

1. Dans OBS : **Tools → WebSocket Server Settings**
2. Activez le WebSocket. Notez le mot de passe si vous en avez défini un.
3. Dans EsperantAI : panneau **Connection**
4. Logiciel de streaming : **OBS Studio**
5. URL WebSocket : `ws://127.0.0.1:4455` (par défaut)
6. Mot de passe : celui que vous avez défini dans OBS
7. Cliquez sur **Connect**

### Streamlabs Desktop

1. Dans Streamlabs : **Settings → Remote Control**
2. Activez le Remote Control
3. Notez l'API Token
4. Dans EsperantAI : Logiciel de streaming : **Streamlabs Desktop**
5. API Token : collez-le
6. Port : `59650` (par défaut)
7. Cliquez sur **Connect**

### vMix

1. Dans vMix : **Settings → Web Controller**
2. Activez le Web Controller. Port par défaut : 8088.
3. Dans EsperantAI : Logiciel de streaming : **vMix**
4. Hôte : `127.0.0.1`
5. Port : `8088`
6. Cliquez sur **Connect**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ nécessite l'installation manuelle du plugin obs-websocket
2. Téléchargez `obs-websocket` depuis le [forum OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Copiez-le dans le dossier des plugins de PRISM
4. Redémarrez PRISM
5. Activez le WebSocket dans **Tools → WebSocket Server Settings**
6. Dans EsperantAI : Logiciel de streaming : **PRISM Live Studio** (fonctionne comme OBS)

### XSplit Broadcaster (bêta)

1. Installez l'extension « Remote xjs » dans XSplit (Settings → Extensions)
2. Activez Remote dans les préférences
3. Dans EsperantAI : Logiciel de streaming : **XSplit**
4. URL du proxy Remote xjs : `ws://127.0.0.1:5555/xjs` (par défaut)
5. Cliquez sur **Connect**

> XSplit est en **bêta**. Certaines fonctionnalités avancées peuvent être limitées.

---

## Configurer les gestes et les scènes

Une fois connecté, les scènes réelles de votre logiciel apparaîtront automatiquement dans les listes déroulantes du panneau **Triggers**.

### Mappage de base

1. Pour chaque geste (par ex., « Look Left »), choisissez une scène dans la liste déroulante
2. Lorsque vous effectuez ce geste et le maintenez stable pendant ~150 ms, EsperantAI basculera vers cette scène dans votre logiciel de streaming
3. Le changement est automatique et quasi instantané

### Multi-action (Pro+)

Avec une licence Pro ou Pro+, un seul geste peut déclencher **plusieurs actions** simultanément :
- Changer de scène + jouer un son + afficher un overlay + envoyer un message dans le chat

### Activer / désactiver les catégories

Chaque catégorie possède sa propre case à cocher « Enable » :

- 🧠 **Rotation de la tête** (universel — activé par défaut)
- 📏 **Distance du visage** (se rapprocher/s'éloigner)
- 👁️ **Regard** (bouger uniquement les yeux)
- 😀 **Émotions** (sourire, surprise, colère, neutre)
- 👁️‍🗨️ **Double clin d'œil**
- ✋ **Gestes de la main** (culturel — désactivé par défaut)

Désactivez les catégories dont vous n'avez pas besoin pour économiser les ressources CPU.

---

## Catégories de gestes

### 🌐 Universels (même signification dans toutes les cultures)

| Geste | Axe | Comment l'activer |
|---|---|---|
| Centre | — | Regarder droit devant, visage stable |
| Regarder à gauche | yaw négatif | Tourner la tête vers la gauche |
| Regarder à droite | yaw positif | Tourner la tête vers la droite |
| Regarder en haut | pitch négatif | Lever le visage |
| Regarder en bas | pitch positif | Baisser le visage |
| Inclinaison à gauche | roll négatif | Incliner la tête vers l'épaule gauche |
| Inclinaison à droite | roll positif | Incliner la tête vers l'épaule droite |
| Se rapprocher | distance | Rapprocher le visage de la caméra |
| S'éloigner | distance | Éloigner le visage de la caméra |
| Direction du regard | regard | Bouger uniquement les yeux (tête centrée) |
| Sourire | émotion=heureux | Sourire clairement |
| Surpris | émutation=surprise | Avoir l'air surpris |
| En colère | émotion=colère | Avoir l'air en colère |
| Neutre | émotion=neutre | Visage détendu |
| Double clin d'œil | clin | Fermer les deux yeux deux fois rapidement (< 700 ms) |

### ⚠️ Culturels (la signification varie selon les pays)

| Geste | Signification occidentale | Précaution dans d'autres cultures |
|---|---|---|
| 👍 Pouce levé | Approbation | Moyen-Orient / Asie de l'Ouest : peut être offensant |
| ✌️ Paix | Paix / victoire | Royaume-Uni / Irlande / Australie (paume vers l'intérieur) : insulte |
| 🤘 Cornes de rock | Rock/metal | Italie (paume vers le bas) : « cornuto » (insulte) |
| 👌 OK | OK / parfait | Brésil / Turquie / Allemagne : peut être offensant |
| ✊ Poing fermé | Variable selon le contexte politique | — |
| 🖐️ Paume ouverte | « Stop » ou salutation | Grèce (mountza vers quelqu'un) : insulte grave |
| ☝️ Montrer du doigt | Indiquer | Asie : montrer du doigt est impoli |

EsperantAI marque chaque geste avec son badge correspondant dans l'interface. Choisissez lesquels utiliser en fonction de votre audience mondiale.

### 🙏 Gassho (合掌)

Un geste spécial : pressez les deux paumes l'une contre l'autre devant votre poitrine (comme une prière ou une salutation). Courant dans les cultures d'Asie de l'Est comme signe de respect ou de gratitude. Détecté avec une grande fiabilité grâce à 6 vérifications de points de repère.

---

## Connecter les plateformes de streaming

Pour qu'EsperantAI reçoive des événements (dons, abonnements, raids), connectez les plateformes sur lesquelles vous streamez.

### Twitch

1. Créez un Client ID sur https://dev.twitch.tv/console
2. Enregistrez l'URI de redirection : `https://esperantai.com/oauth-callback.html` (ou votre URL locale)
3. Dans EsperantAI : panneau **Platform Events** → **Twitch EventSub**
4. Collez votre Client ID
5. Cliquez sur **Connect**
6. Une fenêtre d'autorisation Twitch s'ouvrira. Acceptez les permissions.
7. La fenêtre se fermera et vous verrez « Twitch Connected »

### YouTube Live

1. Créez des identifiants sur https://console.cloud.google.com
2. Activez YouTube Data API v3
3. Créez un OAuth Client ID (type : Web Application)
4. Enregistrez la même URI de redirection que pour Twitch
5. Dans EsperantAI : panneau **Platform Events** → **YouTube Live**
6. Collez votre Client ID et cliquez sur **Connect**

### Kick

1. Créez une application sur https://kick.com/settings/developer
2. Enregistrez l'URI de redirection
3. Dans EsperantAI : panneau **Platform Events** → **Kick**
4. Collez votre Client ID et cliquez sur **Connect**
5. Kick utilise OAuth 2.1 avec PKCE (plus sécurisé)

### StreamElements (pont multiplateforme)

Si vous avez déjà un compte StreamElements, vous pouvez unifier Twitch + YouTube + Facebook avec un seul jeton :

1. Allez sur https://streamelements.com/dashboard/account/channels
2. Copiez votre JWT Token
3. Dans EsperantAI : panneau **Platform Events** → **StreamElements**
4. Collez le JWT et cliquez sur **Connect**

---

## Combinaisons Événement + Geste (Avancé)

Voici la magie d'EsperantAI : combiner des **événements de plateforme** avec **vos gestes** comme confirmation.

### Exemple : remercier les donateurs avec un pouce levé

1. Panneau **Event Triggers** → ligne « 💰 Donation »
2. ✅ Activez
3. Scène : `Thank_You_Scene`
4. Geste requis : `👍 Thumbs up`

**Déroulement en direct** :
- Un don arrive → EsperantAI affiche « Waiting for gesture... »
- Vous avez 5 secondes pour faire 👍
- Si vous le faites → bascule vers `Thank_You_Scene` + exécute les autres actions configurées
- Si vous ne le faites pas → l'événement est automatiquement ignoré

### Sans geste requis (déclenchement automatique)

Si vous laissez « Required gesture » sur `— none —`, l'événement déclenche l'action immédiatement.

Utile pour :
- Basculer automatiquement vers la scène de célébration lors d'un raid
- Afficher automatiquement un overlay lorsqu'un viewer s'abonne

---

## Sensibilité et zone morte

### Sensibilité

Les seuils déterminent l'amplitude nécessaire d'un geste pour le déclencher :

- **Yaw** : de combien tourner la tête sur le côté (par défaut : 0,15 rad ≈ 8,6°)
- **Pitch haut/bas** : inclinaison verticale
- **Roll** : inclinaison latérale

Augmentez les valeurs pour des gestes plus exagérés. Diminuez pour plus de sensibilité.

### Zone morte (anti-fatigue)

Si vous êtes presque centré (yaw < 0,05, pitch < 0,05, roll < 0,08), **RIEN ne se déclenche**. Cela vous permet de bouger naturellement sans que des micro-mouvements n'activent des déclencheurs.

### Images stables

`Stable frames` = nombre d'images consécutives pendant lesquelles le geste doit être maintenu avant le déclenchement. Par défaut : 5 images (~150 ms à 30 fps).

Augmentez si les déclencheurs s'activent trop facilement. Diminuez pour une réponse plus rapide.

### Temps de recharge

`Cooldown (ms)` = temps minimum entre les changements de scène. Par défaut : 500 ms.

Empêche le commutateur d'être « instable » si vous oscillez rapidement.

---

## Raccourcis clavier

| Touche | Action |
|---|---|
| `Espace` | Mettre en pause / Reprendre la détection |
| `C` | Basculer manuellement vers la scène CENTER |
| `R` | Recharger la liste des scènes depuis le logiciel |
| `Échap` | Se déconnecter |

---

## Historique des déclencheurs

Le panneau **Advanced → Trigger History** affiche les 50 dernières actions déclenchées :

- ✓ vert = réussi
- ✗ rouge = échoué
- · gris = en attente

Utile pour vérifier ce qui a été déclenché sans ouvrir les DevTools.

**Export CSV** : téléchargez l'historique pour une analyse hors ligne.

**Clear** : effacer l'historique (n'affecte rien d'autre).

---

## Changer la langue

EsperantAI détecte automatiquement la langue de votre système d'exploitation. Pour la modifier manuellement :

- Coin supérieur droit : menu déroulant des langues
- Sélectionnez la langue de votre choix
- L'interface se met à jour immédiatement

Langues disponibles :
- 🇺🇸 English
- 🇪🇸 Español (España)
- 🇲🇽 Español (México)
- 🇧🇷 Português (Brasil)
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇯🇵 日本語
- 🇷🇺 Русский
- 🇨🇳 中文
- 🇮🇹 Italiano
- 🇵🇱 Polski
- 🇸🇦 العربية (RTL)
- 🇰🇷 한국어

Les 13 langues sont entièrement traduites (342 clés chacune).

---

## Gérer votre licence

Panneau **Advanced → License** :

- **Voir le statut** : Valide / Invalide
- **Voir l'e-mail du client associé**
- **Voir la dernière validation en ligne**
- **Deactivate on this device** : à utiliser avant de changer de PC ou pour libérer un emplacement (sur les 3 disponibles)

### Remboursement

Si EsperantAI ne répond pas à vos attentes, vous disposez de **14 jours** à compter de l'achat pour demander un remboursement intégral. Envoyez un e-mail à soporte@edugame.digital avec votre clé de licence.

---

## Dépannage

### « Activation required » persiste après avoir collé ma clé de licence

- Vérifiez que vous avez copié la clé complète (5 groupes de 4 caractères séparés par des tirets)
- Vérifiez votre connexion Internet (l'activation nécessite une validation en ligne la première fois)
- Si vous avez déjà activé sur 3 appareils, désactivez-en un d'abord
- Contactez soporte@edugame.digital si le problème persiste

### « Searching for face... » persiste bien que mon visage soit visible

- Améliorez l'éclairage : votre visage doit être bien éclairé
- Rapprochez-vous de la caméra (40 à 80 cm est optimal)
- Fermez les autres onglets utilisant le GPU (Chrome peut limiter le GPU si trop d'onglets sont ouverts)
- Si le Memory Saver de Chrome est actif, désactivez-le pour cet onglet

### Les scènes n'apparaissent pas dans les listes déroulantes

- Vérifiez que vous êtes connecté au logiciel de streaming (badge vert « Connected »)
- Appuyez sur `R` pour recharger la liste des scènes
- Si toujours vide, déconnectez puis reconnectez-vous

### Les changements de scène se déclenchent sans que je fasse de gestes

- Augmentez le seuil de yaw / pitch / roll dans le panneau **Sensitivity**
- Augmentez `Stable frames` de 5 à 8-10
- Assurez-vous que la zone morte est configurée (yaw 0,05, pitch 0,05, roll 0,08)
- Vérifiez que personne d'autre n'est dans le cadre (plusieurs visages peuvent causer de l'instabilité)

### Latence de détection

- Fermez les applications gourmandes (jeux, montage vidéo)
- Vérifiez que vous utilisez le GPU dédié si vous en avez un (et non le GPU intégré)
- Réduisez la résolution de la caméra si elle est en 4K (1080p est optimal pour la détection)

### OBS ne réagit pas alors qu'EsperantAI indique « Scene changed »

- Vérifiez que le nom de la scène dans la liste déroulante correspond EXACTEMENT à celui dans OBS (sensible à la casse)
- Vérifiez que la scène ne se trouve pas dans une autre Collection de scènes
- Consultez le panneau **Trigger History** — s'il affiche ✗ rouge, il y a une erreur spécifique

### Erreur « OBS unreachable — Connect manually »

- Vérifiez qu'OBS est ouvert
- Vérifiez que le WebSocket est activé dans OBS
- Si vous avez défini un mot de passe dans OBS, il doit correspondre exactement
- Certains antivirus bloquent le port 4455 — ajoutez une exception

---

## Confidentialité

### Ce qu'EsperantAI NE fait PAS

- ❌ N'envoie PAS votre vidéo vers un serveur
- ❌ Ne stocke PAS votre vidéo ou des captures
- ❌ Ne collecte PAS d'informations biométriques à distance
- ❌ Ne partage PAS de données avec des annonceurs ou des tiers

### Ce qu'IL traite

- ✅ Détection faciale locale dans votre navigateur (Human.js + WebGL)
- ✅ Connexions locales à votre OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Validation périodique de la clé de licence (tous les 7 jours)
- ✅ Si vous connectez Twitch/YouTube/Kick : jetons OAuth dans sessionStorage (supprimés à la fermeture du navigateur)

Détails complets dans `docs/PRIVACY.html`.

---

## Support

- 📧 E-mail : **soporte@edugame.digital**
- 🌐 Web : https://esperantai.com
- 📚 Documentation technique : https://github.com/salazarjoelo/EsperantAI

Délais de réponse :
- Questions générales : 24 à 72 heures
- Bugs techniques : 1 à 3 jours ouvrés
- Demandes de remboursement : 1 à 2 jours ouvrés

---

*Dernière mise à jour : 2026-05-14. Version : 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
