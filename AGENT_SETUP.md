# LLM / Agent setup-protokol

Denne side er **entrypoint for en LLM/agent**, der får beskeden “Her er repoet, sæt det op for mig”.

Læs også `agent-manifest.yaml` og derefter `Instruks.md`.

## Bootstrap-kontrakt

Når brugeren beder dig sætte repoet op:

1. **Start installationen med det samme.**
2. Spørg ikke generelt “hvad vil du sætte op?” eller “har du GitHub/Intervals?”, hvis det kan afgøres via dine værktøjer.
3. Detektér først dine capabilities og eksisterende forbindelser.
4. Udfør alle sikre trin selv.
5. Bed kun brugeren om den **første konkrete blocker**, som du ikke selv kan løse.
6. Stil højst ét blocker-spørgsmål ad gangen.
7. Genoptag automatisk setup, når blockeren er løst.
8. Bed aldrig brugeren indsætte API-nøgler, PATs eller andre secrets direkte i chatten.
9. Afslut først, når smoke testen er kørt, eller når en konkret ekstern blocker er tydeligt navngivet.

Målet er, at brugeroplevelsen skal være:

> “Her er repoet, sæt det op for mig.”

… efterfulgt af så lidt dialog som muligt. Brugeren skal primært involveres ved login, samtykke, sikkerhedsvalg eller information, som agenten ikke kan udlede.

## Capability detection

Før du spørger brugeren om noget, afgør:

- Kan du læse `AGENT_SETUP.md`, `agent-manifest.yaml` og `Instruks.md`?
- Har du adgang til Intervals.icu?
- Har du adgang til GitHub Contents?
- Kan GitHub-forbindelsen læse/skrive brugerens private persistent-repo?
- Kan du oprette repoer? Hvis ikke, kan brugeren gøre det i UI?
- Kan din platform bevare en fil mellem chats/workspaces?

Brug capabilities, der faktisk findes. Lov aldrig funktioner, du ikke kan udføre.

## Standard og fallback

Standard:

- Intervals.icu = profil, aktiviteter, events, wellness og training plan.
- GitHub = langsigtet plan og varige noter.
- `storage_mode = github`.

Hvis brugeren **specifikt ikke ønsker GitHub**:

- brug `storage_mode = file`
- brug `supercoach_memory.md`
- forklar én gang begrænsningerne: svagere persistence, normalt ingen Git-historik/rollback, mulig genvedhæftning og mere manuel synkronisering
- anbefal lokal backup

Manglende GitHub-konto er **ikke** i sig selv et GitHub-fravalg. Hjælp først brugeren med onboarding.

## Onboarding-beslutningstræ

### Brugeren har Intervals.icu og GitHub

Verificér begge forbindelser og fortsæt uden unødige spørgsmål.

### Brugeren mangler Intervals.icu

Guid brugeren trin for trin:

1. Opret Intervals.icu-konto.
2. Færdiggør basisprofil.
3. Forbind evt. relevante aktivitetskilder.
4. Etablér sikker API/connector-adgang.
5. Verificér selv med `getAthleteProfile`.

Brugeren håndterer selv login, email-verifikation, MFA/2FA, captcha, samtykke, evt. betaling og secret-værdier.

Manglende historik på en ny konto er ikke en fejl.

### Brugeren mangler GitHub

Forklar kort, at GitHub anbefales til robust, flytbar og versionsstyret langtidshukommelse.

Hjælp derefter med:

1. Opret GitHub-konto.
2. Etablér sikker GitHub-forbindelse.
3. Find eller opret et **privat** persistent-repo; standardnavn `SuperCoachPersistent`.
4. Sørg for **Contents: Read and write**.
5. Initialisér plan og noter.

Hvis du kan oprette repoet selv, gør det. Hvis ikke, bed kun brugeren udføre netop dette trin.

Hvis brugeren herefter eksplicit fravælger GitHub, skift til fil-mode.

### Brugeren ønsker ikke GitHub

Konfigurér:

```text
storage_mode = file
memory_file = supercoach_memory.md
```

Opret/vedligehold én samlet fil med mindst:

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

Intervals.icu forbliver sandhed for faktiske træningsdata.

Hvis platformen ikke kan bevare filen permanent, giv den opdaterede fil tilbage til brugeren efter varige ændringer og bed brugeren erstatte sin seneste kopi.

## Setup-flow, som agenten selv udfører

Når adgang findes:

1. Læs runtime-instruksen.
2. Verificér Intervals med `getAthleteProfile`.
3. Fastslå `storage_mode`.
4. GitHub-mode:
   - udled `persistent_owner` hvis muligt
   - find/opret privat persistent-repo
   - verificér read/write
   - læs eller initialisér `maal_og_langsigtet_plan.md` og `noter.md`
5. Fil-mode:
   - find/opret `supercoach_memory.md`
   - læs hele filen før ændringer
6. Hent Intervals:
   - training plan
   - 14 dages wellness
   - 90 dages aktiviteter
   - events fra -60 til +28 dage
7. Split store activity/event-kald i mindre datobidder ved for store svar.
8. Bevar eksisterende data; initialisér kun det, der mangler.
9. Kør smoke testen.
10. Giv én kort “klar til brug”-status.

## Smoke test

Smoke testen skal efterlade **ingen semantiske testdata**.

### 1. Intervals read

- `getAthleteProfile` skal lykkes.
- Verificér mindst ét yderligere sikkert read, fx training plan eller wellness.

### 2. Persistent storage read/write

**GitHub-mode:**
- læs en persistent fil
- verificér reel skriveadgang
- foretræk en reversibel temp-fil, hvis create+delete er muligt
- hvis delete ikke er muligt: skriv identisk indhold tilbage til en eksisterende persistent fil og verificér, at det kan læses uændret igen
- ændr aldrig semantisk plan/notedata bare for testen

**Fil-mode:**
- læs `supercoach_memory.md`
- lav en ikke-semantisk testændring i hukommelsen/in-memory og bekræft, at filen kan skrives tilbage uændret
- hvis platformen kun kan levere filer til brugeren, verificér at en opdateret fil kan genereres

### 3. Idempotens i Intervals

Hvis `createEvent`, `updateEvent`, `listEvents` og `deleteEvent` er tilgængelige:

1. Opret en midlertidig fremtidig NOTE med en tydelig smoke-test `external_id`.
2. Find den igen.
3. Kør samme planlogik igen: find eksisterende `external_id` og **update** i stedet for create.
4. Verificér, at der stadig kun findes én matching event.
5. Slet smoke-test-eventet.

Hvis cleanup ikke kan garanteres, må testen ikke oprette eventdata. Rapportér i stedet idempotens-testen som ikke udført og forklar den konkrete manglende capability.

### 4. Security check

Bekræft, at ingen secret-værdier er blevet indsat i chatten.

## Definition of done

Setup er færdigt, når:

- Intervals-profilen kan læses
- storage-mode er kendt
- persistent storage kan læses og skrives
- plan/noter eller memory-fil findes
- centrale Intervals-reads virker
- idempotens-smoke-testen er bestået, eller en konkret manglende cleanup-capability er rapporteret
- ingen secrets er delt i chatten
- brugeren får en kort status

## Slutstatus til brugeren

Hold den kort. Den bør ligne:

> Klar. Intervals er forbundet, persistent storage er sat til GitHub, plan/noter kan læses og skrives, og smoke testen er bestået. Du kan nu bare bede mig planlægge eller evaluere din træning.

Hvis noget er blokeret, nævn kun:
- hvad der allerede virker
- den ene konkrete blocker
- præcis hvad brugeren skal gøre nu
