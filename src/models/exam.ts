import { Schema, Document, model, Model } from 'mongoose'
import { ExamDateParamsI, ExamImage, ExamParamsI, ExamUsers } from './@types/exam'
import { ComplexExamI } from '../routes/@types/exam'

export interface ExamModel extends Model<ExamI> {
}

interface ExamI extends Document{
    _id: String,
    complex: Array<ComplexExamI>,
    users?: Array<ExamUsers>,
    examDateParams: ExamDateParamsI,
    params: ExamParamsI,
    examImage?: Array<ExamImage>,
    isActive: Boolean,
    hasBegun: Boolean,
    stopped: Boolean,
    round: number,
    createdAt: Date,
    updatedAt: Date
}

const schema: Schema = new Schema<ExamI>(
    {
        complex: Array<ComplexExamI>,
        users: [{
            id: String,
            token: String,
            status: String,
            time: {
                start: Number || null,
                value: Number || null
            },
            subject: String || null,
            exams: [{
                subject: String,
                attempts: [{
                    round: Number,
                    date: {
                        start: Number,
                        end: Number
                    },
                    status: String,
                    ticket: Number,
                    grade: Number || null,
                    residualTime: Number,
                    actions: [{
                        actType: String,
                        ctx :{
                            timestamp: Number,
                            answer: Object || Number || Array<Number> || null,
                            currentQuestion: Number,
                            changedQuestion: Number,
                            injectedQuestion: Number
                        },
                        _id: String
                    }] || null
                }],
                passed: Boolean
            }]
        }] || undefined,
        examDateParams:{
            start:{
                date: undefined || String,
                time: undefined || String,
                byCommand: Boolean,
            },
            end:{
                date: undefined || String,
                time: undefined || String,
                byCommand: Boolean,
            }
        },
        params: Object || undefined,
        examImage: [{
            subject: String,
            tickets: [{
                id: Number,
                questions: Array<Number>,
                additionalQuestions: Array<Number>
            }]
        }] || undefined,
        isActive: Boolean,
        hasBegun: Boolean,
        stopped: Boolean,
        round: Number
    },
    { timestamps: true }
)

export const Exam = model<ExamI, ExamModel>('Exam', schema)