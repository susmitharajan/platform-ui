/**
 * Terms table component
 */
import { FC } from 'react'
import { Term } from './models/Term'

interface TermsTableProps {
    terms: Term[]
    onTermClick: (term: Term) => void
}

export const TermsTable: FC<TermsTableProps> = ({ terms, onTermClick }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Agreeability</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {terms.map((term) => (
                        <tr key={term.id}>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={() => onTermClick(term)}
                                >
                                    {term.title}
                                </button>
                            </td>
                            <td>{term.typeId || 'N/A'}</td>
                            <td>{term.agreeabilityTypeId || 'N/A'}</td>
                            <td>{new Date(term.created).toLocaleDateString()}</td>
                            <td>{new Date(term.updated).toLocaleDateString()}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => onTermClick(term)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TermsTable