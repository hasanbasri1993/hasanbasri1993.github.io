document.addEventListener("DOMContentLoaded", function () {
    let element = document.querySelectorAll(".sidenav");
    M.Sidenav.init(element);
    loadNav();

    function loadNav() {
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.innerHTML = req.responseText;
                });

                document
                    .querySelectorAll(".sidenav a, .topnav a")
                    .forEach(function (elm) {
                        elm.addEventListener("click", function (event) {
                            // Tutup sidenav
                            let sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            // Muat konten halaman yang dipanggil
                            page = event.target.getAttribute("href").substr(1);
                            loadPage(page);
                        });
                    });
            }
        };
        req.open("GET", "nav.html", true);
        req.send();
    }

    // Load page content
    let page = window.location.hash.substr(1);

    function loadPage(page) {
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                let content = document.querySelector("#body-content");

                if (page === "home") {
                    getFootballData();
                } else if (page === "saved") {
                    getSavedFootlballClubData();
                }

                if (this.status === 200) {
                    content.innerHTML = req.responseText;
                } else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        req.open("GET", `pages/${page}.html`, true);
        req.send();
    }
});
