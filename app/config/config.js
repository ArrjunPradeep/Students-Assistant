require('dotenv').config({ path: require('find-config')('.env') })

module.exports = {
    
    APP_ID: process.env.APP_ID,
    APP_KEY: process.env.APP_KEY,

    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    }

}