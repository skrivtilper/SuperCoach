# 🧠 Pers supercoach — opsætningsguide

> 🤖 **LLM eller agent? Start her:** Læs [`AGENT_SETUP.md`](AGENT_SETUP.md) først. Den beskriver præcist, hvad du selv skal gøre, hvad du må bede brugeren om, og hvornår opsætningen er færdig.

Pers supercoach er en personlig træningsassistent til løb og cykling med:

- **Intervals.icu** som sandhed for træningsdata, events, wellness og training plan.
- **GitHub** som varig hukommelse for langsigtet plan og coach-noter.
- En canonical runtime-instruks i [`Instruks.md`](Instruks.md).

Den anbefalede opsætning bruger én arkitektur: **Intervals.icu + et privat GitHub-repository til plan og noter**.

---

## 1. Arkitektur

### Intervals.icu

Bruges til:

- atletprofil
- gennemførte aktiviteter
- planlagte WORKOUT- og NOTE-events
- wellness
- training plan

### Privat GitHub-repository

Standardopsætningen i `Instruks.md` bruger:

- owner: brugerens GitHub-bruger eller organisation (`persistent_owner`)
- repo: `SuperCoachPersistent` som standard (`persistent_repo`)
- plan: `maal_og_langsigtet_plan.md`
- noter: `noter.md`

Owner er **ikke** hardcoded. Den skal udledes fra brugerens GitHub-forbindelse eller vælges under opsætningen.

Planfilen indeholder mål, faser, strategi og ugeplan-skabeloner. `noter.md` indeholder korte, varige regler, præferencer, skadeshistorik og større beslutninger.

---

## 2. Hurtigste opsætning med en LLM/Agent

Giv agenten linket til dette repository og bed fx:

```text
Hjælp mig med at sætte Pers supercoach op efter repositoryets agent-guide.
```

Agenten skal derefter følge [`AGENT_SETUP.md`](AGENT_SETUP.md): selv verificere det, den har adgang til, og kun bede dig om de få handlinger eller oplysninger, den ikke kan udføre eller udlede.

Du skal **ikke** indsætte API-nøgler eller GitHub-tokens i chatten.

---

## 3. Opret din Custom GPT / agent manuelt

1. Opret eller redigér din Custom GPT/agent.
2. Kopiér hele indholdet af [`Instruks.md`](Instruks.md) ind under dens runtime-instruktioner.
3. Konfigurér `persistent_owner` til din GitHub-bruger eller organisation.
4. Behold `persistent_repo = "SuperCoachPersistent"` eller vælg et andet privat repo-navn.
5. Tilføj Intervals.icu-actions.
6. Tilføj GitHub Contents-actions.
7. Gem og test.

`Instruks.md` er den eneste canonical runtime-instruks i dette repository.

---

## 4. Intervals.icu-actions

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

### Intervals API-key

1. Log ind på Intervals.icu.
2. Gå til Settings → Developer settings.
3. Opret en API key.
4. Konfigurér actionens authentication efter OpenAPI-definitionen.

Del aldrig API-nøglen offentligt eller direkte i chatten.

---

## 5. GitHub-actions

Importér GitHub Contents OpenAPI-filen:

```text
https://github.com/skrivtilper/SuperCoach/raw/main/github-contents-openapi.yaml
```

De centrale handlinger er:

- `getFileContents`
- `putFileContents`
- `getRepo`
- `listCommitsForPath`

### GitHub Personal Access Token

Opret et fine-grained PAT med adgang til det **private persistent-repository**, du vil bruge til plan og noter.

Nødvendig repository permission:

- **Contents: Read and write**

Tilføj tokenet som Bearer-token i GitHub-actionens sikre authentication. Del aldrig tokenet i chat eller offentligt.

Hvis agenten også skal kunne vedligeholde selve dette kilde-repository, kræver det separat skriveadgang til det repository; det er ikke nødvendigt for almindelig trænerbrug.

---

## 6. Persistent data

I dit valgte private persistent-repository skal disse filer findes:

### `maal_og_langsigtet_plan.md`

Indeholder:

- mål
- faser
- strategi
- ugeplan-skabeloner

Løbende ugeevalueringer hører ikke hjemme her.

### `noter.md`

Én JSON-struktur:

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

Intervals NOTE-events bruges til datonære beslutninger og ugefeedback.

Agenten kan initialisere begge filer, hvis dens GitHub-værktøjer har skriveadgang.

---

## 7. Test opsætningen

Start en ny chat og bed fx:

```text
Hent min profil og giv mig et kort overblik over den seneste uges træning.
```

Kontrollér at coachen:

1. fastslår dit persistent GitHub-repo
2. læser plan og noter fra GitHub
3. kan hente Intervals-profilen
4. kan hente aktiviteter/events
5. kan læse wellness
6. kan læse training plan
7. håndterer store aktivitet/event-svar ved at dele datointervallet op
8. ikke opretter dubletter ved gentagne planændringer

Test derefter en ufarlig fremtidig workout-oprettelse og kontrollér, at `external_id` bruges.

---

## 8. Fejlfinding

### GitHub giver 403 ved skrivning

Kontrollér:

- at PAT'et har adgang til det konkrete private persistent-repository
- at **Contents: Read and write** er slået til
- at actionen bruger det rigtige token

### Store svar fra Intervals

`listActivities` og `listEvents` kan blive for store over lange perioder. Instruksen fortæller coachen at dele perioden i mindre bidder, typisk 14–30 dage.

### Plan og noter er uenige

Planfilen har prioritet for mål og strategi. `noter.md` skal opryddes/opdateres, så den matcher den aktuelle plan.

---

## 9. Filer i dette repository

- [`AGENT_SETUP.md`](AGENT_SETUP.md) — installationsprotokol for LLM/agent.
- [`Instruks.md`](Instruks.md) — canonical runtime-instruks.
- [`openAPI intervals_icu.yaml`](openAPI%20intervals_icu.yaml) — Intervals.icu actions.
- [`github-contents-openapi.yaml`](github-contents-openapi.yaml) — GitHub Contents actions.
- [`maal_og_langsigtet_plan.md`](maal_og_langsigtet_plan.md) — skabelon/reference til langsigtet plan.
- [`Instruks med plan i GitHub.md`](Instruks%20med%20plan%20i%20GitHub.md) — arkiveret tidligere instruks; brug `Instruks.md` i stedet.

---

## About

Pers supercoach er bygget til korte, handlingsnære træningsbeslutninger med Intervals.icu som datakilde og GitHub som vedvarende strategisk hukommelse.
