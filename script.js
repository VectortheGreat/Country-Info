document.querySelector("#btnSearch").addEventListener("click", buttonClick);

document
  .querySelector("#txtSearch")
  .addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      document.getElementById("btnSearch").click();
    }
  });

function buttonClick(event) {
  let text = document.querySelector("#txtSearch").value;
  getCountry(text);
  document.querySelector("#hid").classList.remove("collapse");
  event.preventDefault();
}

function getCountry(country) {
  const request = new XMLHttpRequest();

  request.open("GET", "https://restcountries.com/v3.1/name/" + country);
  request.send();

  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data[0]);

    const countries = data[0].borders.toString();

    // load neighbors
    const req = new XMLHttpRequest();
    req.open("GET", "https://restcountries.com/v3.1/alpha?codes=" + countries);
    req.send();

    req.addEventListener("load", function () {
      const data = JSON.parse(this.responseText);
      renderNeighbors(data);
    });
  });
}

function renderCountry(data) {
  let countrysflag = data.flags.svg;
  console.log(countrysflag);
  document.getElementById(
    "background"
  ).style.backgroundImage = `url(${countrysflag})`;

  let html = `
            <div class="card-header">
                    Search Result
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-4">
                            <img src="${
                              data.flags.png
                            }" alt="" class="img-fluid">
                        </div>
                        <div class="col-8">
                            <h3 class="card-title">${
                              data.name.common
                            }     <img style="width: 70px; height: 50px;" src="${
    data.coatOfArms.png
  }" alt="" class="img-fluid"> </h3>
                            <hr>
                            <div class="row">
                                <div class="col-4">Population: </div>
                                <div class="col-8">${(
                                  data.population / 1000000
                                ).toFixed(1)} Million</div>
                            </div>
                            <div class="row">
                                <div class="col-4">Offical Language: </div>
                                <div class="col-8">${Object.values(
                                  data.languages
                                )}</div>
                            </div>
                            <div class="row">
                                <div class="col-4">Capital City: </div>
                                <div class="col-8">${data.capital[0]}</div>
                            </div>
                            <div class="row">
                                <div class="col-4">Currency: </div>
                                <div class="col-8">${
                                  Object.values(data.currencies)[0].name
                                } (${
    Object.values(data.currencies)[0].symbol
  })</div>
                            </div>
                            <div class="row">
                                <div class="col-4">Continents: </div>
                                <div class="col-8">${data.continents[0]}</div>
                            </div>
                        </div>
                    </div>
                </div>
        `;

  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbors(data) {
  console.log(data);
  let html = "";
  for (let country of data) {
    html += `
                <div class="col-2 mt-2">
                    <div class="card">
                        <img src="${country.flags.png}" class="card-img-top">
                        <div class="card-body">
                            <a class="card-title" onClick="newCountry(event)">${country.name.common}</a>
                        </div>
                    </div>
                </div>
            `;
  }
  document.querySelector("#neighbors").innerHTML = html;
}
function newCountry(event) {
  let selected_country = event.target;
  getCountry(selected_country.innerText);
}

function backgroundChange(selectedCountryFlag) {
  selectedCountryFlag = countrysflag;
  document.getElementById("background").style.color = "blue";
}
