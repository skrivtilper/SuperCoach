# LLM / Agent setup-protokol

Denne side er **til en LLM/agent**, der sætter Pers supercoach op for en bruger.

Målet: gør selv alt, værktøjerne tillader, og bed kun brugeren om handlinger, agenten ikke kan udføre sikkert.

## Standard og fallback

Standard:
- Intervals.icu = profil, aktiviteter, events, wellness og training plan.
- GitHub = langsigtet plan og varige noter.

Hvis brugeren **specifikt ikke ønsker GitHub**, bruges fil-mode med `supercoach_memory.md`.

Hvis brugeren mangler Intervals.icu eller GitHub, skal agenten hjælpe brugeren i gang trin for trin i stedet for blot at stoppe.

Læs altid [`Instruks.md`](Instruks.md) først. Bed aldrig brugeren indsætte API-nøgler, PATs eller andre secrets i chatten.

## Onboarding-beslutning

### Har brugeren Intervals.icu + GitHub?
Verificér begge forbindelser og fortsæt.

### Mangler brugeren Intervals.icu?
Hjælp brugeren med at:
1. oprette en Intervals.icu-konto
2. færdiggøre basisprofilen
3. forbinde relevante aktivitetskilder, hvis ønsket
4. etablere sikker API/connector-adgang
5. vende tilbage, når forbindelsen er klar

Forklar næste konkrete handling i små trin. Brugeren håndterer selv login, email-verifikation, MFA/2FA, captcha, samtykke, betaling og secrets.

Når forbindelsen findes, verificerer agenten selv med `getAthleteProfile`. Manglende historik på en ny konto er ikke en fejl.

### Mangler brugeren GitHub?
Forklar kort, at GitHub anbefales pga. versionshistorik, rollback, portabilitet og robust langtidslagring.

Hjælp derefter med:
1. GitHub-konto
2. sikker forbindelse til agenten
3. privat persistent-repo, standard `SuperCoachPersistent`
4. **Contents: Read and write**
5. initialisering af plan/noter

Hvis agenten kan udføre et trin selv, skal den gøre det. Hvis ikke, bed kun brugeren om det konkrete manglende trin.

Hvis brugeren siger, at GitHub **ikke ønskes**, skift til fil-mode.

## Fil-mode uden GitHub

Konfiguration:

```text
storage_mode = file
memory_file = supercoach_memory.md
```

Agenten vedligeholder én fil direkte i agentens/workspacets filområde:

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

Filen erstatter `maal_og_langsigtet_plan.md` + `noter.md`. Intervals.icu forbliver sandhed for faktiske træningsdata.

Fortæl brugeren én gang under onboarding, at fil-mode har ulemper:
- persistence afhænger af platformen og er ikke garanteret mellem alle chats/agenter
- ingen normal Git-versionhistorik/rollback
- filen kan skulle genvedhæftes/vælges
- synkronisering er mere manuel
- en lokal backup anbefales

Opdatér altid den samme fil. Hvis platformen ikke kan bevare den permanent, giv den opdaterede fil tilbage efter varige ændringer.

## Det gør agenten selv

1. Verificér Intervals med `getAthleteProfile`.
2. Fastslå `storage_mode`: `github` som standard; `file` kun ved eksplicit GitHub-fravalg.
3. GitHub-mode:
   - udled eller spørg om `persistent_owner`
   - find/opret privat persistent-repo
   - kontrollér read/write
   - læs/initialisér `maal_og_langsigtet_plan.md` + `noter.md`
4. Fil-mode:
   - find/opret `supercoach_memory.md`
   - læs hele filen før ændringer
   - opdatér samme fil
5. Kontrollér Intervals: profil, training plan, 14 dages wellness, 90 dages aktiviteter og events fra -60 til +28 dage.
6. Split `listActivities`/`listEvents` i mindre datobidder ved for store svar.
7. Bevar eksisterende data; initialisér kun det manglende.
8. Afslut med kort status: forbindelser, storage-mode, oprettet data og evt. mangler.

## Det må agenten bede brugeren om

Kun ting den ikke selv kan udlede eller udføre.

Hvis `persistent_owner` ikke kan udledes:
> Hvilken GitHub-bruger eller organisation skal eje dit private SuperCoachPersistent-repo?

Hvis GitHub kan læse men ikke skrive: bed brugeren give det valgte repo **Contents: Read and write**. Bed ikke om token-værdien.

Hvis Intervals ikke er autentificeret: hjælp med konto hvis nødvendigt og derefter sikker forbindelse. Bed ikke om API-nøglen i chatten.

Spørg kun om træningsmål, skader, tidsbegrænsninger eller præferencer, hvis de ikke allerede findes og er nødvendige for næste opgave.

## Runtime-konfiguration

GitHub-mode:

```text
storage_mode = github
persistent_owner = <brugerens GitHub-bruger eller organisation>
persistent_repo = SuperCoachPersistent
```

Fil-mode:

```text
storage_mode = file
memory_file = supercoach_memory.md
```

Tilføj Intervals-actions i begge modes. Tilføj kun GitHub Contents-actions i GitHub-mode.

## Definition of done

Opsætningen er færdig, når:
- `getAthleteProfile` virker
- `storage_mode` er kendt
- GitHub-mode: persistent repo kan læses/skrives, og plan/noter findes
- fil-mode: `supercoach_memory.md` kan læses/opdateres, og brugeren kender backup-begrænsningen
- centrale Intervals-endpoints er verificeret
- ingen secrets er delt i chatten
- brugeren får en kort status

Hvis noget blokerer, nævn kun den konkrete brugerhandling, der mangler, og fortsæt selv med resten.
