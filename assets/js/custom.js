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


/* =====================================================
   12 LD: kompetencijų pažangos modulis
   ===================================================== */

// 1a–c. Įgūdžių masyvas (pradinės būsenos)
const pradiniaiIgudziai = [
  { pavadinimas: 'FPGA programavimas',   busena: 'Planuojama', xp: 80, ikona: 'bi-motherboard' },
  { pavadinimas: 'RF grandinės',         busena: 'Planuojama', xp: 60, ikona: 'bi-broadcast' },
  { pavadinimas: 'STM32 programavimas',  busena: 'Mokomasi',   xp: 50, ikona: 'bi-cpu' },
  { pavadinimas: 'Signalų apdorojimas',  busena: 'Mokomasi',   xp: 40, ikona: 'bi-soundwave' },
  { pavadinimas: 'KiCad projektavimas',  busena: 'Atlikta',    xp: 60, ikona: 'bi-diagram-3' },
  { pavadinimas: 'LTspice modeliavimas', busena: 'Atlikta',    xp: 50, ikona: 'bi-activity' },
  { pavadinimas: 'Litavimas',            busena: 'Atlikta',    xp: 40, ikona: 'bi-tools' },
  { pavadinimas: 'MATLAB',               busena: 'Atlikta',    xp: 30, ikona: 'bi-graph-up' }
];

const busenos = ['Planuojama', 'Mokomasi', 'Atlikta'];

// Lygių ir rangų lentelė
const lygiai = [
  { lygis: 1, nuo: 0,   iki: 50,   rangas: 'Pradedantysis' },
  { lygis: 2, nuo: 50,  iki: 150,  rangas: 'Praktikantas' },
  { lygis: 3, nuo: 150, iki: 300,  rangas: 'Specialistas' },
  { lygis: 4, nuo: 300, iki: null, rangas: 'Profesionalas' }
];

const SAUGYKLOS_RAKTAS = 'igudziuBusenos';

// Darbinis masyvas – pradinių įgūdžių kopija
let igudziai = pradiniaiIgudziai.map(function (igudis) {
  return Object.assign({}, igudis);
});

/* ---------- Papildoma: Local Storage ---------- */

// a. Įgūdžių būsenų išsaugojimas
function issaugotiBusenas() {
  const busenuObjektas = {};
  igudziai.forEach(function (igudis) {
    busenuObjektas[igudis.pavadinimas] = igudis.busena;
  });
  try {
    localStorage.setItem(SAUGYKLOS_RAKTAS, JSON.stringify(busenuObjektas));
  } catch (klaida) {
    console.log('Nepavyko išsaugoti būsenų', klaida);
  }
}

// b–c. Būsenų atkūrimas (jei nėra – lieka pradinės būsenos)
function atkurtiBusenas() {
  let issaugota = null;
  try {
    issaugota = JSON.parse(localStorage.getItem(SAUGYKLOS_RAKTAS));
  } catch (klaida) {
    issaugota = null;
  }
  if (!issaugota) {
    return;
  }
  igudziai.forEach(function (igudis) {
    if (busenos.includes(issaugota[igudis.pavadinimas])) {
      igudis.busena = issaugota[igudis.pavadinimas];
    }
  });
}

/* ---------- 1. Kortelių atvaizdavimas ---------- */
function atvaizduotiKorteles() {
  // Išvalomi visi stulpeliai
  busenos.forEach(function (busena) {
    document.getElementById('korteles-' + busena.toLowerCase()).innerHTML = '';
  });

  igudziai.forEach(function (igudis, indeksas) {
    const kortele = document.createElement('div');
    kortele.className = 'kortele';

    // Būsenos pasirinkimo sąrašas
    let pasirinkimai = '';
    busenos.forEach(function (busena) {
      const pazymeta = busena === igudis.busena ? ' selected' : '';
      pasirinkimai += '<option value="' + busena + '"' + pazymeta + '>' + busena + '</option>';
    });

    kortele.innerHTML =
      '<i class="bi ' + igudis.ikona + ' kortele-ikona"></i>' +
      '<div class="kortele-tekstas">' +
        '<h4>' + igudis.pavadinimas + '</h4>' +
        '<select class="busena-pasirinkimas" aria-label="Būsena">' + pasirinkimai + '</select>' +
      '</div>' +
      '<span class="xp">XP: ' + igudis.xp + '</span>';

    // 2. Pakeitus būseną – kortelė perkeliama ir viskas perskaičiuojama
    kortele.querySelector('select').addEventListener('change', function (ivykis) {
      pakeistiBusena(indeksas, ivykis.target.value);
    });

    document.getElementById('korteles-' + igudis.busena.toLowerCase()).appendChild(kortele);
  });
}

/* ---------- 2. Būsenos keitimas ---------- */
function pakeistiBusena(indeksas, naujaBusena) {
  igudziai[indeksas].busena = naujaBusena;
  issaugotiBusenas();
  atnaujintiModuli();
}

/* ---------- 3. XP, lygis ir rangas ---------- */
function skaiciuotiXP() {
  // Sumuojami tik „Atlikta“ būsenos įgūdžių XP
  return igudziai
    .filter(function (igudis) { return igudis.busena === 'Atlikta'; })
    .reduce(function (suma, igudis) { return suma + igudis.xp; }, 0);
}

function rastiLygi(xp) {
  for (let i = lygiai.length - 1; i >= 0; i--) {
    if (xp >= lygiai[i].nuo) {
      return lygiai[i];
    }
  }
  return lygiai[0];
}

/* ---------- 4. Progreso juosta ---------- */
function atnaujintiProgresa(xp, lygis) {
  let procentas;
  if (lygis.iki === null) {
    procentas = 100;   // 4 lygis – maksimalus progresas
  } else {
    procentas = Math.round((xp - lygis.nuo) / (lygis.iki - lygis.nuo) * 100);
  }
  const juosta = document.getElementById('xp-progresas');
  juosta.style.width = procentas + '%';
  juosta.textContent = procentas + '%';
}

/* ---------- 5. Statistika ---------- */
function atnaujintiStatistika() {
  const viso = igudziai.length;
  const atlikta = igudziai.filter(function (igudis) {
    return igudis.busena === 'Atlikta';
  }).length;
  const procentas = viso === 0 ? 0 : Math.round(atlikta / viso * 100);

  document.getElementById('igudziu-skaicius').textContent = viso;
  document.getElementById('atlikta-skaicius').textContent = atlikta;
  document.getElementById('atlikta-procentas').textContent = procentas + '%';
}

/* ---------- 7. Viso modulio atnaujinimas ---------- */
function atnaujintiModuli() {
  const xp = skaiciuotiXP();
  const lygis = rastiLygi(xp);

  atvaizduotiKorteles();
  document.getElementById('bendras-xp').textContent = xp + ' XP';
  document.getElementById('lygis').textContent = lygis.lygis;
  document.getElementById('rangas').textContent = lygis.rangas;
  atnaujintiProgresa(xp, lygis);
  atnaujintiStatistika();
}

// Paleidimas įkėlus puslapį
document.addEventListener('DOMContentLoaded', function () {
  atkurtiBusenas();
  atnaujintiModuli();
});
