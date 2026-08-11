# 🧠 Pers supercoach — opsætningsguide

> 🤖 **LLM eller agent? Start her:** Læs [`AGENT_SETUP.md`](AGENT_SETUP.md) først. Den beskriver præcist, hvad agenten selv skal gøre, hvad brugeren skal guides igennem, og hvordan setup håndteres, hvis brugeren endnu ikke har Intervals.icu eller GitHub.

Pers supercoach er en personlig træningsassistent til løb og cykling med:

- **Intervals.icu** som sandhed for træningsdata, events, wellness og training plan.
- **GitHub** som anbefalet langtidslager for plan og coach-noter.
- **Filbaseret fallback**, hvis brugeren specifikt ikke ønsker GitHub.
- En canonical runtime-instruks i [`Instruks.md`](Instruks.md).

---

## 1. To storage-modes

### Anbefalet: GitHub-mode

```text
storage_mode = github
persistent_owner = <brugerens GitHub-bruger eller organisation>
persistent_repo = SuperCoachPersistent
```

Det private persistent-repository indeholder:

- `maal_og_langsigtet_plan.md`
- `noter.md`

GitHub anbefales, fordi det giver versionshistorik, rollback, portabilitet og mere robust persistence på tværs af chats/agenter.

### Fallback: fil-mode

Hvis brugeren **specifikt ikke ønsker GitHub**:

```text
storage_mode = file
memory_file = supercoach_memory.md
```

Agenten vedligeholder én fil direkte i agentens/workspacets filområde. Filen indeholder både langsigtet plan og varige noter.

Ulemper:

- persistence afhænger af den konkrete platform og er ikke nødvendigvis garanteret mellem nye chats/agenter
- ingen normal Git-versionhistorik/rollback
- filen kan skulle vedhæftes eller vælges igen
- synkronisering mellem enheder/agenter er mere manuel
- brugeren bør beholde en backup

---

## 2. Hurtigste opsætning med en LLM/Agent

Giv agenten linket til dette repository og bed fx:

```text
Hjælp mig med at sætte Pers supercoach op efter repositoryets agent-guide.
```

Agenten skal derefter følge [`AGENT_SETUP.md`](AGENT_SETUP.md).

Den skal **ikke** forudsætte, at du allerede har GitHub eller Intervals.icu:

- Mangler du **Intervals.icu**, skal agenten guide dig trin for trin til at oprette og forbinde en konto.
- Mangler du **GitHub**, skal agenten tilbyde at hjælpe dig i gang med konto, privat persistent-repo og sikker forbindelse.
- Ønsker du **ikke GitHub**, skal agenten skifte til fil-mode og forklare begrænsningerne.

Du skal ikke indsætte API-nøgler, GitHub-tokens eller andre secrets direkte i chatten.

---

## 3. Arkitektur

### Intervals.icu

Bruges til:

- atletprofil
- gennemførte aktiviteter
- planlagte WORKOUT- og NOTE-events
- wellness
- training plan

### Persistent storage

I GitHub-mode:

- `maal_og_langsigtet_plan.md` → mål, faser, strategi og ugeplan-skabeloner
- `noter.md` → varige regler, præferencer, skadeshistorik og større beslutninger

I fil-mode:

- `supercoach_memory.md` → kombinerer begge funktioner

---

## 4. Manuel opsætning af en Custom GPT / agent

1. Opret eller redigér din Custom GPT/agent.
2. Kopiér hele [`Instruks.md`](Instruks.md) ind som runtime-instruks.
3. Vælg storage-mode.
4. Tilføj Intervals.icu-actions.
5. Tilføj GitHub Contents-actions, hvis GitHub-mode bruges.
6. Konfigurér sikker authentication.
7. Test setup.

### GitHub-mode

Konfigurér:

```text
storage_mode = github
persistent_owner = <din GitHub-bruger eller organisation>
persistent_repo = SuperCoachPersistent
```

Owner er **ikke hardcoded** og behøver ikke være samme owner som dette offentlige kilde-repository.

### Fil-mode

Konfigurér:

```text
storage_mode = file
memory_file = supercoach_memory.md
```

Tilføj ikke GitHub-actions, hvis GitHub bevidst er fravalgt.

---

## 5. Intervals.icu-actions

Importér OpenAPI-filen:

```text
https://github.com/skrivtilper/SuperCoach/raw/main/openAPI%20intervals_icu.yaml
```

Den indeholder bl.a.:

- `getAthleteProfile`
- `listActivities`
- `listEvents`
- `createEvent`
- `updateEvent`
- `deleteEvent`
- `getWellnessByDate`
- wellness-upserts
- `getAthleteTrainingPlan`
- `setAthleteTrainingPlan`

