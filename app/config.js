require('dotenv').config({ path: require('find-config')('.env') })

module.exports = {
    APP_ID: process.env.APP_ID,
    APP_KEY: process.env.APP_KEY
}