import { Schema, Document, model, Model } from 'mongoose'

export interface ParamModel extends Model<ParamI> {
}

export interface ExamUsersParams {
    id: string,
    bio: {
      firstName: string,
      lastName: string,
      patronymic: string,
      geo: { state: string, region: number }
    },
    status: { blocked: { state: boolean } },
    userRole: string,
    roleProperties: {
      group?: number,
      educationForm?: string,
      recieptDate?: number,
      admissionYear?: number,
      formOfEducation?: string,
      department?: string,
      position?: number
    },
    permission: number,
    hasSign: boolean,
} 

interface ParamI extends Document{
    _id: string,
    usersParams: Array<ExamUsersParams>,
    isActive: boolean
}

const schema: Schema = new Schema<ParamI>(
    {
      isActive: Boolean,
      usersParams: [{
            id: String,
            bio: {
              firstName: String,
              lastName: String,
              patronymic: String,
              geo: { state: String, region: Number }
            },
            status: { blocked: { state: Boolean } },
            userRole: String,
            roleProperties: {
              group: Number,
              educationForm: String,
              recieptDate: Number,
              admissionYear: Number,
              formOfEducation: String,
              department: String,
              position: Number
        
        
            },
            permission: Number,
            hasSign: Boolean,
      }]
    },
    { timestamps: true }
)

export const Param = model<ParamI, ParamModel>('Param', schema)