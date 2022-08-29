var sqlite3 = require('sqlite3').verbose();
var Toy = require('./Toy')

class SqliteToyDBPromise {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Toys (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, manufacturer TEXT NOT NULL, price REAL NOT NULL);');
            this.db.run('INSERT INTO Toys (name, description, manufacturer, price) VALUES ("Barbie", "The doll", "Mattel", "23.19");');
            this.db.run('INSERT INTO Toys (name, description, manufacturer, price) VALUES ("Hot Wheels", "Toy Cars", "Mattel", "1.59");');
        });
    }

    static all() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Toys', (err, rows) => {
                resolve(rows.map((row) => new Toy(row)));
            });
        });
    }

    // Notice that there is *a lot* of error handling missing here.
    static find(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Toys where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    console.log("resolving");
                    resolve(new Toy(rows[0]));
                } else {
                    console.log("rejecting");
                    reject(`Id ${id} not found`);
                }
            });
        });
    }
}


SqliteToyDBPromise.db = new sqlite3.Database('toys.sqlite');

module.exports = SqliteToyDBPromise;