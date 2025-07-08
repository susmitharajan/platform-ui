/**
 * Terms management page
 */
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PaginationProps } from '~/libs/ui'
import { 
    PageHeader, 
    PageContent, 
    Pagination, 
    TableLoading,
    TableNoRecord
} from '~/apps/admin/src/lib/components'
import { useTermsAPI } from '../hooks/useTermsAPI'
import { Term } from '../models/Term'
import { TermsTable } from './TermsTable'
import { TermsFilters } from './TermsFilters'

interface TermsPageProps {
    // Add props if needed
}

export const TermsPage: FC<TermsPageProps> = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState<number>(1)
    const [perPage] = useState<number>(25)
    const [titleFilter, setTitleFilter] = useState<string>('')
    
    const {
        terms,
        loading,
        totalCount,
        loadTerms,
    } = useTermsAPI()

    useEffect(() => {
        loadTerms({ page, perPage, title: titleFilter })
    }, [page, perPage, titleFilter, loadTerms])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleFilterChange = useCallback((filters: { title?: string }) => {
        setTitleFilter(filters.title || '')
        setPage(1) // Reset to first page when filtering
    }, [])

    const handleTermClick = useCallback((term: Term) => {
        navigate(`edit/${term.id}`)
    }, [navigate])

    const handleCreateNew = useCallback(() => {
        navigate('new')
    }, [navigate])

    const paginationProps: PaginationProps = {
        currentPage: page,
        totalCount,
        perPage,
        onPageChange: handlePageChange,
    }

    return (
        <>
            <PageHeader
                title="Terms Management"
                rightContent={
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreateNew}
                    >
                        Create New Term
                    </button>
                }
            />
            
            <PageContent>
                <TermsFilters
                    filters={{ title: titleFilter }}
                    onFilterChange={handleFilterChange}
                />
                
                {loading && <TableLoading />}
                
                {!loading && terms.length === 0 && (
                    <TableNoRecord message="No terms found" />
                )}
                
                {!loading && terms.length > 0 && (
                    <>
                        <TermsTable
                            terms={terms}
                            onTermClick={handleTermClick}
                        />
                        
                        <Pagination {...paginationProps} />
                    </>
                )}
            </PageContent>
        </>
    )
}

export default TermsPage