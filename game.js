const langkahBenar = [
    { id: "prepare", text: "Siapkan cangkir dan teh celup." },
    { id: "boil", text: "Didihkan air." },
    { id: "pour", text: "Tuangkan air panas ke dalam cangkir." },
    { id: "steep", text: "Diamkan teh selama 3–5 menit." },
    { id: "season", text: "Tambahkan gula atau susu sesuai selera." },
    { id: "serve", text: "Aduk teh, lalu sajikan." }
];

const stepsList = document.getElementById("stepsList");
const feedback = document.getElementById("feedback");
const stepCount = document.getElementById("stepCount");
const checkButton = document.getElementById("checkButton");
const resetButton = document.getElementById("resetButton");

let langkahSaatIni = acakLangkah();
let sudahDiperiksa = false;

function acakLangkah() {
    const hasil = [...langkahBenar];

    for (let index = hasil.length - 1; index > 0; index--) {
        const tujuan = Math.floor(Math.random() * (index + 1));
        [hasil[index], hasil[tujuan]] = [hasil[tujuan], hasil[index]];
    }

    if (hasil.every((langkah, index) => langkah.id === langkahBenar[index].id)) {
        [hasil[0], hasil[1]] = [hasil[1], hasil[0]];
    }

    return hasil;
}

function tampilkanLangkah() {
    stepsList.replaceChildren();

    langkahSaatIni.forEach((langkah, index) => {
        const item = document.createElement("li");
        item.className = "step-item";

        if (sudahDiperiksa) {
            const benar = langkah.id === langkahBenar[index].id;
            item.classList.add(benar ? "is-correct" : "is-wrong");
        }

        const nomor = document.createElement("span");
        nomor.className = "step-number";
        nomor.textContent = String(index + 1);

        const teks = document.createElement("span");
        teks.className = "step-text";
        teks.textContent = langkah.text;

        const controls = document.createElement("span");
        controls.className = "move-controls";

        const upButton = buatTombolPindah("Naikkan langkah", index, -1);
        upButton.disabled = index === 0;

        const downButton = buatTombolPindah("Turunkan langkah", index, 1);
        downButton.disabled = index === langkahSaatIni.length - 1;

        controls.append(upButton, downButton);
        item.append(nomor, teks, controls);
        stepsList.append(item);
    });
}

function buatTombolPindah(label, index, arah) {
    const button = document.createElement("button");
    button.className = "move-button";
    button.type = "button";
    button.textContent = arah < 0 ? "↑" : "↓";
    button.setAttribute("aria-label", `${label}: ${langkahSaatIni[index].text}`);
    button.addEventListener("click", () => pindahkanLangkah(index, arah));
    return button;
}

function pindahkanLangkah(index, arah) {
    const tujuan = index + arah;

    if (tujuan < 0 || tujuan >= langkahSaatIni.length) {
        return;
    }

    [langkahSaatIni[index], langkahSaatIni[tujuan]] = [
        langkahSaatIni[tujuan],
        langkahSaatIni[index]
    ];
    sudahDiperiksa = false;
    stepCount.textContent = `${langkahBenar.length} langkah`;
    tampilkanLangkah();
    aturFeedback("Pindahkan langkah dengan tombol panah.");
}

function periksaUrutan() {
    const jumlahBenar = langkahSaatIni.reduce((jumlah, langkah, index) => {
        return jumlah + Number(langkah.id === langkahBenar[index].id);
    }, 0);

    sudahDiperiksa = true;
    tampilkanLangkah();
    stepCount.textContent = `${jumlahBenar} dari ${langkahBenar.length} tepat`;

    if (jumlahBenar === langkahBenar.length) {
        aturFeedback("Sempurna! Teh siap dinikmati. ☕", "success");
    } else {
        aturFeedback(`${jumlahBenar} langkah sudah tepat. Coba susun lagi!`, "error");
    }
}

function mulaiUlang() {
    langkahSaatIni = acakLangkah();
    sudahDiperiksa = false;
    stepCount.textContent = `${langkahBenar.length} langkah`;
    aturFeedback("Pindahkan langkah dengan tombol panah.");
    tampilkanLangkah();
}

function aturFeedback(pesan, status = "") {
    feedback.textContent = pesan;
    feedback.dataset.state = status;
}

checkButton.addEventListener("click", periksaUrutan);
resetButton.addEventListener("click", mulaiUlang);

tampilkanLangkah();