/* =====================================================
   custom.js – 11 LD: kontaktų forma
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const forma = document.getElementById('kontaktu-forma');
  const siustiMygtukas = document.getElementById('siusti');
  const isvalytiMygtukas = document.getElementById('isvalyti');
  const rezultatai = document.getElementById('formos-rezultatai');

  const laukai = {
    vardas: document.getElementById('vardas'),
    pavarde: document.getElementById('pavarde'),
    elPastas: document.getElementById('el-pastas'),
    telefonas: document.getElementById('telefonas'),
    adresas: document.getElementById('adresas'),
    klausimas1: document.getElementById('klausimas1'),
    klausimas2: document.getElementById('klausimas2'),
    klausimas3: document.getElementById('klausimas3')
  };

  /* ---------- Papildoma 1. Validacijos taisyklės ---------- */

  // Grąžina klaidos tekstą arba tuščią eilutę, jei klaidų nėra
  function tikrintiLauka(pavadinimas) {
    const reiksme = laukai[pavadinimas].value.trim();

    // a. Privalomas laukas negali būti tuščias
    if (reiksme === '') {
      return 'Šis laukas privalomas.';
    }

    // c. Vardas ir pavardė – tik raidės
    if (pavadinimas === 'vardas' || pavadinimas === 'pavarde') {
      if (!/^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/.test(reiksme)) {
        return 'Galima naudoti tik raides.';
      }
    }

    // b. El. pašto formatas
    if (pavadinimas === 'elPastas') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reiksme)) {
        return 'Neteisingas el. pašto formatas.';
      }
    }

    // Telefono numeris – formatas +370 6xx xxxxx
    if (pavadinimas === 'telefonas') {
      if (!/^\+370 6\d{2} \d{5}$/.test(reiksme)) {
        return 'Numeris turi būti formatu +370 6xx xxxxx.';
      }
    }

    // d. Vertinimai nuo 1 iki 10
    if (pavadinimas.startsWith('klausimas')) {
      const skaicius = Number(reiksme);
      if (!Number.isInteger(skaicius) || skaicius < 1 || skaicius > 10) {
        return 'Įveskite sveiką skaičių nuo 1 iki 10.';
      }
    }

    return '';
  }

  // f. Parodo arba paslepia klaidos pranešimą po lauku
  function rodytiKlaida(pavadinimas) {
    const laukas = laukai[pavadinimas];
    const klaida = tikrintiLauka(pavadinimas);
    laukas.nextElementSibling.textContent = klaida;
    laukas.classList.toggle('klaida', klaida !== '');
  }

  // 6 ir e. „Siųsti“ aktyvus tik kai visi laukai užpildyti ir be klaidų
  function atnaujintiMygtuka() {
    let viskasGerai = true;
    for (const pavadinimas in laukai) {
      if (tikrintiLauka(pavadinimas) !== '') {
        viskasGerai = false;
      }
    }
    siustiMygtukas.disabled = !viskasGerai;
  }

  /* ---------- Papildoma 2. Telefono formatavimas ---------- */
  function formatuotiTelefona() {
    let reiksme = laukai.telefonas.value;

    // Nuimame jau pridėtą „+370“ pradžią
    if (reiksme.startsWith('+370')) {
      reiksme = reiksme.slice(4);
    }

    // Paliekami tik skaitmenys
    let skaitmenys = reiksme.replace(/\D/g, '');

    // Apribojame ilgį – 8 skaitmenys po +370
    skaitmenys = skaitmenys.slice(0, 8);

    // Sudedame formatą +370 6xx xxxxx
    let rezultatas = '';
    if (skaitmenys.length > 0) {
      rezultatas = '+370 ' + skaitmenys.slice(0, 3);
    }
    if (skaitmenys.length > 3) {
      rezultatas += ' ' + skaitmenys.slice(3);
    }
    laukai.telefonas.value = rezultatas;
  }

  // Validacija realiu laiku – kiekvieno lauko įvesties metu
  for (const pavadinimas in laukai) {
    laukai[pavadinimas].addEventListener('input', function () {
      if (pavadinimas === 'telefonas') {
        formatuotiTelefona();
      }
      rodytiKlaida(pavadinimas);
      atnaujintiMygtuka();
    });
  }

  /* ---------- 4–5. Formos pateikimas ---------- */
  forma.addEventListener('submit', function (ivykis) {
    // a. Sustabdomas puslapio perkrovimas
    ivykis.preventDefault();

    // b. Visos reikšmės surenkamos į objektą
    const duomenys = {
      vardas: laukai.vardas.value.trim(),
      pavarde: laukai.pavarde.value.trim(),
      elPastas: laukai.elPastas.value.trim(),
      telefonas: laukai.telefonas.value.trim(),
      adresas: laukai.adresas.value.trim(),
      klausimas1: Number(laukai.klausimas1.value),
      klausimas2: Number(laukai.klausimas2.value),
      klausimas3: Number(laukai.klausimas3.value)
    };

    // c. Objektas išvedamas į konsolę
    console.log(duomenys);

    // 5. Trijų klausimų vidurkis
    const vidurkis = (duomenys.klausimas1 + duomenys.klausimas2 + duomenys.klausimas3) / 3;

    // d. Duomenys parodomi po forma
    const eilutes = [
      'Vardas: ' + duomenys.vardas,
      'Pavardė: ' + duomenys.pavarde,
      'El. paštas: ' + duomenys.elPastas,
      'Tel. numeris: ' + duomenys.telefonas,
      'Adresas: ' + duomenys.adresas,
      '1 klausimas: ' + duomenys.klausimas1,
      '2 klausimas: ' + duomenys.klausimas2,
      '3 klausimas: ' + duomenys.klausimas3,
      duomenys.vardas + ' ' + duomenys.pavarde + ': ' + vidurkis.toFixed(1)
    ];

    rezultatai.innerHTML = '';
    eilutes.forEach(function (tekstas, i) {
      const p = document.createElement('p');
      p.textContent = tekstas;
      if (i === eilutes.length - 1) {
        p.className = 'vidurkis';
      }
      rezultatai.appendChild(p);
    });
  });

  /* ---------- Papildoma 3. Mygtukas „Išvalyti“ ---------- */
  isvalytiMygtukas.addEventListener('click', function () {
    forma.reset();                       // išvalomi laukai
    rezultatai.innerHTML = '';           // išvalomi duomenys ir vidurkis
    for (const pavadinimas in laukai) {  // išvalomi klaidų pranešimai
      laukai[pavadinimas].classList.remove('klaida');
      laukai[pavadinimas].nextElementSibling.textContent = '';
    }
    siustiMygtukas.disabled = true;      // pradinė būsena
  });

});
