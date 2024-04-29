// modules
const fastify = require("fastify");
const path = require('path')
require('dotenv').config({path: path.join(__dirname, `../.env`)})

// routes
const examRoutes = require('./routes/exam')
const pingRoutes = require('./routes/ping')

// plugins
const { dbPlugin } = require('./plugins/db')
const { corsParams } = require('./plugins/cors')
const { sessionParams } = require('./plugins/session')

// options
const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:27017/${process.env.DB_NAME}`

export const build = (opts = {}) => {    
    const app = fastify(opts)
    
    app.register(require('@fastify/cors'), corsParams)
    app.register(dbPlugin, { url: dbUrl })
    app.register(require('@fastify/cookie'))
    app.register(require('@fastify/session'), sessionParams)

    app.register(examRoutes)
    app.register(pingRoutes)
    
    app.after()
    return app;
}