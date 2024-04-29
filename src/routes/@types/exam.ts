import { ExamAttemptActionI, ExamAttemptI } from "../../models/@types/exam"
import { BaseReq } from "./general"

export interface BallSystemI{
    currect: Number,
    uncurrect: Number
}

export interface ThemeRankingI {
    theme: Number,
    count: number
}

export interface DifficultyRankingI {
    difficulty: Number,
    count: number
}

export interface ExamTicketsParams {
    answersCount: null | number,
    difficultyRanking?: null | Array<DifficultyRankingI>, //
    themes: null | Array<Number>,
    themesRanking?: null | Array<ThemeRankingI>, //
    ticketsCount: Number,
    questionsCount: number,
    complex: Boolean,
    subject: String
}
export interface ExamParamsI extends ExamTicketsParams{
    ballSystem: null | BallSystemI,
    changeAnswerPossibility: Boolean,
    displayedResultParams?: Array<String>, //
    evaluationSystem: {
        great: {
            from: Number,
            to: Number
        },
        good: {
            from: Number,
            to: Number
        },
        satisfactorily: {
            from: Number,
            to: Number
        }
    },
    examTime: null | number,
    languages: Array<String>,
    questionTime: null | Number,
    resultDisplayTime?: number, //
    showResults: Boolean
}
export interface ComplexExamI {
    subject: String,
    tests: Array<String>,
    params: ExamParamsI,
    themes: Array<Number>
}

export interface ExamInitReqI extends BaseReq{
    data:{
        examID: String
    }
}

export interface AcceptSavingsReqI extends BaseReq {
    savings: Array<ExamSavingI>
}

export interface ExamSavingI {
    actions: Array<ExamAttemptActionI>,
    examID: String,
    id: Number,
    startTime: Number,
    subject: String,
    ticket: Number,
    userID: String,
    residualTime: Number
}

export interface UpdateSavingsReqI extends BaseReq {
    saving: ExamSavingI
}

export interface UserAttemptsI {
    subject: String,
    attempts: ExamAttemptI
}

export interface CheckUserExamsReqI {
    data: {
        userID: string
    }
}