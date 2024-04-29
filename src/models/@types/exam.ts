export interface ExamUsers {
    id: String,
    token: String,
    status: UserExamStatus,
    time?: {
        start: number | null,
        value: number | null
    },
    subject?: String | null,
    exams: Array<UserExamsResultsI>
}

export type UserExamStatus = 'waiting' | 'working' | 'blocked' | 'finished' | 'failed' | 'paused'

export interface UserExamsResultsI {
    subject: String,
    attempts: Array<ExamAttemptI>,
    passed: Boolean
}

export interface ExamAttemptI {
    round: number,
    status: 'finished' | 'failed' | 'blocked',
    date: {
        start: Number,
        end: Number
    },
    ticket: Number,
    grade: Number | null,
    actions: Array<ExamAttemptActionI> | null,
    residualTime: Number
}

export interface ExamAttemptActionI {
    actType: String,
    ctx: {
        timestamp: Number,
        currentQuestion?: Number,
        answer?: number | ExamCoordAnswerI | Array<Number> | null,
        changedQuestion?: number,
        injectedQuestion?: number
    },
    _id?: String
}

export interface ExamCoordAnswerI {
    x: number,
    y: number
}

export interface ExamImage {
    subject: String,
    tickets: Array<ExamTicketImage>
}

export interface ExamTicketImage {
    id: Number,
    questions: Array<Number>,
    additionalQuestions: Array<Number>
}

export interface ExamParamsI {
    complex?: ExamComplexParamsI,
}

export interface ExamComplexParamsI {
    complexResults: String,
    examsInterval: null | Number,
    examsOrder: Array<String>
}


export interface ExamDateParamsI {
    start:{
        date: undefined | String,
        time: undefined | String,
        byCommand: Boolean,
    },
    end:{
        date: undefined | String,
        time: undefined | String,
        byCommand: Boolean
    }
}