# LuxXx' AG Spiel API für NodeJS

Die API wird wahrscheinlich ohne Premium-Account Fehler auslösen. Diese kann ich und werde ich wahrscheinlich nicht beheben.

__Vorweg möchte ich nochmal aus dem Regelwerk zitieren:__

`§5 Das Benutzen und von Programmen/Bots, die einen Spielvorteil ermöglichen, Funktionen bieten die sich mit Premiumfeatures überschneiden oder hohe Serverbelastungen erzeugen (z.B. Parsen der Seite mit mehr als einem Aufruf pro Sekunde), ist verboten. Die Bewerbung/Verbreitung von Browserplugins oder anderer clientseitiger Software zur Erweiterung/Veränderung der Webseite ist verboten.`

Jeder muss diese Regel bei der Nutzung dieser API beachten. Falls du dir unsicher bist, was erlaubt ist und was nicht, erstelle bitte ein Ticket.

Die AG Spiel API ist eine Bibliothek von Funktionen, die sich rund um das Spiel [AG Spiel](https://www.ag-spiel.de/) drehen. Sie ist in purem JavaScript für die JS-Engine [NodeJS](https://nodejs.org/) geschrieben. Ich nutze diese API, um weitere Apps wie z.B. mit [Electron](https://electron.atom.io/) zu programmieren. Ich versuche die API möglichst einfach zu gestalten, leider benötigt man trotzdem einige grundlegende Kenntnisse über server-side JavaScript, da die meisten I/O-Abfragen über [Promises](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise) gelöst wurden. Außerdem sollte man [Lambda-Funktionen](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Pfeilfunktionen) kennen.
## Was kann die API?:
* Profil auslesen [80%]
* Chronik auslesen [100%]
* Depot auslesen [100%]
* Aktionärsstruktur auslesen [100%]
* Trades der letzten 30 Tage auslesen [90%]
* Käufer / Verkäufer auslesen [100%]
* Bilanzen auslesen [100%]
* Orderbuch auslesen [100%]
* Kontoauszug auslesen [100%]
* AG-Liste auslesen [100%]
* Indexliste auslesen [100%]
* Zinsumrechnungen und damit einhergehende Anleihenumrechnungen [100%]
* Live-Börse [80%]
* Statistiken auslesen [0%}
* Index auslesen [50%]
* AGSX auslesen [0%]
* Wer ist online? [100%]
* Chat API [0%]
* Neue AGs auslesen [0%]
* AGs in Liquidation, gesperrte AGs sowie Strafzahlungen auslesen [0%]

## Ausprobieren ist immer gut!
* NodeJS installieren
* `index.js` erstellen. Ihr könnt euch an der test.js orientieren
* Per `const agspiel = require('agspiel')` die API in der `index.js` einbinden
* Konsole öffnen und in den Ordner der `index.js` navigieren
* Per `npm install agspiel` Abhängigkeiten installieren
* Per `node index.js` starten

## Erste Schritte
Um auf die Daten des AG Spiels zuzugreifen, muss die API sich authorisieren. Das geschieht derzeit noch über Cookies.
Die Cookies könnt ihr, solange ihr beim AG-Spiel eingeloggt seid, über euren Browser erfahren (Bei Firefox STRG+Umschalt+Q und eine beliebige Anfrage anklicken. Danach seht ihr rechts die Cookies). Mit der `auth(phpsessid-cookie, agspiel-cookie)`-Funktion könnt ihr euch also "einloggen".
```js
const agspiel = require('agspiel');
agspiel.auth('PHPSESSID-cookie', 'agspiel-cookie');
```
Ihr habt nun ein Objekt (`agspiel`), dass euch alle Funktionen bietet. Im Folgenden zeige ich wie ich mein Profil über die API erreiche.

Die "Bibliothek" `retrieve` bietet grundlegende Funktionen, um Informationen vom AG Spiel herunterzuladen. Jede Funktion in dieser Bibliothek gibt ein sogenanntes [Promise](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise) zurück. Da wir mit einem Server kommunizieren und JavaScript asynchron ist, müssen wir auf das Promise die Funktion `then` anwenden. Wir geben nun der Funktion `then` eine weitere Funktion mit, die als Eingabeparameter das Profil, das wir bekommen wollen nimmt und unseren Code ausführt. Falls ihr mehr über async JS wissen wollt, [schaut mal hier](https://www.heise.de/developer/artikel/Einfuehrung-in-die-asynchrone-JavaScript-Programmierung-2752531.html).
```js
const agspiel = require('agspiel');
agspiel.auth('PHPSESSID-cookie', 'agspiel-cookie');
const retrieve = agspiel.retrieve;

retrieve.profile('LuxXx').then(profile => {
  console.log(profile)
});
```
Dieses Programm gibt folgendes aus:
```js
{ name: 'Black Scholes Group',
  handelskurs: 203.5,
  geldkurs: 199,
  briefkurs: 203.5,
  wkn: 166541,
  premium: 2,
  userid: 74031,
  il: false,
  banned: false,
  index: 1889,
  sw: 15.69,
  bwaktie: 17.53,
  ksd: 1197,
  agsxp: 1309,
  kurs14d: 1.75,
  ceo: 'LuxXx',
  spread: 2.21,
  tagesvolumen: '3 Tsd.',
  bargeld: 1350123.16,
  aktien: 103118,
  anleihen: 1900000,
  zertifikate: 0,
  eigenkapital: 1753241.16,
  fremdkapital: 1600000,
  regdatum: '2017-06-10T22:00:00.000Z',
  agregdatum: '2017-06-10T22:00:00.000Z',
  aktienanzahl: 100000,
  dividende: 0,
  maxZertifikate: 25,
  whs: 213,
  ghs: 936,
  gehs: 648,
  ues: true,
  tageshoch: 204.7,
  tagestief: 203.5,
  picture: [Function],
  vg: [Function],
  buchwert: [Function],
  [...]
  }
```

Das, was ausgegeben wurde, ist ein JavaScript-Objekt. Wir können auf alle Eigenschaften sehr einfach zugreifen.
Die WKN erhalten wie so: `profile.wkn`

Das `retrieve` Objekt beinhaltet außerdem weitere Funktionen:
* `object profile(wkn / playername)`
* `object profileByUserID(userid)`
* `object chronik(wkn)`
* `object depot(wkn)`
* `array aktionaere(wkn)`
* `object trades(wkn)` 
* `array kaeufer(wkn)`
* `array bilanzen(wkn)`
* `array agliste()`
* `array indizes()`
* `object live(os, ts)` - Genauere Erklärung folgt
* `object stats()`
* `object index(indexId)`
* `array agsx()`

Ich werde nicht alle Funktionen genau beschreiben, die meisten funktionieren analog.

Hier ein Beispiel der Inhalte der anderen Funktionen:
Depot von #166541 (`retrieve.depot(166541)`)
```js
{ aktien:
   [ { wkn: 102216,
       name: 'CAMILLE HOLDING AG',
       anzahl: 32,
       aenderung: 0,
       geldkurs: 1521,
       handelskurs: 1589,
       briefkurs: 1589,
       bwaktie: 3017.91,
       bw: 50848,
       sw: 1488.14 },
     { wkn: 152381,
       name: 'Walsh Consulting SE',
       anzahl: 22,
       aenderung: 0,
       geldkurs: 850.6,
       handelskurs: 875,
       briefkurs: 875,
       bwaktie: 1272.83,
       bw: 19250,
       sw: 328.89 },
     { wkn: 164873,
       name: 'DIONYSOS',
       anzahl: 26,
       aenderung: 0,
       geldkurs: 1268.8,
       handelskurs: 1270,
       briefkurs: 1390,
       bwaktie: 449.2,
       bw: 33020,
       sw: 227.64 } ],
  anleihen:
   [ { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 100000,
       zinssatz: 2,
       zinsbetrag: 10408.08,
       auszahlung: 110408,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:08:33.000Z' },
     { volumen: 1000000,
       zinssatz: 0.53,
       zinsbetrag: 26782.39,
       auszahlung: 1026782,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:10:21.000Z' },
     { volumen: 100000,
       zinssatz: 2.1,
       zinsbetrag: 10950.36,
       auszahlung: 110950,
       laufzeit: '5 Tage',
       restlaufzeit: '25 Std.',
       auszahlungsdatum: '2017-07-19T15:10:24.000Z' } ],
  kredite:
   [ { volumen: 1000000,
       zinssatz: 0.151,
       zinsbetrag: 46305.97,
       rueckzahlungsbetrag: 1046306,
       laufzeit: '30 Tage',
       restlaufzeit: '8 Tage',
       rueckzahlungsdatum: '2017-07-26T13:33:17.000Z' },
     { volumen: 600000,
       zinssatz: 0.089,
       zinsbetrag: 16228.47,
       rueckzahlungsbetrag: 616228,
       laufzeit: '30 Tage',
       restlaufzeit: '28 Tage',
       rueckzahlungsdatum: '2017-08-15T19:22:03.000Z' } ],
  zertifikate: [] }
```
Chronik von #155401 (`retrieve.chronik(155401)`):
```js
{ namechanges:
   [ { datum: '2017-05-06T22:00:00.000Z',
       from: 'Bearish Monster AG',
       to: 'Bearish Holding AG' },
     { datum: '2017-03-12T23:00:00.000Z',
       from: 'Bearish Holding',
       to: 'Bearish Monster AG' } ],
  regname: 'Bearish Holding',
  kes:
   [ { datum: '2016-10-31T23:00:00.000Z',
       anzahl: 1000000,
       volumen: 120000000 } ],
  khs: [],
  uebernahmen: [],
  regdatum: '2016-09-10T22:00:00.000Z' }
```
Chronik von #109941 (`retrieve.chronik(10941)`):
```js
{ namechanges:
   [ { datum: '2016-10-01T22:00:00.000Z',
       from: 'Graue Maus AG ',
       to: 'KooL AG ' },
     { datum: '2016-08-23T22:00:00.000Z',
       from: 'KooL AG',
       to: 'Graue Maus AG ' },
     { datum: '2015-12-26T23:00:00.000Z',
       from: 'X - ool AG',
       to: 'KooL AG' },
     { datum: '2015-12-02T23:00:00.000Z',
       from: 'Kool AG',
       to: 'X - ool AG' },
     { datum: '2014-12-24T23:00:00.000Z',
       from: 'X - ool AG',
       to: 'Kool AG' },
     { datum: '2014-11-24T23:00:00.000Z',
       from: 'X-ool AG',
       to: 'X - ool AG' },
     { datum: '2014-11-24T23:00:00.000Z',
       from: 'Kool AG',
       to: 'X-ool AG' } ],
  regname: 'Kool AG',
  kes:
   [ { datum: '2015-08-17T22:00:00.000Z',
       anzahl: 130567,
       volumen: 169737100 } ],
  khs:
   [ { datum: '2017-06-27T22:00:00.000Z',
       anzahl: 278,
       volumen: 1291127 },
     { datum: '2017-06-25T22:00:00.000Z', anzahl: 222, volumen: 999000 },
     { datum: '2017-04-29T22:00:00.000Z',
       anzahl: 500,
       volumen: 1776220 },
     [...],
     { datum: '2014-05-17T22:00:00.000Z', anzahl: 1, volumen: 91 } ],
  uebernahmen:
   [ { datum: '2016-03-21T23:00:00.000Z',
       uebernommener: 130307,
       uebernahmekh: 1 },
     { datum: '2016-03-16T23:00:00.000Z',
       uebernommener: 138223,
       uebernahmekh: 0 } ],
  regdatum: '2014-01-07T23:00:00.000Z' }
```

Ausschnitt aus AG-Liste (`retrieve.agliste()`):
```js
[ { id: 0, wkn: 163954, name: 'A Kulmbacher AG' },
  { id: 1, wkn: 163305, name: 'A&K Holding AG' },
  { id: 2, wkn: 155046, name: 'A..A..B&Shout' },
  { id: 3, wkn: 164492, name: 'A.I.S. - AG' },
  { id: 4, wkn: 166694, name: 'A1 Messebau AG' },
  { id: 5, wkn: 164581, name: 'AAA Falk' },
  { id: 6, wkn: 103897, name: 'AAA GoldPlatinSilber' },
  { id: 7, wkn: 167385, name: 'Aautocor' },
  { id: 8, wkn: 102884, name: 'Abanta AG' },
  { id: 9, wkn: 166075, name: 'Abiszett' },
  { id: 10, wkn: 167399, name: 'ACME Corp.' },
  { id: 11, wkn: 144939, name: 'Acme Corporation' },
  { id: 12, wkn: 163993, name: 'actinium' },
  { id: 13, wkn: 104073, name: 'Active SWE AG' },
  { id: 14, wkn: 146082, name: 'Actuarial Invest' },
  { id: 15, wkn: 166501, name: 'Adun' },
  { id: 16, wkn: 162503, name: 'Adventure Capital ' },
  { id: 17, wkn: 164993, name: 'Aeby&co. AG' },
  { id: 18, wkn: 158564, name: 'Aegge Transport' },
  { id: 19, wkn: 158288, name: 'Aegis Pharm' },
  { id: 20, wkn: 166581, name: 'Aemilian Investment' },
  { id: 21, wkn: 156344, name: 'AfricanFuture' },
  { id: 22, wkn: 115639, name: 'AG plus' },
  { id: 23, wkn: 165957, name: 'Agdestein Imports' },
  { id: 24, wkn: 163043, name: 'Agrar Dienstleister ' },
  { id: 25, wkn: 158850, name: 'AGRAR-TEC' },
  { id: 26, wkn: 123408, name: 'AGSpiel2016' },
  { id: 27, wkn: 147403, name: 'AimEye AG' },
  { id: 28, wkn: 165200, name: 'AINZ' },
  { id: 29, wkn: 160099, name: 'Air Cargo Express' },
  { id: 30, wkn: 167005, name: 'Air Essen' },
  { id: 31, wkn: 123876, name: 'Aircraft Products' },
  { id: 32, wkn: 156104, name: 'AirlineAg' },
  { id: 33, wkn: 166747, name: 'Aktien AG' },
  { id: 34, wkn: 108609, name: 'AktienZOO AG' },
  { id: 35, wkn: 121917, name: 'AL INVESTMENT' },
  { id: 36, wkn: 138621, name: 'Aliproductions' },
  { id: 37, wkn: 163141, name: 'All you want' },
  { id: 38, wkn: 128269, name: 'Allesmacher AG' },
  { id: 39, wkn: 156724, name: 'Allington AG' },
  { id: 40, wkn: 164040, name: 'AllInOne' },
  { id: 41, wkn: 157684, name: 'Alpha Enterprises' },
  { id: 42, wkn: 135417, name: 'Alpha StBGmbH & Co' },
  { id: 43, wkn: 165275, name: 'AlphaCells' },
  { id: 44, wkn: 101224, name: 'AlPharm AG' },
  { id: 45, wkn: 166845, name: 'AlRoDi' },
  { id: 46, wkn: 164480, name: 'Alternativ Trade' },
  { id: 47, wkn: 164496, name: 'Altersarmut Ex&Weg' },
  { id: 48, wkn: 134450, name: 'AltrichterFoundation' },
  { id: 49, wkn: 166485, name: 'America insurance GP' },
  { id: 50, wkn: 125809, name: 'Ames Inc.' },
  { id: 51, wkn: 164028, name: 'Amfetamin MdmA KoKaG' },
  { id: 52, wkn: 166504, name: 'Anacott Steel ' },
  { id: 53, wkn: 159381, name: 'ANCO Systems' },
  { id: 54, wkn: 155162, name: 'Anders AG' },
  { id: 55, wkn: 116709, name: 'Andrea Doria AG' },
  { id: 56, wkn: 149259, name: 'Ang3lArtS' },
  { id: 57, wkn: 162538, name: 'AnglerG' },
  { id: 58, wkn: 166059, name: 'Anhalt-Wald' },
  { id: 59, wkn: 162865, name: 'Animal Unity ' },
  { id: 60, wkn: 165314, name: 'Anime Inc.' },
  { id: 61, wkn: 135047, name: 'AO&N AG' },
  { id: 62, wkn: 166498, name: 'Aperture Financials' },
  { id: 63, wkn: 149462, name: 'Apfelbaum' },
  { id: 64, wkn: 163735, name: 'Applied Ressource AG' },
  { id: 65, wkn: 151304, name: 'Aquila Invest KGaA' },
  { id: 66, wkn: 155885, name: 'AR&ALB Corp.' },
  { id: 67, wkn: 137402, name: 'ArcheoUniversal Bank' },
  { id: 68, wkn: 167436, name: 'ArctixzInno' },
  { id: 69, wkn: 106505, name: 'Argo' },
  { id: 70, wkn: 165833, name: 'Aribabu AG' },
  { id: 71, wkn: 119422, name: 'Arka AG' },
  { id: 72, wkn: 166703, name: 'Arktis AG' },
  { id: 73, wkn: 153618, name: 'AS Software' },
  { id: 74, wkn: 167458, name: 'as1612' },
  { id: 75, wkn: 125319, name: 'Asgard Dynamics' },
  { id: 76, wkn: 106940, name: 'Asia Invest' },
  { id: 77, wkn: 147473, name: 'Astrophysicalscience' },
  { id: 78, wkn: 102716, name: 'Atlantus AG' },
  { id: 79, wkn: 110243, name: 'Aurora Borealis' },
  { id: 80, wkn: 166494, name: 'AuroRa Inc.' },
  { id: 81, wkn: 167372, name: 'Autonomous AG' },
  { id: 82, wkn: 130152, name: 'Avengers Initiative' },
  { id: 83, wkn: 138559, name: 'b l a c k' },
  { id: 84, wkn: 164309, name: 'Baalmann AG' },
  { id: 85, wkn: 116758, name: 'Babylon' },
  { id: 86, wkn: 167360, name: 'Bad Bank AG' },
  { id: 87, wkn: 148602, name: 'Bad Company' },
  { id: 88, wkn: 151666, name: 'BADaBOOM' },
  { id: 89, wkn: 153909, name: 'Bademeister AG' },
  { id: 90, wkn: 167322, name: 'Bafleth' },
  { id: 91, wkn: 149065, name: 'Baker Street 221B' },
  { id: 92, wkn: 152519, name: 'Balkan ' },
  { id: 93, wkn: 167439, name: 'Ballering' },
  { id: 94, wkn: 133548, name: 'Balou Resort ' },
  { id: 95, wkn: 161195, name: 'BananenGrillAG' },
  { id: 96, wkn: 158741, name: 'Band Master Flash ' },
  { id: 97, wkn: 117856, name: 'Bank of Investment' },
  { id: 98, wkn: 114080, name: 'Bankhaus Graf Zahl' },
  { id: 99, wkn: 139690, name: 'Bankhaus Grünschildt' },
  ... 1247 more items ]
```

Ausschnitt aus Indexliste (`retrieve.indizes()`):
```js
[ { id: 792,
    name: 'Extrem Liberaler Index',
    rank: '1',
    member: 15,
    leiter: { id: '14818', name: 'KooL AG' },
    aktivitaet: '63',
    bewerbung: false,
    punkte: 678 },
  { id: 1442,
    name: 'Das Konsortium ',
    rank: '2',
    member: 15,
    leiter: { id: '41672', name: 'Egel' },
    aktivitaet: '53',
    bewerbung: false,
    punkte: 628 },
  { id: 321,
    name: 'O P E C',
    rank: '3',
    member: 15,
    leiter: { id: '8390', name: 'Active SWE AG' },
    aktivitaet: '50',
    bewerbung: false,
    punkte: 608 },
  { id: 1040,
    name: 'Monster Index',
    rank: '4',
    member: 15,
    leiter: { id: '40877', name: 'Monsterhouse' },
    aktivitaet: '49',
    bewerbung: false,
    punkte: 562 },
    [...]]
```

## Zinsfunktionen
Sei _t_ die Laufzeit und _b_ das anzulegende Volumen.
Die Folgende Funktion rechnet den Zins einer gegebenen Anleihen mit gegebenen Volumen und Laufzeit in eine gleichwertige Anleihe mit anderem Volumen und Laufzeit um:
* `number transform(zins, t1, t2, b1, b2)`
```js
// Wenn ich jetzt eine 100.000€ 5-Tages-Anleihe bekommen, wie hoch ist der Zins einer 3.000.000€ 4-Tages-Anleihe jetzt?
const zins = agspiel.zins;
let i = zins.transform(2.17, 5, 4, 100000, 3000000)
console.log(i)
```
* `number zins(z, b, t)` - Interne Funktion
* `number magic(z, b, t)` - Interne Funktion
* `number endwert(z, b, t)` [Klassische Endwertberechnung](https://de.wikipedia.org/wiki/Endwert)

## Live
WIP
## Format
Formatiert oder parsed Zahlen.
```js
const currency = agspiel.format.currency;
console.log(currency(1000000) + '€') // Gibt aus 1.000.000,00€
```

# Examples

Das hier ist ein Beispiel, wie man schnell per API alle NameChanges von Maggie herausfinden kann:

```js
retrieve.profile('Maggie').then(o => retrieve.chronik(o.wkn)).then(o => {
  let ncs = o.namechanges.reverse()
  let s = ncs[0].from
  ncs.forEach(nc => {
    s += '->' + nc.to
  })
  console.log('Maggie hat ' + ncs.length + ' NameChanges gemacht:')
  console.log(s)
})
```
gibt aus
```
Maggie hat 34 NameChanges gemacht:
Waldbahn-Bayern
Frischfleisch AG
DNA Repair AG
Philine Cooperation
DNA Repair AG
Future Genetic AG
Save Bänk
Future Genetic AG
Phil Corporation A6
Future Genetic AG
Nippongink&333
Nipponginko
Gaunerladen AG
Amtsgericht AG
Gaunerladen AG
Gaunerbank
KRANKE KASSE
RED SUN
Black Raven
Childrens Capital
Ravens Kingdom
The Ravens Kingdom
Ravens Kingdom
Maggies Monsterladen
Seishin Investment
Monsters LTD
BIOTEC INC
DOS Games
Temporär
KRANKE KASSE
BKK Together
EGG-KEA
Das EI 156
Vogelkraftfutter
Zahnfeebedarfladen
```

___
Folgendes Programm bereinigt den Buchwert um alle Kapitalmaßnahmen und das Startguthaben:
```js
retrieve.profile('Nordlicht').then(p => {
  retrieve.chronik(p.wkn).then(c => {
    let bw = p.buchwert()
    let khvol = c.khs.map(o => o.volumen)
    khvol = khvol.length === 0 ? 0 : khvol.reduce((a, b) => a+b);
    let kevol = c.kes.map(o => o.volumen);
    kevol = kevol.length === 0 ? 0 : kevol.reduce((a, b) => a+b);

    let erwirtschaftet = bw - kevol + khvol - 1000000;
    let prozent = erwirtschaftet / bw;
    erwirtschaftet = agspiel.format.currency(erwirtschaftet)
    bw = agspiel.format.currency(bw)
    console.log(p.ceo + ' (' + p.name + ' / #' + p.wkn + ') hat von seinen ' + bw + '€ ' + erwirtschaftet + '€ ('+agspiel.format.currency(prozent*100)+'%) selber erwirtschaftet.')
  })
});
```
gibt aus
```Nordlicht hat von seinen 289.560.000,00€ 168.560.000,00€ selber erwirtschaftet.```

Achtung: Dieses Programm berücksichtigt keine indirekten KHs (KHs über Übernahmen) und auch nicht die Zeitpunkte der KMs.
___
Folgendes Programm ermittelt den Buchwert eines Indexes:
```js
const agspiel = require('agspiel').auth('phpsessid-cookie', 'agspiel-cookie');
const retrieve = agspiel.retrieve;
const EventEmitter = require('events');
const currency = agspiel.format.currency;

let indexId = 1889;
let delay = 5000; // 5s zwischen jeder Abfrage

let indexName;
let ee = new EventEmitter();
let bw = 0;
let wkns;

function work() {
  if (wkns.length === 0) {
    ee.emit('end');
    return;
  }
  retrieve.profile(wkns.pop()).then(p => {
    console.log(p.ceo + ' (' + p.name + ' / ' + p.wkn + ') hat einen Buchwert von ' + currency(p.buchwert()) + '€');
    bw += p.buchwert();
  });
}

let interval;
retrieve.index(indexId).then(i => {
  wkns = i.mitglieder.map(m => m.wkn);
  indexName = i.name;
  interval = setInterval(work, delay);
});

ee.on('end', () => {
  clearInterval(interval);
  console.log(indexName + ' hat einen Gesamtbuchwert von ' + currency(bw) + '€');
});

```
Output:
```
David5702 (Geldpresse AG / 166664) hat einen Buchwert von 1.399.900,00€
xonxun (Bonsai Baum AG / 166936) hat einen Buchwert von 1.854.500,00€
Hummel (Blue-Investment / 154295) hat einen Buchwert von 62.163.386,89€
Timmy1800 (Logistik Elektroniks / 151282) hat einen Buchwert von 17.216.300,00€
Sparschwein (Der Bestatter / 165530) hat einen Buchwert von 1.462.800,00€
Knox1312 (Underground AG / 160450) hat einen Buchwert von 189.582.000,00€
Kalle03 (Monster Eis AG / 164184) hat einen Buchwert von 7.852.000,00€
Nordlicht (Bearish Holding AG / 155401) hat einen Buchwert von 311.840.000,00€
DeMarco24 (Big Stone Investment / 153540) hat einen Buchwert von 15.662.745,00€
LuxXx (Black Scholes Group / 166541) hat einen Buchwert von 2.055.000,00€
Luchs (Lynx / 159463) hat einen Buchwert von 12.218.500,00€
JohnArnold (Ishare / 161781) hat einen Buchwert von 121.408.000,00€
Raphu (Waldhof Löwe / 164915) hat einen Buchwert von 3.700.000,00€
TDaench (Monsterbier Ag / 158569) hat einen Buchwert von 8.854.500,00€
Gewinner (Solarpark AG / 164021) hat einen Buchwert von 10.071.800,00€
T.G.I.F. hat einen Gesamtbuchwert von 767.341.431,89€
```
