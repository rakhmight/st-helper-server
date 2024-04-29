import { BaseReq } from "../routes/@types/general";
import makeReq from "../utils/makeReq";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function(req:FastifyRequest<{ Body: BaseReq }>, rep:FastifyReply, done:Function) {
    try {
        let deviceData
        let id: string
        let token: string
        

        if(req.body.deviceData){
            deviceData = {
                id: req.body.deviceData.id,
                code: req.body.deviceData.code
            }
        } else {
            id = req.body.auth.id
            token = req.body.auth.token
        }

        // Запрос у Auth сервера
        await makeReq(`${process.env.ST_AUTH_SERVER_IP}/api/user/check`, 'POST', {
            auth:{
                id: id! ? id : undefined,
                token: token! ? token : undefined,
                requesting: req.body.deviceData ? 'device' : 'client'
            },
            deviceData
        })
        .then(data=>{
            if(data.statusCode == 200){
                if(!req.body.deviceData){
                    req.log.info({ actor: 'Middleware' }, `User ${id} is authorized`)
                    req.user = data.data
                } else {
                    req.log.info({ actor: 'Middleware' }, `Device ${req.body.deviceData.id} is identified`)
                }
            } else {
                if(!req.body.deviceData){
                    req.log.error({ actor: 'Middleware' }, `User ${id} not authorized`)
                    return rep.code(404).send({statusCode: 404, message: 'User not found'})
                } else {
                    req.log.error({ actor: 'Middleware' }, `Device ${id} not identified`)
                    return rep.code(404).send({statusCode: 404, message: 'Device not identified'})
                }
            }
        })

    } catch (error) {
        req.log.fatal({ actor: 'Middleware' }, (error as Error).message);
        return rep.code(500).send({statusCode: 500, message: 'Internal Server Error'});
    }
}