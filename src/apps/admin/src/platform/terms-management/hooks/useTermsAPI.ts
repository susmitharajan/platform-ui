/**
 * Custom hook for Terms API operations
 */
import { useCallback, useState } from 'react'
import useSWR from 'swr'

import { 
    Term, 
    TermsResponse, 
    TermType, 
    AgreeabilityType, 
    CreateTermRequest, 
    UpdateTermRequest, 
    GetTermsRequest,
    TermUser,
    TermUsersResponse,
    GetTermUsersRequest,
    AddUserToTermRequest
} from '../models/Term'

const API_BASE_URL = 'https://api.topcoder-dev.com/v5'

interface UseTermsAPIReturn {
    terms: Term[]
    loading: boolean
    error: any
    totalCount: number
    loadTerms: (params: GetTermsRequest) => Promise<void>
    createTerm: (term: CreateTermRequest) => Promise<Term>
    updateTerm: (term: UpdateTermRequest) => Promise<Term>
    deleteTerm: (id: string) => Promise<void>
    getTermById: (id: string) => Promise<Term>
}

interface UseTermTypesAPIReturn {
    termTypes: TermType[]
    loading: boolean
    error: any
}

interface UseAgreeabilityTypesAPIReturn {
    agreeabilityTypes: AgreeabilityType[]
    loading: boolean
    error: any
}

interface UseTermUsersAPIReturn {
    users: TermUser[]
    loading: boolean
    error: any
    totalCount: number
    loadTermUsers: (termId: string, params: GetTermUsersRequest) => Promise<void>
    addUserToTerm: (termId: string, request: AddUserToTermRequest) => Promise<void>
    removeUserFromTerm: (termId: string, userId: string) => Promise<void>
}

export const useTermsAPI = (): UseTermsAPIReturn => {
    const [terms, setTerms] = useState<Term[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [totalCount, setTotalCount] = useState<number>(0)

    const loadTerms = useCallback(async (params: GetTermsRequest) => {
        setLoading(true)
        setError(null)
        
        try {
            const queryParams = new URLSearchParams()
            if (params.page) queryParams.append('page', params.page.toString())
            if (params.perPage) queryParams.append('perPage', params.perPage.toString())
            if (params.title) queryParams.append('title', params.title)

            const response = await fetch(`${API_BASE_URL}/terms?${queryParams}`)
            
            if (!response.ok) {
                throw new Error('Failed to load terms')
            }
            
            const data: TermsResponse = await response.json()
            setTerms(data.terms)
            setTotalCount(data.totalCount)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const createTerm = useCallback(async (term: CreateTermRequest): Promise<Term> => {
        const response = await fetch(`${API_BASE_URL}/terms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(term),
        })

        if (!response.ok) {
            throw new Error('Failed to create term')
        }

        return response.json()
    }, [])

    const updateTerm = useCallback(async (term: UpdateTermRequest): Promise<Term> => {
        const response = await fetch(`${API_BASE_URL}/terms/${term.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(term),
        })

        if (!response.ok) {
            throw new Error('Failed to update term')
        }

        return response.json()
    }, [])

    const deleteTerm = useCallback(async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/terms/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete term')
        }
    }, [])

    const getTermById = useCallback(async (id: string): Promise<Term> => {
        const response = await fetch(`${API_BASE_URL}/terms/${id}`)
        
        if (!response.ok) {
            throw new Error('Failed to get term')
        }

        return response.json()
    }, [])

    return {
        terms,
        loading,
        error,
        totalCount,
        loadTerms,
        createTerm,
        updateTerm,
        deleteTerm,
        getTermById,
    }
}

export const useTermTypesAPI = (): UseTermTypesAPIReturn => {
    const { data: termTypes, error, isLoading } = useSWR<TermType[]>(
        `${API_BASE_URL}/terms/types`,
        async (url: string) => {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to load term types')
            }
            return response.json()
        }
    )

    return {
        termTypes: termTypes || [],
        loading: isLoading,
        error,
    }
}

export const useAgreeabilityTypesAPI = (): UseAgreeabilityTypesAPIReturn => {
    const { data: agreeabilityTypes, error, isLoading } = useSWR<AgreeabilityType[]>(
        `${API_BASE_URL}/terms/agreeability-types`,
        async (url: string) => {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to load agreeability types')
            }
            return response.json()
        }
    )

    return {
        agreeabilityTypes: agreeabilityTypes || [],
        loading: isLoading,
        error,
    }
}

export const useTermUsersAPI = (): UseTermUsersAPIReturn => {
    const [users, setUsers] = useState<TermUser[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [totalCount, setTotalCount] = useState<number>(0)

    const loadTermUsers = useCallback(async (termId: string, params: GetTermUsersRequest) => {
        setLoading(true)
        setError(null)
        
        try {
            const queryParams = new URLSearchParams()
            if (params.page) queryParams.append('page', params.page.toString())
            if (params.perPage) queryParams.append('perPage', params.perPage.toString())

            const response = await fetch(`${API_BASE_URL}/terms/${termId}/users?${queryParams}`)
            
            if (!response.ok) {
                throw new Error('Failed to load term users')
            }
            
            const data: TermUsersResponse = await response.json()
            setUsers(data.users)
            setTotalCount(data.totalCount)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const addUserToTerm = useCallback(async (termId: string, request: AddUserToTermRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/terms/${termId}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })

        if (!response.ok) {
            throw new Error('Failed to add user to term')
        }
    }, [])

    const removeUserFromTerm = useCallback(async (termId: string, userId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/terms/${termId}/users/${userId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to remove user from term')
        }
    }, [])

    return {
        users,
        loading,
        error,
        totalCount,
        loadTermUsers,
        addUserToTerm,
        removeUserFromTerm,
    }
}