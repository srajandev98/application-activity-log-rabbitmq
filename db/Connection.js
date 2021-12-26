class DBConnection {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    async connectDatabase() {
        try {
            let db = new DB
        } catch (err) {
            console.log(`-------------------- DB connection failed -----------------------`, err);
            return Promise.resolve(err);
        }
    }
}

module.exports = DBConnection;