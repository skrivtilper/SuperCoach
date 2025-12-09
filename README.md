# 🧠 Pers supercoach — Opsætningsguide

Denne guide forklarer, hvordan du opretter **din egen** Pers supercoach — en GPT‑5.1‑drevet træningsassistent, der integrerer med **Intervals.icu** og (valgfrit) et **privat GitHub‑repository** til langsigtet plan og noter.

> 💡 Tanken er, at du ikke bruger min GPT direkte, men bygger din **egen kopi** med dine egne nøgler, planer og præferencer.

---

## 🚦 Vælg setup‑model

Der er to måder at gemme din langsigtede plan på:

| Model | Navn                                  | Hvor ligger planen?                                        | Fordele                                                          | Ulemper                                                                       |
| ----- | ------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **A** | Plan som *knowledge*                  | Som uploadet fil i selve GPT’en                            | Nemmest at sætte op, ingen GitHub eller tokens ud over Intervals | Planen opdateres **ikke automatisk** – du kopierer selv ændringer ind i filen |
| **B** | Plan + noter i **privat GitHub‑repo** | `maal_og_langsigtet_plan.md` + `noter.md` i et privat repo | GPT’en kan **selv læse/rette** plan og noter via GitHub API      | Kræver GitHub‑konto, privat repo og PAT (token)                               |

👉 **Hvis du er i tvivl: start med Model A.** Du kan altid skifte til Model B senere.

Resten af guiden er bygget sådan:

