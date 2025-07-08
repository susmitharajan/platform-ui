/**
 * Term model interface
 */
export interface Term {
    id: string
    title: string
    url?: string
    text?: string
    typeId?: string
    agreeabilityTypeId?: string
    created: string
    updated: string
    createdBy?: string
    updatedBy?: string
}

export interface TermType {
    id: string
    name: string
}

export interface AgreeabilityType {
    id: string
    name: string
}

export interface TermsResponse {
    terms: Term[]
    totalCount: number
}

export interface TermUser {
    userId: string
    handle: string
    created: string
}

export interface TermUsersResponse {
    users: TermUser[]
    totalCount: number
}

export interface CreateTermRequest {
    title: string
    url?: string
    text?: string
    typeId?: string
    agreeabilityTypeId?: string
}

export interface UpdateTermRequest extends CreateTermRequest {
    id: string
}

export interface AddUserToTermRequest {
    userId: string
}

export interface GetTermsRequest {
    page?: number
    perPage?: number
    title?: string
}

export interface GetTermUsersRequest {
    page?: number
    perPage?: number
}