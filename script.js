// Scroll Smart - logica mini-quizului
const intrebari = [
    {
        intrebare: "Care dintre următoarele obiceiuri ajută la protejarea atenției și concentrării elevilor de gimnaziu?",
        raspunsuri: [
            "Să urmărești videoclipuri scurte timp de mai multe ore.",
            "Să iei pauze de la telefon și să limitezi timpul petrecut pe rețelele sociale.",
            "Să verifici telefonul la fiecare notificare."
        ],
        corect: 1
    }
];

let indexCurent = 0;
let scor = 0;
let raspunsDat = false;

const zonaIntrebare = document.getElementById("intrebare");
const zonaRaspunsuri = document.getElementById("raspunsuri");
const zonaMesaj = document.getElementById("mesaj");
const zonaScor = document.getElementById("scor");
const zonaProgres = document.getElementById("progres");
const butonUrmator = document.getElementById("urmator");
const zonaRezultat = document.getElementById("rezultat");
const butonReia = document.getElementById("reia");

function afiseazaIntrebare() {
    const item = intrebari[indexCurent];
    raspunsDat = false;
    zonaIntrebare.textContent = item.intrebare;
    zonaRaspunsuri.innerHTML = "";
    zonaMesaj.textContent = "";
    zonaMesaj.className = "message";
    butonUrmator.hidden = true;
    zonaRezultat.hidden = true;
    zonaProgres.textContent = `Întrebarea ${indexCurent + 1} din ${intrebari.length}`;

    item.raspunsuri.forEach((textRaspuns, index) => {
        const buton = document.createElement("button");
        buton.type = "button";
        buton.className = "answer";
        buton.textContent = textRaspuns;
        buton.addEventListener("click", () => verifica(index, buton));
        zonaRaspunsuri.appendChild(buton);
    });
}

function verifica(alegere, butonAles) {
    if (raspunsDat) return;
    raspunsDat = true;

    const item = intrebari[indexCurent];
    const butoane = zonaRaspunsuri.querySelectorAll("button");
    butoane.forEach((buton, index) => {
        buton.disabled = true;
        if (index === item.corect) buton.classList.add("correct");
    });

    if (alegere === item.corect) {
        scor += 10;
        zonaMesaj.textContent = "Corect! Ai răspuns bine și ai primit 10 puncte.";
        zonaMesaj.classList.add("good");
    } else {
        butonAles.classList.add("wrong");
        zonaMesaj.textContent = `Nu chiar. Răspunsul corect este: ${item.raspunsuri[item.corect]}`;
        zonaMesaj.classList.add("bad");
    }

    zonaScor.textContent = scor;
    butonUrmator.hidden = false;
}

function afiseazaRezultat() {
    zonaIntrebare.hidden = true;
    zonaRaspunsuri.hidden = true;
    zonaMesaj.hidden = true;
    butonUrmator.hidden = true;
    zonaProgres.textContent = "Quiz încheiat";
    zonaRezultat.hidden = false;
    zonaRezultat.textContent = `Ai obținut ${scor} din ${intrebari.length * 10} puncte. Felicitări pentru participare!`;
    butonReia.hidden = false;
}

butonUrmator.addEventListener("click", afiseazaRezultat);

butonReia.addEventListener("click", () => {
    indexCurent = 0;
    scor = 0;
    zonaScor.textContent = scor;
    zonaIntrebare.hidden = false;
    zonaRaspunsuri.hidden = false;
    zonaMesaj.hidden = false;
    butonReia.hidden = true;
    afiseazaIntrebare();
});

afiseazaIntrebare();
