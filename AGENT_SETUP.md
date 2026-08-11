# LLM / Agent setup-protokol

Dette dokument er skrevet **til en LLM eller agent**, der hjælper en bruger med at sætte Pers supercoach op fra dette repository.

Målet er at gennemføre så meget som muligt selv og kun bede brugeren om handlinger, som agenten ikke kan udføre eller udlede sikkert.

## Før du går i gang

1. Læs [`Instruks.md`](Instruks.md) i sin helhed.
2. Antag **aldrig**, at ejeren af dette kilde-repository også er ejer af brugerens private persistent-repository.
3. Bed aldrig brugeren om at indsætte API-nøgler, PATs eller andre secrets direkte i chatten.
4. Genbrug eksisterende konfiguration og data, hvis de allerede findes. Opret ikke parallelle repositories eller dubletter.

## Det skal du forsøge at gøre selv

Gør følgende uden at spørge om lov, når dine værktøjer og tilladelser gør det muligt:

1. Kontrollér at Intervals.icu-forbindelsen virker ved at hente atletprofilen.
2. Find den autentificerede GitHub-bruger/organisation eller et allerede eksisterende persistent-repository, hvis det kan udledes entydigt.
3. Find eller verificér et privat persistent-repository. Standardnavnet er `SuperCoachPersistent`, men et andet navn er tilladt.
4. Kontrollér at GitHub-forbindelsen har **Contents: Read and write** til det valgte persistent-repository.
5. Læs eller initialisér:
   - `maal_og_langsigtet_plan.md`
   - `noter.md`
6. Kontrollér Intervals-data:
   - profil
   - training plan
   - wellness for de seneste 14 dage
   - aktiviteter for de seneste 90 dage
   - events fra 60 dage tilbage til 28 dage frem
7. Del store `listActivities`/`listEvents`-perioder i mindre bidder, hvis svaret bliver for stort.
8. Bevar eksisterende data og struktur; initialisér kun manglende filer.
9. Afslut opsætningen med en kort status: hvad virker, hvad blev oprettet, og hvad mangler eventuelt.

## Det må du bede brugeren om

Spørg kun om oplysninger eller handlinger, du ikke selv kan udlede eller udføre.

### GitHub-owner

Hvis `persistent_owner` ikke kan udledes entydigt, spørg:

> Hvilken GitHub-bruger eller organisation skal eje dit private SuperCoachPersistent-repo?

Brug svaret som `persistent_owner`. Hardcod aldrig en bestemt persons GitHub-navn i den generelle opsætning.

### Persistent repo

Hvis der ikke findes et relevant repo:

- Hvis du kan oprette repositories: opret et **privat** repo, som standard `SuperCoachPersistent`.
- Hvis du ikke kan oprette repositories: bed brugeren oprette et privat repo og oplyse owner + repo-navn.

### GitHub-adgang

Hvis GitHub kan læse men ikke skrive, bed brugeren opdatere integrationen/tokenet, så det valgte persistent-repository har:

- **Contents: Read and write**

Bed ikke om selve token-værdien.

### Intervals.icu-adgang

Hvis Intervals.icu ikke er autentificeret, bed brugeren forbinde eller konfigurere Intervals.icu-actionen via den sikre autentificeringsmekanisme.

Bed ikke om API-nøglen i chatten.

### Træningsmål

Spørg kun om mål, tidsbegrænsninger, skader eller præferencer, hvis de ikke allerede findes i Intervals, planfilen eller `noter.md`, og hvis de er nødvendige for den næste konkrete planlægningsopgave.

## Hvis du hjælper med at bygge en Custom GPT / agent

Brug [`Instruks.md`](Instruks.md) som canonical runtime-instruks.

Konfigurér disse værdier til brugerens installation:

```text
persistent_owner = <brugerens GitHub-bruger eller organisation>
persistent_repo = SuperCoachPersistent
```

Et andet repo-navn er tilladt.

Tilføj de nødvendige Intervals.icu- og GitHub Contents-actions fra dette repository. Sørg for sikker authentication og mindst mulige nødvendige rettigheder.

## Initialisering af persistent data

Hvis `maal_og_langsigtet_plan.md` mangler, opret en enkel markdown-plan med sektioner for mål, faser, strategi og ugeplan-skabelon.

Hvis `noter.md` mangler, opret:

```json
{
  "schema_version": 1,
  "profile": {},
  "constraints": { "time": [], "injuries": [], "health": [] },
  "preferences": { "running": [], "cycling": [], "general": [] },
  "rules": [],
  "major_decisions": []
}
```

Skriv ikke løbende ugeevalueringer ind i planfilen; brug Intervals NOTE-events og evt. `noter.md` efter reglerne i `Instruks.md`.

## Definition of done

Opsætningen er færdig, når:

- Intervals.icu kan læses.
- `persistent_owner` og `persistent_repo` er kendt.
- GitHub persistent-repo kan læses og skrives.
- plan- og notefiler findes og kan læses.
- agenten har verificeret de centrale Intervals-endpoints.
- ingen secrets er blevet delt i chatten.
- brugeren får en kort opsummering af den aktive opsætning.

Hvis noget blokerer opsætningen, nævn kun den konkrete brugerhandling, der mangler, og fortsæt selv med resten.
