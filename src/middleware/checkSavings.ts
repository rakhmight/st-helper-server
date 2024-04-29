import { FastifyReply, FastifyRequest } from "fastify";
import { AcceptSavingsReqI } from "../routes/@types/exam";
import { Exam } from "../models/exam";

export default async function(req:FastifyRequest<{Body: AcceptSavingsReqI}>, reply:FastifyReply, done:Function) {
    const savings = req.body.savings
    let savingsCounter = 0


    const savingsData = await Promise.all(savings.map(async (saving)=>{
        const user = saving.userID
        const exam = await Exam.findById(saving.examID)
        if(exam){
            console.log(saving);
            
            const userTarget = exam.users?.find(u => u.id == user)
            console.log(userTarget);
            
            if(userTarget){
                if(userTarget.status == 'working'){
                    const updateOperation = await Exam.updateOne(
                        {
                            '_id': saving.examID
                        },
                        { $set: {
                            'users.$[user].time.value': null,
                            'users.$[user].status': 'waiting',
                        }},
                        { 'arrayFilters': [
                            { 'user.id': saving.userID },
                        ] }
                    )

                    console.log(updateOperation);
                    
                    
                    if(
                        saving.examID && typeof saving.examID == 'string' &&
                        saving.id && typeof saving.id == 'number' &&
                        saving.startTime && typeof saving.startTime == 'number' &&
                        saving.subject && typeof saving.subject == 'string' &&
                        saving.ticket && typeof saving.ticket == 'number' &&
                        saving.userID && typeof saving.userID == 'string' &&
                        saving.actions && Array.isArray(saving.actions) &&
                        saving.residualTime && typeof saving.residualTime == 'number' &&
                        saving.actions[0].ctx.timestamp && typeof saving.actions[0].ctx.timestamp == 'number' &&
                        saving.actions[0].actType && typeof saving.actions[0].actType == 'string'
                    ) {
                        
                        let actionsCounter = 0
            
                        saving.actions.forEach((action, i)=>{
                            
                            if(i!=0 || action.actType!=='resumed' || action.actType!=='paused' || action.actType!=='change-question'){
                                if(
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && typeof action.ctx.answer == 'number' ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && typeof action.ctx.answer == 'object' ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && Array.isArray(action.ctx.answer) ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer === null
                                ){
                                    
                                    if(action.ctx.answer!==null && typeof action.ctx.answer == 'number'){
                                        actionsCounter++
                                    } else if(action.ctx.answer!==null && typeof action.ctx.answer != 'number' && typeof action.ctx.answer == 'object' && !Array.isArray(action.ctx.answer)){
                                        if(
                                            action.ctx.answer.x && typeof action.ctx.answer.x == 'number' &&
                                            action.ctx.answer.y && typeof action.ctx.answer.y == 'number' 
                                        ){
                                            actionsCounter++
                                        }
                                    } else if(action.ctx.answer!==null && typeof action.ctx.answer != 'number' && typeof action.ctx.answer == 'object' && Array.isArray(action.ctx.answer)){
                                        let answerCounter = 0
            
                                        action.ctx.answer.forEach(a=>{
                                            if(a && typeof a == 'number'){
                                                answerCounter++
                                            }
                                        })
            
                                        if(answerCounter==action.ctx.answer.length){
                                            actionsCounter++
                                        }
                                    } else if(action.ctx.answer===null ){
                                        actionsCounter++
                                    }
                                }
                            }
            
                            if(action.actType==='resumed' || action.actType==='paused'){
                                
                                if(action.ctx.timestamp && typeof action.ctx.timestamp == 'number'){
                                    actionsCounter++
                                }
                            }
            
                            if(action.actType==='change-question'){
                                
                                if(
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.ctx.changedQuestion && typeof action.ctx.changedQuestion == 'number' &&
                                    action.ctx.injectedQuestion && typeof action.ctx.injectedQuestion == 'number'
                                ){
                                    actionsCounter++
                                }
                            }
                        })
            
                        // console.log('actionsCounter',actionsCounter);
                        
                        if(actionsCounter == saving.actions.length-1){
                            savingsCounter++
                        }
                    }

                    return updateOperation
                } else {
                    if(
                        saving.examID && typeof saving.examID == 'string' &&
                        saving.id && typeof saving.id == 'number' &&
                        saving.startTime && typeof saving.startTime == 'number' &&
                        saving.subject && typeof saving.subject == 'string' &&
                        saving.ticket && typeof saving.ticket == 'number' &&
                        saving.userID && typeof saving.userID == 'string' &&
                        saving.actions && Array.isArray(saving.actions) &&
                        saving.residualTime && typeof saving.residualTime == 'number' &&
                        saving.actions[0].ctx.timestamp && typeof saving.actions[0].ctx.timestamp == 'number' &&
                        saving.actions[0].actType && typeof saving.actions[0].actType == 'string'
                    ) {
                        
                        let actionsCounter = 0
            
                        saving.actions.forEach((action, i)=>{
                            
                            if(i!=0 || action.actType!=='resumed' || action.actType!=='paused' || action.actType!=='change-question'){
                                if(
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && typeof action.ctx.answer == 'number' ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && typeof action.ctx.answer == 'object' ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer && Array.isArray(action.ctx.answer) ||
                                    
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.actType && typeof action.actType == 'string' &&
                                    action.ctx.currentQuestion && typeof action.ctx.currentQuestion == 'number' &&
                                    action.ctx.answer === null
                                ){
                                    
                                    if(action.ctx.answer!==null && typeof action.ctx.answer == 'number'){
                                        actionsCounter++
                                    } else if(action.ctx.answer!==null && typeof action.ctx.answer != 'number' && typeof action.ctx.answer == 'object' && !Array.isArray(action.ctx.answer)){
                                        if(
                                            action.ctx.answer.x && typeof action.ctx.answer.x == 'number' &&
                                            action.ctx.answer.y && typeof action.ctx.answer.y == 'number' 
                                        ){
                                            actionsCounter++
                                        }
                                    } else if(action.ctx.answer!==null && typeof action.ctx.answer != 'number' && typeof action.ctx.answer == 'object' && Array.isArray(action.ctx.answer)){
                                        let answerCounter = 0
            
                                        action.ctx.answer.forEach(a=>{
                                            if(a && typeof a == 'number'){
                                                answerCounter++
                                            }
                                        })
            
                                        if(answerCounter==action.ctx.answer.length){
                                            actionsCounter++
                                        }
                                    } else if(action.ctx.answer===null ){
                                        actionsCounter++
                                    }
                                }
                            }
            
                            if(action.actType==='resumed' || action.actType==='paused'){
                                
                                if(action.ctx.timestamp && typeof action.ctx.timestamp == 'number'){
                                    actionsCounter++
                                }
                            }
            
                            if(action.actType==='change-question'){
                                
                                if(
                                    action.ctx.timestamp && typeof action.ctx.timestamp == 'number' &&
                                    action.ctx.changedQuestion && typeof action.ctx.changedQuestion == 'number' &&
                                    action.ctx.injectedQuestion && typeof action.ctx.injectedQuestion == 'number'
                                ){
                                    actionsCounter++
                                }
                            }
                        })
            
                        // console.log('actionsCounter',actionsCounter);
                        
                        if(actionsCounter == saving.actions.length-1){
                            savingsCounter++
                        }
                    }
    
                    return false
                }
            }
        }        
    }))

    if(savingsData){
        if(savingsCounter == savings.length){
            req.log.info({ actor: 'Middleware' }, `Exam actions is valid`)
        } else {        
            req.log.fatal({ actor: 'Middleware' }, `Exam actions is not valid`)
            return reply.code(400).send({statusCode: 400, message: 'Exam actions is not valid'})
        }
    }
}