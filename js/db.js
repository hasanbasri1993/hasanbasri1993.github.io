let dbPromised = idb.open("club_football_reader", 1, function (upgradeDb) {
    let club_footballObjectStore = upgradeDb.createObjectStore("club_football", {
        keyPath: "id"
    });
    club_footballObjectStore.createIndex("team_name", "name", {unique: false});
});

function saveForLater(club_data) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("club_football", "readwrite");
            let store = tx.objectStore("club_football");
            store.put(club_data);
            return tx.complete;
        })
        .then(function () {
            M.toast({
                html: "Berhasil ditambahkan ke favorite."
            });
            console.log("Club Football berhasil di simpan.");
        });
}

function getAll() {

    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("club_football", "readonly");
                let store = tx.objectStore("club_football");
                return store.getAll();
            })
            .then(function (club_football) {
                resolve(club_football);
            });
    });
}

function getById(ID) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("club_football", "readonly");
                let store = tx.objectStore("club_football");
                return store.get(ID);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function removeFromSaved(ID) {
    dbPromised
        .then(db => {
            let tx = db.transaction("club_football", "readwrite");
            let store = tx.objectStore("club_football");
            store.delete(ID);
            return tx.complete;
        })
        .then(function () {
            M.toast({
                html: "Berhasil dihapus dari favorite."
            });
        });

    location.replace('./index.html#saved');
}
