
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { ExamModel, Exam } from '../models/exam';
import { ParamModel, Param } from '../models/param';

export interface Models {
    Exam: ExamModel,
    Param: ParamModel
}

export interface Db {
    models: Models;
}
// define options
export interface MyPluginOptions {
    url: string
    cert: string
}

const ConnectDB: FastifyPluginAsync<MyPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    try {
        mongoose.connection.on('connected', () => {
            fastify.log.info({ actor: 'MongoDB' }, 'connected');
        });
        mongoose.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
        });
        const db = await mongoose.connect(options.url, {
            autoIndex: false,
        });
        const models: Models = { Exam, Param };
        fastify.decorate('db', { models });
    } catch (error) {
        fastify.log.fatal({ actor: 'MongoDB' }, (error as Error).message);
        process.exit(1);
    }
};
export const dbPlugin = fp(ConnectDB);