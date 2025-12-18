/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ApiUtility from "../../api/ApiUtility";
import type { UserRole } from "../../types/user";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

const UserForm: React.FC<Props> = ({ onClose, onCreated }) => {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState<UserRole>("User");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await ApiUtility.post("/auth/register", {
                email,
                userName,
                password,
                role,
            });
            onCreated();
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to create user";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create User</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">User Name</label>
                                <input
                                    className="form-control"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Reviewer">Reviewer</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
