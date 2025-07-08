/**
 * Add User Dialog component
 */
import { FC, useState } from 'react'

interface AddUserDialogProps {
    show: boolean
    onClose: () => void
    onAddUser: (handle: string) => Promise<void>
}

export const AddUserDialog: FC<AddUserDialogProps> = ({ show, onClose, onAddUser }) => {
    const [handle, setHandle] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!handle.trim()) return

        setLoading(true)
        try {
            await onAddUser(handle.trim())
            setHandle('')
        } catch (error) {
            console.error('Error adding user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setHandle('')
        onClose()
    }

    if (!show) return null

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add User to Term</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="user-handle">User Handle</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="user-handle"
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="Enter user handle..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !handle.trim()}
                            >
                                {loading ? 'Adding...' : 'Add User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUserDialog