/**
 * Term users page component
 */
import { FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { 
    PageHeader, 
    PageContent, 
    Pagination,
    TableLoading,
    TableNoRecord,
    ConfirmModal
} from '~/apps/admin/src/lib/components'
import { PaginationProps } from '~/libs/ui'
import { useTermUsersAPI } from './hooks/useTermsAPI'
import { TermUser } from './models/Term'
import { AddUserDialog } from './AddUserDialog'

interface TermUsersPageProps {
    // Add props if needed
}

export const TermUsersPage: FC<TermUsersPageProps> = () => {
    const { id } = useParams<{ id: string }>()
    const [page, setPage] = useState<number>(1)
    const [perPage] = useState<number>(25)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [showAddUserDialog, setShowAddUserDialog] = useState<boolean>(false)
    const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false)
    const [userToRemove, setUserToRemove] = useState<string | null>(null)
    
    const {
        users,
        loading,
        totalCount,
        loadTermUsers,
        addUserToTerm,
        removeUserFromTerm,
    } = useTermUsersAPI()

    useEffect(() => {
        if (id) {
            loadTermUsers(id, { page, perPage })
        }
    }, [id, page, perPage, loadTermUsers])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleUserSelect = useCallback((userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }, [])

    const handleSelectAll = useCallback(() => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(users.map(user => user.userId))
        }
    }, [selectedUsers, users])

    const handleAddUser = useCallback(async (handle: string) => {
        if (!id) return
        
        try {
            // First get user ID from handle
            const memberResponse = await fetch(`https://api.topcoder-dev.com/v3/members/${handle}`)
            if (!memberResponse.ok) {
                throw new Error('User not found')
            }
            const memberData = await memberResponse.json()
            
            await addUserToTerm(id, { userId: memberData.userId })
            loadTermUsers(id, { page, perPage })
            setShowAddUserDialog(false)
        } catch (error) {
            console.error('Error adding user:', error)
        }
    }, [id, addUserToTerm, loadTermUsers, page, perPage])

    const handleRemoveUser = useCallback(async (userId: string) => {
        if (!id) return
        
        try {
            await removeUserFromTerm(id, userId)
            loadTermUsers(id, { page, perPage })
            setSelectedUsers(prev => prev.filter(id => id !== userId))
        } catch (error) {
            console.error('Error removing user:', error)
        }
    }, [id, removeUserFromTerm, loadTermUsers, page, perPage])

    const handleRemoveSelectedUsers = useCallback(async () => {
        if (!id || selectedUsers.length === 0) return
        
        try {
            await Promise.all(
                selectedUsers.map(userId => removeUserFromTerm(id, userId))
            )
            loadTermUsers(id, { page, perPage })
            setSelectedUsers([])
        } catch (error) {
            console.error('Error removing selected users:', error)
        }
    }, [id, selectedUsers, removeUserFromTerm, loadTermUsers, page, perPage])

    const handleSingleRemove = useCallback((userId: string) => {
        setUserToRemove(userId)
        setShowRemoveConfirm(true)
    }, [])

    const confirmSingleRemove = useCallback(async () => {
        if (userToRemove) {
            await handleRemoveUser(userToRemove)
            setUserToRemove(null)
            setShowRemoveConfirm(false)
        }
    }, [userToRemove, handleRemoveUser])

    const paginationProps: PaginationProps = {
        currentPage: page,
        totalCount,
        perPage,
        onPageChange: handlePageChange,
    }

    return (
        <>
            <PageHeader
                title="Term Users"
                rightContent={
                    <div>
                        <button
                            type="button"
                            className="btn btn-success me-2"
                            onClick={() => setShowAddUserDialog(true)}
                        >
                            Add Users
                        </button>
                        {selectedUsers.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleRemoveSelectedUsers}
                            >
                                Remove Selected ({selectedUsers.length})
                            </button>
                        )}
                    </div>
                }
            />
            
            <PageContent>
                {loading && <TableLoading />}
                
                {!loading && users.length === 0 && (
                    <TableNoRecord message="No users found for this term" />
                )}
                
                {!loading && users.length > 0 && (
                    <>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === users.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>User ID</th>
                                        <th>Handle</th>
                                        <th>Added Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user: TermUser) => (
                                        <tr key={user.userId}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.userId)}
                                                    onChange={() => handleUserSelect(user.userId)}
                                                />
                                            </td>
                                            <td>{user.userId}</td>
                                            <td>{user.handle}</td>
                                            <td>{new Date(user.created).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleSingleRemove(user.userId)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <Pagination {...paginationProps} />
                    </>
                )}
            </PageContent>

            <AddUserDialog
                show={showAddUserDialog}
                onClose={() => setShowAddUserDialog(false)}
                onAddUser={handleAddUser}
            />

            <ConfirmModal
                show={showRemoveConfirm}
                title="Remove User"
                message="Are you sure you want to remove this user from the term?"
                onConfirm={confirmSingleRemove}
                onCancel={() => setShowRemoveConfirm(false)}
                confirmText="Remove"
                cancelText="Cancel"
                confirmButtonClass="btn-danger"
            />
        </>
    )
}

export default TermUsersPage