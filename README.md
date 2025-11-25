# 🧠 Pers supercoach — Opsætningsguide

Denne guide forklarer, hvordan du opretter din egen **Pers supercoach** — en GPT-5-drevet træningsplanlægger, der integrerer med **Intervals.icu** for at planlægge, følge og justere din løbe- og cykeltræning.

---

## 📋 Overblik

**Pers supercoach** kan:
- Læse og følge din langsigtede plan.
- Synkronisere og opdatere træningspas via **Intervals.icu API**
- Logge strukturerede NOTE-hændelser for beslutninger, evalueringer og ugeplaner
- Automatisk justere belastning baseret på wellness- og træningsdata

---

## Forudsætninger

- Du skal have en konto på https://intervals.icu/
- Din intervals konto skal være forbundet til den platform du planlægger / registrerer sport på (f.eks. Garmin)

---

## ⚙️ Trin 1 — Opret GPT’en

1. Gå til **[chat.openai.com/create](https://chat.openai.com/create)**  
2. Dette åbner **Custom GPT Builder**-grænsefladen.
3. Klik *Configure* i toppen.

---

## 🧱 Trin 2 — Grundlæggende info

- **Navn:** `Din supercoach`  
- **Beskrivelse:** `Sørger for at du kommer i superform.`  
- **Profilbillede:** generér automatisk eller upload et enkelt, markant ikon (tema: udholdenhed/træner).
- **Model:** GPT-5
- **Capabilities:** Web Search, Canvas, Code interpreter & Data Analysis

---

## 🧩 Trin 3 — Tilføj adfærdsbeskrivelsen

- Indsæt indholdet fra instruksen under **Instructions**
```
https://github.com/skrivtilper/SuperCoach/blob/main/Instruks.md
```

---

## 📂 Trin 4 — Upload planfilen

Lav og upload din langsigtede træningsplan.
Du kan bruge min skabelon som du finder her:
```
https://github.com/skrivtilper/SuperCoach/blob/c21f34f90b913f62461f4c9d08beb4563a8ec22e/maal_og_langsigtet_plan.md
```
Men du skal selvfølgelig lave din egen plan. Hvis ikke du har en kan chatGPT hurtigt lave et udkast, det gjorde jeg. Når Supercoachen er i gang tilpasser du selvfølgelig planen i dialog, så den passer til dine mål, din træningshistorik og din form.

| Fil | Formål |
|------|--------|
| `maal_og_langsigtet_plan.md` | Indeholder mål, faser og ugeplaner |

Når filen er uploadet, ligger den i GPT’ens miljø som:  
`/mnt/data/maal_og_langsigtet_plan.md`

---

## 🔌 Trin 5 — Opret Intervals.icu-handlinger

Brug **Handlinger (Actions)** til at forbinde GPT’en med Intervals.icu API’et.  
Hver handling bruger din **personlige API-nøgle** *Se nedenfor

Indsæt indholdet fra openAPI intervals_icu.yaml eller *Import from URL* med dette link 
```
https://github.com/skrivtilper/SuperCoach/blob/c21f34f90b913f62461f4c9d08beb4563a8ec22e/openAPI%20intervals_icu.yaml
```
Det giver disse handlinger:

| Handlingsnavn | Metode | URL |
|----------------|--------|-----|
| `getAthleteProfile` | GET | `https://intervals.icu/api/v1/athlete` |
| `listActivities` | GET | `https://intervals.icu/api/v1/athlete/activities?start={start}&end={end}` |
| `listEvents` | GET | `https://intervals.icu/api/v1/athlete/events?start={start}&end={end}` |
| `createEvent` | POST | `https://intervals.icu/api/v1/athlete/events` |
| `updateEvent` | PUT | `https://intervals.icu/api/v1/athlete/events/{eventId}` |
| `getWellnessByDate` | GET | `https://intervals.icu/api/v1/athlete/wellness/{date}` |
| `upsertWellnessBulk` | POST | `https://intervals.icu/api/v1/athlete/wellness/bulk` |
| `getAthleteTrainingPlan` | GET | `https://intervals.icu/api/v1/athlete/training-plan` |
| `setAthleteTrainingPlan` | PUT | `https://intervals.icu/api/v1/athlete/training-plan` |

**Godkendelse:**
- Type: *API key* *Se nedenfor 

---

## 🔑 Trin 6 — Sådan genererer du API-nøglen

Først skal du generere en API nøgle på intervals.
Under indstillinger scroller du ned til du ser **Udviklerindstillinger** og klikker på blyanten.
<img width="205" height="89" alt="image" src="https://github.com/user-attachments/assets/fb159a6f-67e8-4d38-a113-0367964b4740" />

Nøglen skal *encodes* som base64. Det er meget lettere end det lyder.
Der er masser af online tjenester der kan klare det, jeg bruger: https://www.base64encode.org/
Værdien der skal encodes er:
```
basic <Din API key>
```
For eksempel: "basic uieyviu9o7459o8looi4vway"
Det sætter du ind i det øverste felt.
Klik encode, og kopier værdien fra nederste felt.
Værdien sætter du ind i API Key feltet så det ser sådan ud:

<img width="426" height="369" alt="image" src="https://github.com/user-attachments/assets/806d4d49-a80e-4105-ae67-f527f698f874" />

Test handlingen `getAthleteProfile` — Din profil bør blive vist i Preview vinduet til venstre.
<img width="854" height="111" alt="image" src="https://github.com/user-attachments/assets/aaa7c4f6-d923-4b09-9ab7-6aa3234d6ae7" />

## Voila

Nu kan din GPT læse din aktivitet og skrive træninger til intervals, der synkroniserer til de tjenester du har valgt.
Det er kun fantasien der sætter grænser. Den kan også ændre, flytte og slette aktiviteter.
I den version vi har oprettet her kan den ikke skrive i den langsigtede plan (selvom den tror det). Du kan bede den tage planen i canvas, og rette i den. Men du skal selv uploade en ny kopi og fjerne den gamle.

Dem med falkeøje vil se at der allerede er integration til GitHub på vej i filerne. Planen er at lægge den langsigtede plan i et private repository og lade GPT'en læse og skrive til den der. https://github.com/skrivtilper/SuperCoach/issues/1
Jeg overvejer også at lægge korttidshukommelsen i GitHub i stedet for noterne i intervals.
