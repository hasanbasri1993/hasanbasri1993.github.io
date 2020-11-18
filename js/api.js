const urlClubs = 'https://api.football-data.org/v2/competitions/2021/standings';
const urlInfoClubs = 'https://api.football-data.org/v2/teams/';
const apiKey = '7b5de7c409df40dbaee9a1e1690ada12';
const loading = '<div class="child-loading"><div class="preloader-wrapper big active">\n' +
    '    <div class="spinner-layer spinner-green-only">\n' +
    '      <div class="circle-clipper left">\n' +
    '        <div class="circle"></div>\n' +
    '      </div><div class="gap-patch">\n' +
    '        <div class="circle"></div>\n' +
    '      </div><div class="circle-clipper right">\n' +
    '        <div class="circle"></div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div></div>';

const fetchApi = function (url) {
    return fetch(url, {
        headers: {
            'X-Auth-Token': apiKey
        }
    });
};

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getFootballData() {
    document.getElementById("body-content").innerHTML = loading;
    if ("caches" in window) {
        caches.match(urlClubs, {
            method: 'GET',
            headers: {
                'X-Auth-Token': apiKey
            }
        })
            .then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let club_footballHTML = "";
                        let dataClubs = data.standings[0].table;
                        dataClubs.forEach(function (club_data) {
                            club_footballHTML += `
                  <div class="card">
                  <a href="./football-club.html?id=${club_data.team.id}">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${club_data.team.crestUrl}" alt="${club_data.team.name}" width="100" height="100"/>
                    </div>
                  </a>
                  <div class="card-content">
                    <span class="card-title truncate">${club_data.team.name}</span>
                    <p>Positons : ${club_data.position}</p>
                    <p>Points : ${club_data.points}</p>
                  </div>
                </div>
                `;
                        });
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("body-content").innerHTML = club_footballHTML;
                    });
                }
            });
    }
    fetchApi(urlClubs)
        .then(status)
        .then(json)
        .then(function (data) {
            let club_footballHTML = "";
            let dataClubs = data.standings[0].table;
            dataClubs.forEach(function (club_data) {
                club_footballHTML += `
              <div class="card">
                <a href="./football-club.html?id=${club_data.team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                  <img src="${club_data.team.crestUrl}" alt="${club_data.team.name}" width="100" height="100"/>
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${club_data.team.name}</span>
                  <p>Positons : ${club_data.position}</p>
                  <p>Points : ${club_data.points}</p>
                </div>
              </div>
            `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = club_footballHTML;
        })
        .catch(error);
}

function getFootballDataById() {
    return new Promise(function (resolve, reject) {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(urlInfoClubs + idParam,
                {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': apiKey
                    }
                }).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let club_dataHTML = '';
                        club_dataHTML += `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" alt="${data.name}" width="100" height="100"/>
              </div>
              <div class="card-content">
                <span class="card-title">${data.name}</span>
                ${data.address}
              </div>
            </div>
          `;
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("club_football").innerHTML += club_dataHTML;
                        resolve(data);
                    });
                }
            });
        }
            fetchApi(urlInfoClubs + idParam)
                .then(status)
                .then(json)
                .then(function (data) {
                    let club_dataHTML = '';
                    // Menyusun komponen card Club Football secara dinamis
                    club_dataHTML += `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="${data.name}" width="100" height="100"/>
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              ${snarkdown(data.address)}
            </div>
          </div>
        `;
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("club_football").innerHTML += club_dataHTML;
                    resolve(data);
                });

    });
}

function getSavedFootlballClubData() {
    getAll().then(function (club_football) {
        let club_footballHTML = '';
        club_football.forEach(function (club_data) {
            club_footballHTML += `
                  <div class="card">
                    <a href="./football-club.html?id=${club_data.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img alt="${club_data.name}" src="${club_data.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${club_data.name}</span>
                      <p>${club_data.website}</p>
                    </div>
                  </div>
                `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML += club_footballHTML;
    });
}

function getSavedFootballDataById() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = Number(urlParams.get("id"));
    if (idParam !== undefined) {
        getById(idParam).then(function (club_data) {
            let clubHTML = '';
            clubHTML += `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img alt="${club_data.name}" src="${club_data.crestUrl}" />
      </div>
      <div class="card-content">
        <span class="card-title">${club_data.name}</span>
        ${club_data.website}
        <p>${club_data.address}</p>
      </div>
    </div>
  `;
            document.getElementById("club_football").innerHTML += clubHTML;
        });
    }

}
