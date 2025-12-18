import React, { useMemo, useState } from "react";
import ApiUtility from "../../api/ApiUtility";
import type { UserDto, UserRole } from "../../types/user";
import { usePageTitle } from "../../hooks/usePageTitle";
import UserForm from "./UserForm";
import { useConfirm } from "../../hooks/useConfirm";
import { notifyError, notifySuccess } from "../../utils/toast";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

const UsersList: React.FC = () => {
    usePageTitle("Users");

    const queryClient = useQueryClient();
    const { confirm } = useConfirm();

    // UI state
    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // ================================
    // FETCH USERS (React Query)
    // ================================

    const {
        data: users = [],
        isLoading,
        isError,
        refetch,
    } = useQuery<UserDto[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const list = await ApiUtility.get<UserDto[]>("/users");
            return list;
        },
    });

    // ================================
    // SEARCH + PAGINATION (Client side)
    // ================================

    const filtered = useMemo(() => {
        return users.filter(
            (u) =>
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                u.userName.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const paginated = useMemo(() => {
        return filtered.slice((page - 1) * pageSize, page * pageSize);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // ================================
    // MUTATIONS (Role change / deactivate)
    // ================================

    const roleMutation = useMutation({
        mutationFn: async ({
            userId,
            role,
        }: {
            userId: string;
            role: UserRole;
        }) => {
            return await ApiUtility.put(`/users/${userId}/role?role=${role}`);
        },
        onSuccess: () => {
            notifySuccess("Role updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notifyError("Failed to update role");
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: async (userId: string) => {
            return await ApiUtility.put(`/users/${userId}/deactivate`);
        },
        onSuccess: () => {
            notifySuccess("User deactivated");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notifyError("Failed to deactivate user");
        },
    });

    // ================================
    // ACTION HANDLERS
    // ================================

    const handleRoleChange = (userId: string, role: UserRole) => {
        roleMutation.mutate({ userId, role });
    };

    const handleDeactivate = async (userId: string) => {
        const ok = await confirm({
            title: "Deactivate User?",
            message: "Are you sure you want to deactivate this user?",
            confirmText: "Deactivate",
            cancelText: "Cancel",
        });

        if (!ok) return;

        deactivateMutation.mutate(userId);
    };

    const handleUserCreated = async () => {
        setShowCreate(false);
        await refetch();
    };

    // ================================
    // UI
    // ================================

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Users</h3>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Create User
                </button>
            </div>

            {/* Search Bar */}
            <input
                className="form-control mb-3"
                placeholder="Search by email or username..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            {/* Loading / Error States */}
            {isLoading && <div>Loading users...</div>}
            {isError && <div className="text-danger">Failed to load users</div>}

            {/* Table */}
            {!isLoading && paginated.length > 0 && (
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Email</th>
                            <th>User Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th style={{ width: 180 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((u) => (
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>{u.userName}</td>

                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChange(u.id, e.target.value as UserRole)
                                        }
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                        <option value="Reviewer">Reviewer</option>
                                    </select>
                                </td>

                                <td>
                                    {u.isActive ? (
                                        <span className="badge bg-success">Active</span>
                                    ) : (
                                        <span className="badge bg-secondary">Inactive</span>
                                    )}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeactivate(u.id)}
                                        disabled={!u.isActive}
                                    >
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* No Records */}
            {!isLoading && paginated.length === 0 && (
                <div>No users found.</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i}
                                className={`page-item ${page === i + 1 ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li
                            className={`page-item ${page === totalPages ? "disabled" : ""
                                }`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Create User Modal */}
            {showCreate && (
                <UserForm
                    onClose={() => setShowCreate(false)}
                    onCreated={handleUserCreated}
                />
            )}
        </div>
    );
};

export default UsersList;
