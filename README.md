# 🧠 Pers supercoach — opsætningsguide

Pers supercoach er en personlig træningsassistent til løb og cykling med:

- **Intervals.icu** som sandhed for træningsdata, events, wellness og training plan.
- **GitHub** som varig hukommelse for langsigtet plan og coach-noter.
- En canonical instruktion i [`Instruks.md`](Instruks.md).

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

Standardopsætningen i `Instruks.md` forventer:

- owner: `skrivtilper`
- repo: `SuperCoachPersistent`
- plan: `maal_og_langsigtet_plan.md`
- noter: `noter.md`

Planfilen indeholder mål, faser, strategi og ugeplan-skabeloner. `noter.md` indeholder korte, varige regler, præferencer, skadeshistorik og større beslutninger.

---

## 2. Opret din GPT

1. Opret eller redigér din Custom GPT i ChatGPT.
2. Kopiér hele indholdet af [`Instruks.md`](Instruks.md) ind under **Instructions**.
3. Tilføj Intervals.icu-actions.
4. Tilføj GitHub Contents-actions.
5. Gem og test.

`Instruks.md` er den eneste canonical instruks i dette repository.

---

## 3. Intervals.icu-actions

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

Del aldrig API-nøglen offentligt.

---

## 4. GitHub-actions

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

Opret et fine-grained PAT med adgang til det private repository, som indeholder plan og noter.

Nødvendig repository permission:

- **Contents: Read and write**

Hvis GPT'en også skal kunne vedligeholde dette `SuperCoach`-repo direkte, skal tokenet have samme adgang til `skrivtilper/SuperCoach`.

Tilføj tokenet som Bearer-token i GitHub-actionens authentication. Del aldrig tokenet i chat eller offentligt.

---

## 5. Persistent data

I `SuperCoachPersistent` skal disse filer findes:

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

---

## 6. Test opsætningen

Start en ny chat og bed fx:

```text
Hent min profil og giv mig et kort overblik over den seneste uges træning.
```

Kontrollér at coachen:

1. læser plan og noter fra GitHub
2. kan hente Intervals-profilen
3. kan hente aktiviteter/events
4. kan læse wellness
5. kan læse training plan
6. håndterer store aktivitet/event-svar ved at dele datointervallet op
7. ikke opretter dubletter ved gentagne planændringer

Test derefter en ufarlig fremtidig workout-oprettelse og kontrollér, at `external_id` bruges.

---

## 7. Fejlfinding

### GitHub giver 403 ved skrivning

Kontrollér:

- at PAT'et har adgang til det konkrete repository
- at **Contents: Read and write** er slået til
- at actionen bruger det rigtige token

### Store svar fra Intervals

`listActivities` og `listEvents` kan blive for store over lange perioder. Instruksen fortæller coachen at dele perioden i mindre bidder, typisk 14–30 dage.

### Plan og noter er uenige

Planfilen har prioritet for mål og strategi. `noter.md` skal opryddes/opdateres, så den matcher den aktuelle plan.

---

## 8. Filer i dette repository

- [`Instruks.md`](Instruks.md) — canonical GPT-instruks.
- [`openAPI intervals_icu.yaml`](openAPI%20intervals_icu.yaml) — Intervals.icu actions.
- [`github-contents-openapi.yaml`](github-contents-openapi.yaml) — GitHub Contents actions.
- [`maal_og_langsigtet_plan.md`](maal_og_langsigtet_plan.md) — skabelon/reference til langsigtet plan.
- [`Instruks med plan i GitHub.md`](Instruks%20med%20plan%20i%20GitHub.md) — arkiveret tidligere instruks; brug `Instruks.md` i stedet.

---

## About

Pers supercoach er bygget til korte, handlingsnære træningsbeslutninger med Intervals.icu som datakilde og GitHub som vedvarende strategisk hukommelse.
