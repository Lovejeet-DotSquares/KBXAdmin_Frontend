/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ApiUtility from "../../api/ApiUtility";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import * as Yup from "yup";
import "./Login.css";

interface ILoginApiResp {
    token: string;
    expiresAt: string;
    userName: string;
    email: string;
    role: string;
}

const Login: React.FC = () => {
    usePageTitle("Login");
    const { login } = useAuth();

    const schema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const onSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
        try {
            const res: any = await ApiUtility.post<ILoginApiResp>("/auth/login", values);
            login(res.token);
            window.location.href = "/";
        } catch (err: any) {
            setFieldError("password", err.response?.data?.message || "Invalid login");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* LEFT IMAGE */}
                <div className="login-left"></div>

                {/* RIGHT FORM */}
                <div className="login-right">
                    <h2>Welcome</h2>
                    <p>Sign in to continue to KBX</p>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={schema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Password</label>
                                    <Field
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary w-100 btn-login"
                                >
                                    {isSubmitting ? "Logging in..." : "Login"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-center text-muted mt-4 small">
                        © {new Date().getFullYear()} KBX Admin — All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
