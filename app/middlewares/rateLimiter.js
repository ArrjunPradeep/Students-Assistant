const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 month in ms , n the Gregorian calendar, an average month has exactly 30.436875 days.
    max: 200,
    message: {
        status: "Fail",
        message: 'You have exceeded the 200 requests in 24 hrs limit!'
    },
    headers: true
})

module.exports = rateLimiter
