import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify';
import fp from 'fastify-plugin';
import { Db } from '../plugins/db';
import { Exam } from '../models/exam';
import { Param } from '../models/param';

import checkToken from '../middleware/checkToken';
import checkSavings from '../middleware/checkSavings';

import { AcceptSavingsReqI, CheckUserExamsReqI, ComplexExamI, ExamInitReqI, UpdateSavingsReqI, UserAttemptsI } from './@types/exam';
import { ExamComplexParamsI, ExamDateParamsI } from '../models/@types/exam';
import { BaseReq, CheckedUserCtxI } from './@types/general';

// Declaration merging
declare module 'fastify' {
    export interface FastifyInstance {
        db: Db;
    }
    
    interface FastifyRequest {
        user: CheckedUserCtxI
    }
}

const ExamRoute: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post<{Body: BaseReq}>('/api/exams/get-users-params', {preHandler: [checkToken]}, async (req, rep) => {
        try {
            
            if(req.body.deviceData){
                const usersParamsList = await Param.find({ isActive: true }) 

                req.log.info({ actor: 'Route: exams' }, `Device ${req.body.deviceData.id} get usersParamsList list`)
                return rep.code(200).send({statusCode: 200, data:{ usersParamsList }})
            }

        } catch (error) {
          req.log.fatal({ actor: 'Route: exams' }, (error as Error).message)
          return rep.code(400).send({statusCode: 400, message: 'Bad Request'});
        }
    })

    fastify.post<{Body: BaseReq}>('/api/exams/check', {preHandler: [checkToken]}, async (req, rep) => {
        try {
            const exams = await Exam.find(
                {
                    'users.id': req.body.auth.id,
                    hasBegun: true
                },
            )

            if(exams){
                const userExams = exams.map(exam=>{
                    
                    const userData = exam.users!.find(user=>user.id==req.body.auth.id)
                    const acessModuleExams:Array<ComplexExamI> = []
                    const userAttempts:Array<UserAttemptsI> = []

                    userData?.exams.forEach(moduleEx=>{

                        // если ещё не сдавал
                        if(!moduleEx.passed && exam.round>moduleEx.attempts.length){
                            // console.log(exam.complex);
                            
                            const examTarget = exam.complex.find(ex => ex.subject==moduleEx.subject)
                            acessModuleExams.push(examTarget!)
                        } 
                        // начал, но не закончил (аварийный режим)
                        else if(!moduleEx.passed && exam.round==moduleEx.attempts.length && moduleEx.attempts[exam.round-1].grade === null){
                            const examTarget:ComplexExamI = exam.complex.find(ex => ex.subject==moduleEx.subject)!
                            acessModuleExams.push(examTarget)
                            userAttempts.push({
                                subject: moduleEx.subject,
                                attempts: moduleEx.attempts[moduleEx.attempts.length-1]
                            })
                        }
                    })

                    if(acessModuleExams.length){
                        return {
                            isComplex: userData!.exams.length>1 ? true : false,
                            complex: acessModuleExams,
                            userAttempts: userAttempts.length ? userAttempts : undefined,
                            examDateParams: exam.examDateParams,
                            hasBegun: exam.hasBegun,
                            id: exam._id,
                            complexOptions: exam.complex.length>1 ? exam.params.complex : null,
                            userStatus: userData?.status
                        }
                    } else {
                        return undefined
                    }
                })

                interface userExams {
                    complex: Array<ComplexExamI>,
                    userAttempts: Array<UserAttemptsI> | undefined,
                    examDateParams: ExamDateParamsI,
                    hasBegun: Boolean,
                    id: String,
                    complexOptions: ExamComplexParamsI | null
                }

                if(userExams.length){
                    req.log.info({ actor: 'Route: exams' }, `Checking actual exams for ${req.body.auth.id}`)
                    return rep.code(200).send({statusCode: 200, data:{userExams}})
                } else {
                    req.log.info({ actor: 'Route: exams' }, `Checking actual exams for ${req.body.auth.id}`)
                    return rep.code(200).send({statusCode: 204, data:{ info: 'not exams' }})
                }
            } else {
                req.log.info({ actor: 'Route: exams' }, `Checking actual exams for ${req.body.auth.id}`)
                return rep.code(200).send({statusCode: 204, data:{ info: 'not exams' }})
            }
            
          } catch (error) {
            req.log.fatal({ actor: 'Route: exams' }, (error as Error).message)
            return rep.code(400).send({statusCode: 400, message: 'Bad Request'});
          }
    })

    fastify.post<{Body: CheckUserExamsReqI}>('/api/exams/check-user-exams', async (req, rep) => {
        try {
            const userID = req.body.data.userID

            const examsData = await Exam.find(
                {
                    'users.id': userID
                }
            )

            req.log.info({ actor: 'Route: exams' }, `Checking exams count for ${userID}`)
            return rep.code(200).send({statusCode: 200, data:{ exams: examsData.length }})
        } catch (error) {
          req.log.fatal({ actor: 'Route: exams' }, (error as Error).message)
          return rep.code(400).send({statusCode: 400, message: 'Bad Request'});
        }
    })

    fastify.post<{Body: AcceptSavingsReqI}>('/api/exams/acceptsavings', {preHandler: [checkSavings]}, async (req, rep) => {
        try {
            const savings = req.body.savings

            const acceptSavings = savings.map(async (saving)=>{
                
                const exam = await Exam.findById(saving.examID)

                if(exam && exam.users){
                    const targetU = exam.users.find(user => user.id == saving.userID)
                    if(targetU){
                        const indexU = exam.users.indexOf(targetU)
                        
                        const targetE = exam.users[indexU].exams.find( exam => exam.subject == saving.subject)

                        if(targetE && exam.users[indexU].status == 'working'){
                            const indexE = exam.users[indexU].exams.indexOf(targetE)

                            const targetA = exam.users[indexU].exams[indexE].attempts.find(attempt => attempt.round == exam.round)

                            if(targetA){
                                const indexA = exam.users[indexU].exams[indexE].attempts.indexOf(targetA)

                                if(!exam.users[indexU].exams[indexE].attempts[indexA].grade){

                                    const updateOperation = await Exam.updateOne(
                                        {
                                            '_id': saving.examID
                                        },
                                        { $set: {
                                            'users.$[user].exams.$[exam].attempts.$[time].actions': saving.actions,
                                            'users.$[user].exams.$[exam].attempts.$[time].residualTime': saving.residualTime,
                                            'users.$[user].time.value': null,
                                            'users.$[user].status': 'waiting',
                                        }},
                                        { 'arrayFilters': [
                                            { 'user.id': saving.userID },
                                            { 'exam.subject': saving.subject },
                                            { 'time.round': exam.round }
                                        ]}
                                    )
                    
                                    return { userID: saving.userID, updateCount: updateOperation.modifiedCount }
                                } else return
                            }
                        }

                        if(exam.users[indexU].status != 'working'){
                            req.log.fatal({ actor: 'Route: exams' }, `Examinee ${exam.users[indexU]} already working exam`)
                        }
                    }
                }
            })

            req.log.info({ actor: 'Route: exams' }, `Accept savings`)
            return rep.code(200).send({statusCode: 200, data:{ OK: true, acceptSavings }})

        } catch (error) {
          req.log.fatal({ actor: 'Route: exams' }, (error as Error).message)
          return rep.code(400).send({statusCode: 400, message: 'Bad Request'});
        }
    })

    fastify.post<{Body: UpdateSavingsReqI}>('/api/exams/saving-update', {preHandler: [checkToken]}, async (req, rep) => {
        try {
            const saving = req.body.saving;

            const exam = await Exam.findById(saving.examID)

            if(exam){
                const updateOperation = await Exam.updateOne(
                    {
                        '_id': saving.examID
                    },
                    { $set: {
                        'users.$[user].exams.$[exam].attempts.$[time].actions': saving.actions,
                        'users.$[user].exams.$[exam].attempts.$[time].residualTime': saving.residualTime
                    }},
                    { 'arrayFilters': [
                        { 'user.id': saving.userID },
                        { 'exam.subject': saving.subject },
                        { 'time.round': exam.round }
                    ]}
                )
    
                req.log.info({ actor: 'Route: exams' }, `Accept saving from user ${req.body.auth.id}`)
                return rep.code(200).send({statusCode: 200, data:{ updateOperation }})
            }
        } catch (error) {
            req.log.fatal({ actor: 'Route: exams' }, (error as Error).message)
            return rep.code(400).send({statusCode: 400, message: 'Bad Request'});
        }
    })

}

export default fp(ExamRoute);