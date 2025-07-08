/**
 * Term edit/create page component
 */
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { 
    PageHeader, 
    PageContent,
    ActionLoading,
    ConfirmModal
} from '~/apps/admin/src/lib/components'
import { 
    useTermsAPI, 
    useTermTypesAPI, 
    useAgreeabilityTypesAPI 
} from './hooks/useTermsAPI'
import { Term, CreateTermRequest, UpdateTermRequest } from './models/Term'

interface TermEditPageProps {
    // Add props if needed
}

export const TermEditPage: FC<TermEditPageProps> = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const isEdit = id !== 'new'
    
    const [term, setTerm] = useState<Term | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
    const [isHtmlMode, setIsHtmlMode] = useState<boolean>(false)
    
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        text: '',
        typeId: '',
        agreeabilityTypeId: '',
    })

    const { 
        getTermById, 
        createTerm, 
        updateTerm, 
        deleteTerm 
    } = useTermsAPI()
    
    const { termTypes } = useTermTypesAPI()
    const { agreeabilityTypes } = useAgreeabilityTypesAPI()

    useEffect(() => {
        if (isEdit && id) {
            loadTerm(id)
        }
    }, [isEdit, id])

    const loadTerm = async (termId: string) => {
        setLoading(true)
        try {
            const termData = await getTermById(termId)
            setTerm(termData)
            setFormData({
                title: termData.title,
                url: termData.url || '',
                text: termData.text || '',
                typeId: termData.typeId || '',
                agreeabilityTypeId: termData.agreeabilityTypeId || '',
            })
        } catch (error) {
            console.error('Error loading term:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        
        try {
            if (isEdit && id) {
                const updateData: UpdateTermRequest = {
                    id,
                    ...formData
                }
                await updateTerm(updateData)
            } else {
                const createData: CreateTermRequest = formData
                await createTerm(createData)
            }
            
            navigate('/platform/terms')
        } catch (error) {
            console.error('Error saving term:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        
        setSaving(true)
        try {
            await deleteTerm(id)
            navigate('/platform/terms')
        } catch (error) {
            console.error('Error deleting term:', error)
        } finally {
            setSaving(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleCancel = () => {
        navigate('/platform/terms')
    }

    const toggleHtmlMode = () => {
        setIsHtmlMode(!isHtmlMode)
    }

    if (loading) {
        return <ActionLoading />
    }

    return (
        <>
            <PageHeader
                title={isEdit ? 'Edit Term' : 'Create New Term'}
                rightContent={
                    <div>
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={saving}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            form="term-form"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                }
            />
            
            <PageContent>
                <form id="term-form" onSubmit={handleSave}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor="url">URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor="typeId">Type</label>
                                <select
                                    className="form-control"
                                    id="typeId"
                                    name="typeId"
                                    value={formData.typeId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Type</option>
                                    {termTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor="agreeabilityTypeId">Agreeability Type</label>
                                <select
                                    className="form-control"
                                    id="agreeabilityTypeId"
                                    name="agreeabilityTypeId"
                                    value={formData.agreeabilityTypeId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Agreeability Type</option>
                                    {agreeabilityTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="text">Text</label>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={toggleHtmlMode}
                            >
                                {isHtmlMode ? 'Switch to Text Editor' : 'Switch to HTML Editor'}
                            </button>
                        </div>
                        <textarea
                            className="form-control"
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={handleInputChange}
                            rows={isHtmlMode ? 20 : 10}
                            placeholder={isHtmlMode ? 'Enter HTML content...' : 'Enter text content...'}
                        />
                        {isHtmlMode && (
                            <small className="form-text text-muted">
                                HTML Editor mode - You can enter HTML markup here
                            </small>
                        )}
                    </div>
                </form>
            </PageContent>

            <ConfirmModal
                show={showDeleteConfirm}
                title="Delete Term"
                message="Are you sure you want to delete this term? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonClass="btn-danger"
            />
        </>
    )
}

export default TermEditPage