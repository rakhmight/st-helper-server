export interface BaseReq {
    auth:{
        id: string,
        token: string
    },
    deviceData?:{
        id: String,
        code: string
    }
}

export interface CheckedUserCtxI {
    userData: {
        bio: UserBioI,
        userRole: String,
        permission: number,
        roleProperties: UserRolePropertiesI
    },
    tokenLife: Number
}

interface UserBioI {
    firstName: string,
    lastName: string,
    patronymic: string,
    avatar?: string | undefined,
    geo:{
      state: string,
      region: Number
    }
}

interface UserRolePropertiesI {
    educationForm?: String | undefined,
    group?: Number | undefined,
    formOfEducation?: String | undefined,
    recieptDate?: String | undefined,
    admissionYear?: String | undefined,
    department?: String | undefined,
    position?: Number | undefined,
}