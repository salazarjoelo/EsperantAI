# EsperantAI — Manuel d'utilisation

> **Gestes honnêtes.** Contrôlez votre logiciel de streaming avec votre visage et vos mains, sans matériel supplémentaire dédié.

**Version** : 3.0 · **Langue** : Français (traductions disponibles dans 14 autres langues)

**Validation technique** : vérifié à partir de la documentation officielle disponible au **20 mai 2026** pour OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo et StreamElements. Détail : [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

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

EsperantAI est une **application web** qui utilise l'intelligence artificielle pour détecter vos gestes du visage et des mains en temps réel, puis les traduit en commandes pour votre logiciel de streaming. La vidéo de votre caméra est traitée localement dans votre navigateur.

![Flux local d'EsperantAI](assets/manual/01-esperantai-flow.svg)

Fonctionne avec les logiciels de diffusion suivants :

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (bêta)

Il peut aussi recevoir des événements de plateformes pour les combiner avec vos gestes :

- **Twitch** : prise en charge directe via EventSub WebSocket.
- **YouTube Live** : prise en charge directe via YouTube Data API v3 ; un direct actif et un quota disponible sont requis.
- **Kick** : prise en charge bêta/limitée dans le navigateur. Les événements Kick complets exigent un backend, des webhooks officiels ou un pont.
- **StreamElements** : pont multiplateforme avec le token/JWT de votre compte.
- **Trovo** : un adaptateur technique existe dans le code, mais le panneau public de connexion n'est pas encore exposé dans l'interface actuelle.

### Pourquoi « gestes honnêtes » ?

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

1. Rendez-vous sur **https://edugame.digital**
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

![Matrice de connexion des logiciels de streaming](assets/manual/02-software-setup.svg)

Toutes les connexions de cette section sont locales : EsperantAI communique avec le logiciel de diffusion qui tourne sur le même ordinateur via `127.0.0.1`.

### OBS Studio

1. Dans OBS : **Outils → Paramètres du serveur WebSocket**
2. Activez le serveur WebSocket. OBS Studio 28+ inclut déjà obs-websocket.
3. Dans EsperantAI : panneau **Connexion**
4. Logiciel de streaming : **OBS Studio**
5. URL WebSocket : `ws://127.0.0.1:4455` (par défaut)
6. Mot de passe : celui que vous avez configuré dans OBS, si vous en avez activé un
7. Cliquez sur **Connecter**

### Streamlabs Desktop

1. Dans Streamlabs Desktop : **Settings → Remote Control**
2. Activez le contrôle distant local
3. Copiez l'**API Token** depuis l'écran Remote Control
4. Dans EsperantAI : Logiciel de streaming : **Streamlabs Desktop**
5. Token API : collez-le
6. Port : `59650` (par défaut)
7. Cliquez sur **Connecter**

### vMix

1. Dans vMix : **Settings → Web Controller**
2. Activez Web Controller. Port par défaut : `8088`.
3. Dans EsperantAI : Logiciel de streaming : **vMix**
4. Hôte : `127.0.0.1`
5. Port : `8088`
6. Cliquez sur **Connecter**

> Remarque : l'adaptateur actuel d'EsperantAI utilise l'API HTTP locale de vMix. Si vous avez protégé Web Controller avec des règles réseau ou des identifiants non compatibles avec le navigateur, la connexion peut échouer.

### PRISM Live Studio

1. Utilisez **PRISM Live Studio v4.0.5+**.
2. Installez manuellement le plugin `obs-websocket` compatible avec OBS/PRISM.
3. Copiez-le dans le dossier de plugins de PRISM en suivant le guide officiel de PRISM pour les plugins OBS.
4. Redémarrez PRISM.
5. Activez WebSocket dans **Outils → Paramètres du serveur WebSocket**
6. Dans EsperantAI : Logiciel de streaming : **PRISM Live Studio** (fonctionne comme OBS)

> Différence importante : OBS 28+ inclut déjà obs-websocket. PRISM exige l'installation manuelle du plugin.

### XSplit Broadcaster (bêta)

1. Installez ou activez un pont local compatible avec **XSplit XJS / Remote xjs**.
2. Vérifiez que le pont expose une URL WebSocket locale.
3. Dans EsperantAI : Logiciel de streaming : **XSplit**
4. URL du proxy Remote xjs : `ws://127.0.0.1:5555/xjs` (par défaut)
5. Cliquez sur **Connecter**

> XSplit est en **bêta**. La compatibilité dépend du pont XJS local installé ; les fonctions avancées peuvent être limitées.

---

## Configurer les gestes et les scènes

Une fois connecté, les scènes réelles de votre logiciel apparaîtront automatiquement dans les listes déroulantes du panneau **Déclencheurs**.

### Mappage de base

1. Pour chaque geste (par exemple, « Regarder à gauche »), choisissez une scène dans la liste déroulante
2. Lorsque vous effectuez ce geste et le maintenez stable pendant ~150 ms, EsperantAI basculera vers cette scène dans votre logiciel de streaming
3. Le changement est automatique et quasi instantané

### Multi-action (Pro+)

Avec une licence Pro ou Pro+, un seul geste peut déclencher **plusieurs actions** simultanément :
- Changer de scène + jouer un son + afficher un overlay + envoyer un message dans le chat

### Activer / désactiver les catégories

Chaque catégorie possède sa propre case à cocher « Activer » :

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
| Surpris | émotion=surprise | Manifester clairement la surprise |
| En colère | émotion=colère | Avoir l'air en colère |
| Neutre | émotion=neutre | Visage détendu |
| Double clignement | clignement | Fermer les deux yeux deux fois rapidement (< 700 ms) |

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

Pour qu'EsperantAI reçoive des événements (dons, abonnements, raids, follows ou Super Chats), connectez les plateformes sur lesquelles vous diffusez.

![État des événements par plateforme](assets/manual/03-platform-events.svg)

### Twitch

1. Créez un Client ID sur https://dev.twitch.tv/console
2. Enregistrez l'URI de redirection : `https://edugame.digital/oauth-callback.html` (ou votre URL locale)
3. Dans EsperantAI : panneau **Événements de plateforme** → **Twitch EventSub**
4. Collez votre Client ID
5. Cliquez sur **Connecter**
6. Une fenêtre d'autorisation Twitch s'ouvrira. Acceptez les permissions.
7. La fenêtre se fermera et vous verrez « Twitch connecté »

EsperantAI utilise EventSub WebSocket. Ne collez aucun Client Secret dans le navigateur.

### YouTube Live

1. Créez des identifiants sur https://console.cloud.google.com
2. Activez YouTube Data API v3
3. Créez un OAuth Client ID (type : Web Application)
4. Enregistrez la même URI de redirection que pour Twitch
5. Dans EsperantAI : panneau **Événements de plateforme** → **YouTube Live**
6. Collez votre Client ID et cliquez sur **Connecter**

Conditions YouTube : vous devez avoir un direct actif avec un chat disponible, et votre projet Google Cloud doit disposer d'un quota suffisant pour interroger le chat.

### Kick

1. Créez une application dans le portail développeur de Kick.
2. Enregistrez l'URI de redirection
3. Dans EsperantAI : panneau **Événements de plateforme** → **Kick**
4. Collez votre Client ID et cliquez sur **Connecter**
5. Kick utilise OAuth 2.1 avec PKCE.

État actuel : **bêta/limité**. La documentation officielle de Kick utilise des webhooks pour les événements complets. Dans le navigateur, EsperantAI ne peut détecter qu'une partie limitée de l'activité ; pour les abonnements, cadeaux, raids ou événements Kick fiables, utilisez un pont comme StreamElements ou un backend/webhook.

### StreamElements (pont multiplateforme)

Si vous avez déjà un compte StreamElements, vous pouvez l'utiliser comme pont pour les alertes de plusieurs plateformes :

1. Allez sur https://streamelements.com/dashboard/account/channels
2. Copiez votre JWT Token
3. Dans EsperantAI : panneau **Événements de plateforme** → **StreamElements**
4. Collez le JWT et cliquez sur **Connecter**

Gardez ce token privé. Traitez-le comme un mot de passe de votre compte StreamElements.

### Trovo

EsperantAI inclut dans le code un adaptateur technique pour Trovo, basé sur OAuth et le service de chat WebSocket de Trovo. Dans l'interface publique actuelle, il n'existe pas encore de panneau de connexion Trovo ; Trovo n'est donc pas documenté comme un parcours utilisateur normal. Si vous avez besoin de Trovo maintenant, utilisez un pont compatible ou attendez l'activation du panneau Trovo.

---

## Combinaisons Événement + Geste (Avancé)

Voici la magie d'EsperantAI : combiner des **événements de plateforme** avec **vos gestes** comme confirmation.

![Flux événement plus geste](assets/manual/04-event-gesture-combo.svg)

### Exemple : remercier les donateurs avec un pouce levé

1. Panneau **Déclencheurs d'événements** → ligne « 💰 Don »
2. ✅ Activez
3. Scène : `Scene_Merci`
4. Geste requis : `👍 Pouce levé`

**Déroulement en direct** :
- Un don arrive → EsperantAI affiche « En attente du geste... »
- Vous avez 5 secondes pour faire 👍
- Si vous le faites → bascule vers `Scene_Merci` + exécute les autres actions configurées
- Si vous ne le faites pas → l'événement est automatiquement ignoré

### Sans geste requis (déclenchement automatique)

Si vous laissez « Geste requis » sur `— aucun —`, l'événement déclenche l'action immédiatement.

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

`Images stables` = nombre d'images consécutives pendant lesquelles le geste doit être maintenu avant le déclenchement. Par défaut : 5 images (~150 ms à 30 fps).

Augmentez si les déclencheurs s'activent trop facilement. Diminuez pour une réponse plus rapide.

### Temps de recharge

`Temps de recharge (ms)` = temps minimum entre les changements de scène. Par défaut : 500 ms.

Empêche le commutateur d'être « instable » si vous oscillez rapidement.

---

## Raccourcis clavier

| Touche | Action |
|---|---|
| `Espace` | Mettre en pause / Reprendre la détection |
| `C` | Basculer manuellement vers la scène CENTRE |
| `R` | Recharger la liste des scènes depuis le logiciel |
| `Échap` | Se déconnecter |

---

## Historique des déclencheurs

Le panneau **Avancé → Historique des déclencheurs** affiche les 50 dernières actions déclenchées :

- ✓ vert = réussi
- ✗ rouge = échoué
- · gris = en attente

Utile pour vérifier ce qui a été déclenché sans ouvrir les DevTools.

**Exporter CSV** : téléchargez l'historique pour une analyse hors ligne.

**Effacer** : efface l'historique (n'affecte rien d'autre).

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
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

Les 15 langues sont traduites dans les fichiers d'interface actuels.

---

## Gérer votre licence

Panneau **Avancé → Licence** :

- **Voir le statut** : Valide / Invalide
- **Voir l'e-mail du client associé**
- **Voir la dernière validation en ligne**
- **Désactiver sur cet appareil** : à utiliser avant de changer de PC ou pour libérer un emplacement (sur les 3 disponibles)

---

## Dépannage

### « Activation requise » persiste après avoir collé ma clé de licence

- Vérifiez que vous avez copié la clé complète (5 groupes de 4 caractères séparés par des tirets)
- Vérifiez votre connexion Internet (l'activation nécessite une validation en ligne la première fois)
- Si vous avez déjà activé sur 3 appareils, désactivez-en un d'abord
- Contactez soporte@edugame.digital si le problème persiste

### « Recherche du visage... » persiste bien que mon visage soit visible

- Améliorez l'éclairage : votre visage doit être bien éclairé
- Rapprochez-vous de la caméra (40 à 80 cm est optimal)
- Fermez les autres onglets utilisant le GPU (Chrome peut limiter le GPU si trop d'onglets sont ouverts)
- Si le Memory Saver de Chrome est actif, désactivez-le pour cet onglet

### Les scènes n'apparaissent pas dans les listes déroulantes

- Vérifiez que vous êtes connecté au logiciel de streaming (badge vert « Connecté »)
- Appuyez sur `R` pour recharger la liste des scènes
- Si toujours vide, déconnectez puis reconnectez-vous
- Dans vMix, confirmez que Web Controller est activé et accessible depuis `http://127.0.0.1:8088/api/`
- Dans PRISM, confirmez que le plugin obs-websocket est installé et activé
- Dans XSplit, confirmez que le pont XJS local est en cours d'exécution

### Les changements de scène se déclenchent sans que je fasse de gestes

- Augmentez le seuil de yaw / pitch / roll dans le panneau **Sensibilité**
- Augmentez les `Images stables` de 5 à 8-10
- Assurez-vous que la zone morte est configurée (yaw 0,05, pitch 0,05, roll 0,08)
- Vérifiez que personne d'autre n'est dans le cadre (plusieurs visages peuvent causer de l'instabilité)

### Latence de détection

- Fermez les applications gourmandes (jeux, montage vidéo)
- Vérifiez que vous utilisez le GPU dédié si vous en avez un (et non le GPU intégré)
- Réduisez la résolution de la caméra si elle est en 4K (1080p est optimal pour la détection)

### OBS ne réagit pas alors qu'EsperantAI indique « Scène changée »

- Vérifiez que le nom de la scène dans la liste déroulante correspond EXACTEMENT à celui dans OBS (sensible à la casse)
- Vérifiez que la scène ne se trouve pas dans une autre Collection de scènes
- Consultez le panneau **Historique des déclencheurs** — s'il affiche ✗ rouge, il y a une erreur spécifique

### Erreur « OBS inaccessible — Connecter manuellement »

- Vérifiez qu'OBS est ouvert
- Vérifiez que le WebSocket est activé dans OBS
- Si vous avez défini un mot de passe dans OBS, il doit correspondre exactement
- Certains antivirus bloquent le port 4455 — ajoutez une exception

### Twitch ou YouTube ne se connectent pas

- Vérifiez que l'URI de redirection dans la console de la plateforme correspond exactement à l'URL de `oauth-callback.html`
- Autorisez les fenêtres contextuelles pour le domaine où vous utilisez EsperantAI
- Sur Twitch, utilisez uniquement le Client ID ; ne collez pas de Client Secret
- Sur YouTube, confirmez que YouTube Data API v3 est activée et qu'un direct est actif

### Kick n'affiche pas tous les événements

Kick est en mode bêta/limité dans le navigateur. Les événements Kick complets sont officiellement reçus par webhooks ; utilisez StreamElements ou votre propre backend si vous avez besoin d'abonnements, de cadeaux ou de raids fiables.

---

## Confidentialité

### Ce qu'EsperantAI NE fait PAS

- ❌ N'envoie PAS votre vidéo vers un serveur
- ❌ Ne stocke PAS votre vidéo ou des captures
- ❌ Ne collecte PAS d'informations biométriques à distance
- ❌ Ne partage PAS de données avec des annonceurs ou des tiers

### Ce qu'IL traite

- ✅ Détection faciale locale dans votre navigateur (Human.js + WebGL)
- ✅ Connexions locales à OBS / Streamlabs / vMix / PRISM / XSplit (loopback `127.0.0.1`)
- ✅ Validation périodique de la clé de licence (tous les 7 jours)
- ✅ Si vous connectez Twitch/YouTube/Kick/StreamElements : tokens de plateforme dans le stockage local ou de session du navigateur

Détails complets dans `docs/PRIVACY.html`.

---

## Support

- 📧 E-mail : **soporte@edugame.digital**
- 🌐 Web : https://edugame.digital
- 📚 Documentation technique : https://github.com/salazarjoelo/EsperantAI

Délais de réponse :
- Questions générales : 24 à 72 heures
- Bugs techniques : 1 à 3 jours ouvrés

---

*Dernière mise à jour : 2026-05-20. Version : 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