* [1. Fælles opsætning](#-1-fælles-opsætning) — gælder begge modeller
* [2. Model A – Plan som knowledge](#-2-model-a--plan-som-knowledge)
* [3. Model B – Plan i privat GitHub‑repo](#-3-model-b--plan--noter-i-privat-github-repo)
* [4. Test at det virker](#-4-test-at-det-virker)
* [5. FAQ & typiske fejl](#-5-faq--typiske-fejl)

---

## 1. Fælles opsætning

### 1.1 Forudsætninger

Du skal bruge:

* En **ChatGPT‑konto** med adgang til **Custom GPTs**.
* En konto på **[https://intervals.icu](https://intervals.icu/)**.
* Din Intervals‑konto skal være forbundet til den platform, du bruger (fx Garmin).
* (Kun Model B) En **GitHub‑konto** til dit private plan‑/notat‑repository.

> 🔐 Del aldrig dine API‑nøgler (Intervals eller GitHub) med andre. De fungerer som adgangskoder.

---

### 1.2 Opret din egen GPT

1. Gå til **[https://chat.openai.com/create](https://chat.openai.com/create)**.
2. Det åbner **Custom GPT Builder**.
3. Klik på **Configure** øverst.

#### Grundlæggende info

Foreslåede værdier (du kan selvfølgelig ændre dem):

* **Name**: `Din supercoach`
* **Description**: `Sørger for at du kommer i superform.`
* **Profile picture**: generér automatisk eller upload et simpelt, sporty ikon.
* **Model**: `GPT‑5.1`
* **Capabilities**: slå følgende til:

  * ✅ Web browsing
  * ✅ Code interpreter / Data Analysis
  * ✅ Canvas (valgfrit, men anbefalet til at redigere planfilen sammen)

---

### 1.3 Tilføj adfærdsbeskrivelsen (instruksen)

Instruksen fortæller supercoachen **hvordan den skal arbejde**.

#### Hvis du bruger **Model A – Plan som knowledge**

1. Åbn instruksen **`Instruks.md`** i dette repo.
2. Kopiér hele indholdet.
3. I GPT‑builderen: under **Configure → Instructions**, indsæt teksten.
4. Gem.

#### Hvis du bruger **Model B – Plan i GitHub**

1. Åbn **`Instruks med plan i GitHub.md`** i dette repo.
2. Kopiér hele indholdet.
3. I GPT‑builderen: under **Configure → Instructions**, indsæt teksten.
4. I den indsatte tekst finder du sektionen **“GitHub (plan & noter)”** og retter linjerne:

   * `owner = "DIT_GITHUB_BRUGERNAVN"`
   * `repo = "DIT_PRIVAT_REPO_NAVN"`
5. Behold som udgangspunkt stierne:

   * Plan: `path = "maal_og_langsigtet_plan.md"`
   * Noter: `path = "noter.md"`
6. Gem.

> 💡 Det er **kun** i Model B, at supercoachen forventer at kunne læse/skrue på plan og noter i GitHub.

---

### 1.4 Opret Intervals.icu‑handlinger

Nu skal GPT’en kunne tale med Intervals.icu.

1. I GPT‑builderen, gå til **Configure → Actions → Add actions**.

2. Vælg **“Import from URL”** og indsæt:

   ```
   https://github.com/skrivtilper/SuperCoach/raw/main/openAPI%20intervals_icu.yaml
   ```

3. Importen opretter en række handlinger, bl.a.:

   | Handlingsnavn                 | Formål (kort)                     |
   | ----------------------------- | --------------------------------- |
   | `getAthleteProfile`           | Hent basisdata om dig             |
   | `listActivities`              | Hent gennemførte aktiviteter      |
   | `listEvents`                  | Hent planlagte pas og NOTE‑events |
   | `createEvent` / `updateEvent` | Opret / ret træningspas og noter  |
   | `deleteEvent`                 | Slet events                       |
   | `getWellnessByDate` osv.      | Læs / skriv wellness‑data         |
   | `getAthleteTrainingPlan`      | Læs din training plan‑tilknytning |
   | `setAthleteTrainingPlan`      | Sæt/ændr training plan            |

4. Under **Authentication** for denne action‑pakke vælger du **Basic auth** (det kommer fra OpenAPI‑filen) – selve nøglen sætter du op i næste trin.

---

### 1.5 Generér og tilføj Intervals API‑nøgle

1. Log ind på **Intervals.icu**.
2. Gå til **Settings / Indstillinger**.
3. Scroll ned til **Developer settings / Udviklerindstillinger** og klik på blyanten.
4. Opret en **API key**.

For at GPT’en kan bruge den, skal den laves om til en **Basic Auth‑streng** med Base64:

1. Byg først den tekst, der skal encodes:

   ```
   API_KEY:din_api_nøgle
   ```

   Eksempel: `API_KEY:uieyviu9o7459o8looi4vway`

2. Gå til en Base64‑encoder, fx:

   * [https://base64convert.cc](https://base64convert.cc)

3. Indsæt teksten i feltet **“Text to encode”** og klik **Encode**.

4. Kopiér resultatet (den Base64‑kodede streng).

Nu skal den ind i GPT‑builderen:

1. I GPT‑builderen, under **Configure → Actions → Intervals.icu‑actionpakken → Authentication**.
2. I feltet for API‑nøglen skriver du:

   ```
   basic DIN_BASE64_VÆRDI
   ```

   Eksempel:

   ```
   basic oiuoaewtvoiwlaeyoiuwageroiuycsefluk=
   ```
3. Gem.
4. Test handlingen `getAthleteProfile` direkte i builderen – du bør se din Intervals‑profil i preview.

> 🔐 Din Intervals API‑nøgle ligger nu **kun** i din GPT‑konfiguration. Del ikke GPT’en offentligt med denne nøgle – lad andre bygge deres egen kopi i stedet.

---

## 2. Model A – Plan som *knowledge*

I denne model ligger den langsigtede plan **kun som uploadet fil** i GPT’en. Supercoachen kan læse den, men du opdaterer selv filen, når der aftales større ændringer.

### 2.1 Lav din langsigtede plan

1. Åbn skabelonen **`maal_og_langsigtet_plan.md`** i dette repo.
2. Kopiér indholdet til din egen fil og tilpas:

   * Mål (fx halvmaraton, marathon, FTP‑mål).
   * Faser (base, build, specifik, taper, osv.).
   * Typiske ugeplaner for de forskellige faser.
3. Gem filen som `maal_og_langsigtet_plan.md` på din computer.

> Tip: Du kan lade GPT hjælpe dig med et første udkast og så finpudse manuelt.

### 2.2 Upload planen som knowledge

1. I din supercoach‑GPT, gå til **Configure → Knowledge**.
2. Klik **Upload files** og vælg `maal_og_langsigtet_plan.md`.
3. Sørg for, at knowledge er slået **til**.

I denne model vil GPT’en typisk:

* Læse planfilen ved opstart.
* Foreslå ændringer og give dig **2–4 linjer “kopiér‑til‑fil”** når planen skal justeres.
* Du opdaterer selv din lokale kopi og uploader en ny version, når det passer.

> 🔄 Når du har uploadet en ny version af planen, kan du slette den gamle fil i Knowledge for at undgå forvirring.

---

## 3. Model B – Plan + noter i privat GitHub‑repo

I denne model ligger både **plan** og **varige noter** i et privat GitHub‑repository. Supercoachen kan selv læse og skrive til filerne via GitHub‑Actions.

> Denne model kræver lidt mere setup, men til gengæld opdateres plan og noter automatisk, når I beslutter ændringer.

### 3.1 Opret et privat repository til dine data

1. Gå til **GitHub → New repository**.
2. Vælg fx navnet `supercoach-plan`.
3. Marker repository som **Private**.
4. Opret repo’et (du behøver ikke README eller license).

> Du kan kalde repo’et hvad du vil – bare husk at bruge samme navn i instruksen (`repo = "..."`).

### 3.2 Tilføj plan og noter

I dit nye private repo opretter du to filer i roden:

1. **`maal_og_langsigtet_plan.md`**

   * Brug skabelonen fra dette repo som udgangspunkt.
   * Tilpas mål, faser og ugeplaner til dit eget liv.

2. **`noter.md`**

   * Brug gerne denne minimale JSON‑skabelon:

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

   * Supercoachen bruger denne fil til varige regler, præferencer, skadeshistorik og store beslutninger.

### 3.3 Importér GitHub‑Actions

Nu skal GPT’en kunne læse/commit’e filer i dit repo.

1. I GPT‑builderen, gå til **Configure → Actions → Add actions**.

2. Vælg **“Import from URL”** og indsæt:

   ```
   https://github.com/skrivtilper/SuperCoach/raw/main/github-contents-openapi.yaml
   ```

3. Det opretter handlinger til bl.a.:

   * Læse en fil (`getFileContents`).
   * Skrive/commit’e en fil (`putFileContents`).
   * Hente repo‑metadata (`getRepo`).
   * Hente commits for en fil (`listCommitsForPath`).

### 3.4 Opret GitHub Personal Access Token (PAT)

1. På GitHub: gå til **Settings → Developer settings → Personal access tokens**.
2. Opret et nyt token (PAT) med **læse/skrivetilladelse til det private repo**.

   * På nye tokens: giv adgang til det konkrete repo og sørg for **Contents: Read and write**.
3. Kopiér token’et et sikkert sted – du kan **ikke** se det igen, når du har lukket siden.

### 3.5 Tilføj PAT til GitHub‑Actions i GPT’en

1. I GPT‑builderen: under **Configure → Actions → GitHub Contents API**.
2. Under **Authentication** vælger du **Bearer token** (eller det, builderen foreslår ud fra OpenAPI‑filen).
3. Indsæt dit PAT som hemmelig nøgle.
4. Gem.

Supercoachen kan nu:

* Læse `maal_og_langsigtet_plan.md` og `noter.md` direkte fra GitHub.
* Lave ændringer ved først at læse filen, opdatere relevante sektioner og skrive hele filen tilbage som ét commit.

> 🔐 Del ikke GPT’en offentligt med dit PAT. Guiden er tænkt sådan, at **hver person laver sin egen GPT** og sit eget private repo.

---

## 4. Test at det virker

Når alt er sat op:

1. Åbn en ny chat med din supercoach.
2. Skriv fx: `Hent min profil og giv mig et kort overblik over den seneste uges træning.`
3. Tjek at GPT’en:

   * Kalder `getAthleteProfile` uden fejl.
   * Kalder `listActivities` / `listEvents` og kan se dine data.
4. Hvis du bruger **Model A**:

   * Bed den om at opsummere din nuværende fase ud fra planfilen.
5. Hvis du bruger **Model B**:

   * Bed den om at læse `maal_og_langsigtet_plan.md` fra GitHub og forklare, hvilken fase du er i.

Hvis noget fejler, se næste afsnit.

---

## 5. FAQ & typiske fejl

### “Jeg får 401/403 fejl mod Intervals.icu”

* Tjek at din API‑nøgle i Intervals stadig er aktiv.
* Tjek at du har encodet **`API_KEY:din_api_nøgle`** og ikke kun selve nøglen.
* Tjek at du har skrevet `basic ` + den Base64‑kodede værdi i API‑feltet.

### “GPT’en kan ikke læse min planfil” (Model A)

* Sørg for at `maal_og_langsigtet_plan.md` er uploadet under **Knowledge**.
* Har du skiftet filnavn, skal du opdatere det i instruksen eller uploade med det forventede navn.

### “GPT’en kan ikke finde min GitHub‑fil” (Model B)

* Tjek at **owner** og **repo** i instruksen matcher dit faktiske GitHub‑brugernavn og repo.
* Tjek at filerne ligger i roden af repo’et, og at navnene er præcis:

  * `maal_og_langsigtet_plan.md`
  * `noter.md`
* Tjek at PAT’et har **read/write** adgang til repo’et.

### “Kan jeg dele min supercoach med andre?”

* Ja – men **del ikke** en version med dine egne API‑nøgler og PAT, hvis andre skal bruge den med deres data.
* Den typiske løsning er:

  1. Del link til dette repository.
  2. De andre følger guiden og laver deres **egen** GPT med egne nøgler.

---

## About

Pers supercoach er en træningsassistent til løb og cykling med:

* Integration til **Intervals.icu** til data, træningsplan og NOTE‑events.
* Langsigtet plan i enten **knowledge** eller **privat GitHub‑repo**.
* Fokus på korte, konkrete svar og automatiske API‑kald uden unødvendige spørgsmål.

Bidrag, forslag og issues er meget velkomne via GitHub‑repo’et.
