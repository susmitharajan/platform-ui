/**
 * Terms filters component
 */
import { FC, useState } from 'react'

interface TermsFiltersProps {
    filters: {
        title?: string
    }
    onFilterChange: (filters: { title?: string }) => void
}

export const TermsFilters: FC<TermsFiltersProps> = ({ filters, onFilterChange }) => {
    const [title, setTitle] = useState(filters.title || '')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onFilterChange({ title })
    }

    const handleReset = () => {
        setTitle('')
        onFilterChange({ title: '' })
    }

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="title-filter">Filter by Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title-filter"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter term title..."
                        />
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary me-2">
                        Search
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
        </form>
    )
}

export default TermsFilters