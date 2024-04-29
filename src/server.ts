import getHostAddress from "./utils/getHostAddress";
import { FastifyError } from "fastify";

const { build } = require("./app.js")
const { fastifyConfig } = require('./configs')

const app = build(fastifyConfig);

(async () => {
    try {      
        await app.ready((err:FastifyError) => {
          if (err) throw err
        })

        await app.listen({port: process.env.SERVER_PORT, host: getHostAddress() ? getHostAddress() : hostError()})
        .then(()=>{
            app.log.info({ actor: 'ST-Helper' }, 'Server started successfully')
        })
    } catch (error) {
        app.log.fatal({ actor: 'ST-Helper' }, (error as Error).message);
        process.exit(1);
    }
})()

function hostError(){
    app.log.fatal({ actor: 'ST-Helper' }, 'Unable to get ip address of host');
    process.exit(1);
}