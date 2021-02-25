const requestURL =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";
fetch(requestURL)
  .then((response) => response.json())
  .then((data) => {
    popularEventos(data);
    popularCorrelaciones(data);
  });
let eventosConcat = [];
var dict = [];

function popularEventos(datos) {
  for (let index = 0; index < datos.length; index++) {
    squirrel = datos[index].squirrel;
    eventos = datos[index].events;
    string = "";
    for (let j = 0; j < eventos.length; j++) {
      if (j == eventos.length - 1) {
        string += eventos[j];
      } else {
        string += eventos[j] + ",";
      }
    }
    eventosConcat.push(string);
    const table = document.getElementById("cuerpoTabla");
    const myH2 = document.createElement("tr");
    const number = document.createElement("th");
    const eve = document.createElement("td");
    const squir = document.createElement("td");
    number.textContent = index + 1;
    eve.textContent = string;
    squir.textContent = squirrel;
    if (squirrel) {
      myH2.style.backgroundColor = "LightPink";
    }
    myH2.appendChild(number);
    myH2.appendChild(eve);
    myH2.appendChild(squir);
    table.appendChild(myH2);
  }
}

function popularCorrelaciones(datos) {
  let evento = [];
  for (let index = 0; index < datos.length; index++) {
    squirrel = datos[index].squirrel;
    eventos = datos[index].events;
    string = "";
    for (let j = 0; j < eventos.length; j++) {
      evento.push(eventos[j]);
    }
  }
  uniqueArray = evento.filter(function (item, pos) {
    return evento.indexOf(item) == pos;
  });

  for (let index = 0; index < uniqueArray.length; index++) {
    TP = verdaderosPositivos(datos, uniqueArray[index]);
    FP = falsosPositivos(datos, uniqueArray[index]);
    TN = verdaderosNegativos(datos, uniqueArray[index]);
    FN = falsosNegativos(datos, uniqueArray[index]);
    valor = mcc(TP, TN, FP, FN);
    dict.push({
      key: uniqueArray[index],
      value: valor,
    });
  }

  dict.sort(function (a, b) {
    return b.value - a.value;
  });

  for (let index = 0; index < uniqueArray.length; index++) {
    const table = document.getElementById("cuerpoTabla2");
    const myH2 = document.createElement("tr");
    const number = document.createElement("th");
    const eve = document.createElement("td");
    const numero = document.createElement("td");
    number.textContent = index + 1;
    eve.textContent = dict[index].key;
    numero.textContent = dict[index].value;

    myH2.appendChild(number);
    myH2.appendChild(eve);
    myH2.appendChild(numero);
    table.appendChild(myH2);
  }
}

function falsosPositivos(data, event) {
  let contador = 0;
  for (let index = 0; index < data.length; index++) {
    squirrel = data[index].squirrel;
    eventos = eventosConcat[index];
    if (!eventos.includes(event) && squirrel) {
      contador++;
    }
  }
  return contador;
}

function falsosNegativos(data, event) {
  let contador = 0;
  for (let index = 0; index < data.length; index++) {
    squirrel = data[index].squirrel;
    eventos = eventosConcat[index];
    if (eventos.includes(event) && !squirrel) {
      contador++;
    }
  }
  return contador;
}

function verdaderosPositivos(data, event) {
  let contador = 0;
  for (let index = 0; index < data.length; index++) {
    squirrel = data[index].squirrel;
    eventos = eventosConcat[index];

    if (eventos.includes(event) && squirrel) {
      contador++;
    }
  }
  return contador;
}

function verdaderosNegativos(data, event) {
  let contador = 0;
  for (let index = 0; index < data.length; index++) {
    squirrel = data[index].squirrel;
    eventos = eventosConcat[index];
    if (!eventos.includes(event) && !squirrel) {
      contador++;
    }
  }
  return contador;
}

function mcc(TP, TN, FP, FN) {
  numerador = TP * TN - FP * FN;
  denominador = (TP + FP) * (TP + FN) * (TN + FP) * (TN + FN);
  denominadorFinal = Math.sqrt(denominador);
  division = numerador / denominadorFinal;

  return division;
}
