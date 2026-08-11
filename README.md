# 🧠 Pers supercoach

> 🤖 **LLM/agent? Start her:** Læs [`agent-manifest.yaml`](agent-manifest.yaml) → [`AGENT_SETUP.md`](AGENT_SETUP.md) → [`Instruks.md`](Instruks.md).

## Den ønskede brugeroplevelse

Brugeren skal kunne give en agent dette repo og skrive:

```text
Her er repoet, sæt det op for mig.
```

Agenten skal derefter **starte setup med det samme**, capability-detecte først, udføre alle sikre trin selv og kun spørge brugeren, når der er en reel blocker.

Ingen generelle setup-interviews. Ingen API-nøgler eller tokens i chatten.

Hvis brugeren mangler Intervals.icu eller GitHub, guider agenten trin for trin gennem oprettelse og sikker forbindelse. Hvis brugeren **specifikt ikke ønsker GitHub**, bruges den dokumenterede filbaserede fallback.

---

## Arkitektur

**Intervals.icu** er sandhed for:
- profil
- aktiviteter
- WORKOUT/NOTE-events
- wellness
- training plan

**GitHub-mode (anbefalet)** bruger et privat persistent-repo til:
- `maal_og_langsigtet_plan.md`
- `noter.md`

**Fil-mode (fallback)** bruger:
- `supercoach_memory.md`

Fil-mode er mindre robust: persistence afhænger af agent/platform, Git-historik/rollback mangler normalt, filen kan skulle genvedhæftes, og backup/synkronisering er mere manuel.

---

## Agent entrypoints

| Fil | Formål |
|---|---|
| [`agent-manifest.yaml`](agent-manifest.yaml) | Maskinlæsbar kontrakt: entrypoints, defaults, capabilities, storage og success criteria |
| [`AGENT_SETUP.md`](AGENT_SETUP.md) | Bootstrap/onboarding, capability detection, blocker-regler og smoke test |
| [`Instruks.md`](Instruks.md) | Canonical runtime-instruks for coachen |

Agenten skal prioritere disse tre filer i den rækkefølge.

---

## Integrationer

### Intervals.icu

OpenAPI-spec:
- [`openAPI intervals_icu.yaml`](openAPI%20intervals_icu.yaml)

Centrale handlinger omfatter profil, aktiviteter, events, wellness og training plan.

Hvis brugeren ikke har en Intervals.icu-konto, skal agenten guide brugeren gennem oprettelse og derefter selv verificere forbindelsen med `getAthleteProfile`.

### GitHub Contents

OpenAPI-spec:
- [`github-contents-openapi.yaml`](github-contents-openapi.yaml)

Til brugerens **private persistent-repo** kræves normalt:
- **Contents: Read and write**

Owner er ikke hardcoded. Agenten skal udlede eller spørge efter brugerens GitHub-bruger/organisation.

Hvis brugeren ikke har GitHub, skal agenten tilbyde onboarding. Manglende GitHub-konto er ikke automatisk et valg af fil-mode.

---

## Templates og arkiv

Templates ligger under [`templates/`](templates/):
- [`templates/maal_og_langsigtet_plan.md`](templates/maal_og_langsigtet_plan.md)
- [`templates/supercoach_memory.md`](templates/supercoach_memory.md)

Historiske filer ligger under [`archive/`](archive/).

Root-filer med gamle navne kan eksistere som kompatibilitetsredirects og må ikke behandles som live brugerdata.

---

## Smoke test

Et setup afsluttes med en smoke test, der verificerer:

1. Intervals-read.
2. Persistent storage read/write.
3. Idempotens for event-planlægning, hvis testen kan ryddes sikkert op.
4. At ingen secrets er delt i chatten.
5. At ingen semantiske testdata efterlades.

Detaljerne står i [`AGENT_SETUP.md`](AGENT_SETUP.md).

---

## Definition of “klar”

Agenten må give en “klar til brug”-status, når:
- Intervals-profilen kan læses
- storage-mode er kendt
- persistent storage kan læses og skrives
- plan/noter eller memory-fil findes
- centrale Intervals-reads virker
- smoke testen er bestået, eller en konkret cleanup-begrænsning er rapporteret
- ingen secrets er delt i chatten

---

## Manuel opsætning

Hvis du bygger en Custom GPT/agent manuelt:

1. Brug hele [`Instruks.md`](Instruks.md) som runtime-instruks.
2. Tilføj Intervals.icu-integrationen fra repoets OpenAPI-spec.
3. Ved GitHub-mode: tilføj GitHub Contents-integrationen og konfigurer brugerens private persistent-repo.
4. Ved fil-mode: brug `templates/supercoach_memory.md` som startskabelon.
5. Kør setup-flow og smoke test fra [`AGENT_SETUP.md`](AGENT_SETUP.md).

Brug den rå (“Raw”) URL til OpenAPI-filerne fra det repo/fork, du faktisk installerer fra; undgå hardcodede owners i genbrugelige setups.