### Hvis brugeren ikke har Intervals.icu

Agenten skal hjælpe med onboarding frem for blot at stoppe:

1. opret konto
2. færdiggør basisprofil
3. forbind relevante aktivitetskilder, hvis ønsket
4. etabler sikker API/connector-adgang
5. verificér med `getAthleteProfile`

Login, email-verifikation, MFA, captcha, samtykke og secrets håndteres af brugeren selv.

---

## 6. GitHub-actions

Importér GitHub Contents OpenAPI-filen:

```text
https://github.com/skrivtilper/SuperCoach/raw/main/github-contents-openapi.yaml
```

Centrale handlinger:

- `getFileContents`
- `putFileContents`
- `getRepo`
- `listCommitsForPath`

### GitHub-adgang

Til brugerens **private persistent-repository** kræves repository permission:

- **Contents: Read and write**

Bed aldrig brugeren dele selve token-værdien i chatten.

Hvis agenten også skal vedligeholde selve dette kilde-repository, kræver det separat relevant adgang til kilde-repositoryet.

### Hvis brugeren ikke har GitHub

Agenten skal tilbyde at hjælpe brugeren gennem:

1. konto-oprettelse
2. sikker forbindelse til agenten
3. oprettelse/valg af privat persistent-repo
4. read/write-adgang
5. initialisering af plan og noter

Hvis brugeren siger, at GitHub ikke ønskes, bruges fil-mode i stedet.

---

## 7. Persistent data

### GitHub-mode

`maal_og_langsigtet_plan.md` indeholder:

- mål
- faser
- strategi
- ugeplan-skabeloner

`noter.md` er ét JSON-objekt:

```json
{
  "schema_version": 1,
  "profile": {},
  "constraints": {
    "time": [],
    "injuries": [],
    "health": []
  },
  "preferences": {
    "running": [],
    "cycling": [],
    "general": []
  },
  "rules": [],
  "major_decisions": []
}
```

### Fil-mode

`supercoach_memory.md` bør mindst indeholde:

```markdown
# SuperCoach memory

## Mål og langsigtet plan
- mål
- faser
- strategi
- ugeplan-skabeloner

## Varige noter
- profil
- constraints
- skader/helbred
- præferencer
- regler
- større beslutninger
```

Intervals NOTE-events bruges fortsat til datonære beslutninger og ugefeedback.

---

## 8. Test opsætningen

Start en ny chat og bed fx:

```text
Hent min profil og giv mig et kort overblik over den seneste uges træning.
```

Kontrollér at coachen:

1. kan læse Intervals-profilen
2. fastslår korrekt storage-mode
3. kan læse persistent plan/noter eller memory-fil
4. kan hente aktiviteter/events
5. kan læse wellness
6. kan læse training plan
7. håndterer store svar ved at dele datointervaller op
8. bruger `external_id` uden at skabe dubletter

---

## 9. Fejlfinding

### GitHub giver 403 ved skrivning

Kontrollér:

- at integrationen/tokenet har adgang til det valgte private persistent-repository
- at **Contents: Read and write** er slået til
- at actionen bruger den rigtige authentication

### Store svar fra Intervals

`listActivities` og `listEvents` kan blive for store over lange perioder. Runtime-instruksen kræver, at agenten automatisk deler perioden i mindre bidder, typisk 14–30 dage.

### Fil-mode mister memory mellem chats

Det er en kendt begrænsning ved filbaseret fallback. Genvedhæft/vælg den seneste `supercoach_memory.md`, eller skift til GitHub-mode for mere robust persistence.

---

## 10. Filer i dette repository

- [`AGENT_SETUP.md`](AGENT_SETUP.md) — installationsprotokol for LLM/agent.
- [`Instruks.md`](Instruks.md) — canonical runtime-instruks.
- [`openAPI intervals_icu.yaml`](openAPI%20intervals_icu.yaml) — Intervals.icu actions.
- [`github-contents-openapi.yaml`](github-contents-openapi.yaml) — GitHub Contents actions.
- [`maal_og_langsigtet_plan.md`](maal_og_langsigtet_plan.md) — reference/skabelon til langtidsplan.
- [`Instruks med plan i GitHub.md`](Instruks%20med%20plan%20i%20GitHub.md) — arkiveret tidligere instruks.

---

## About

Pers supercoach er bygget til korte, handlingsnære træningsbeslutninger med Intervals.icu som datakilde og enten GitHub eller en fil som vedvarende strategisk hukommelse.
