import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ApiUtility from "../../api/ApiUtility";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import * as Yup from "yup";

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

    const onSubmit = async (
        values: any,
        { setSubmitting, setFieldError }: any
    ) => {
        try {
            const res: any = await ApiUtility.post<ILoginApiResp>(
                "/auth/login",
                values
            );
            login(res.token);
            window.location.href = "/";
        } catch (err: any) {
            setFieldError(
                "password",
                err.response?.data?.message || "Invalid login"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9 col-lg-10 col-md-11">
                        <div className="card shadow border-0 rounded-4 overflow-hidden">
                            <div className="row g-0">

                                {/* LEFT IMAGE */}
                                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-white">
                                    <img
                                        src="/login.png"
                                        alt="Login Illustration"
                                        className="img-fluid px-4"
                                        style={{ maxHeight: "360px" }}
                                    />
                                </div>

                                {/* RIGHT FORM */}
                                <div className="col-12 col-md-6 p-4 p-md-5">
                                    <h2 className="fw-bold mb-1">Welcome</h2>
                                    <p className="text-muted mb-4">
                                        Sign in to continue to KBX
                                    </p>

                                    <Formik
                                        initialValues={{
                                            email: "",
                                            password: "",
                                        }}
                                        validationSchema={schema}
                                        onSubmit={onSubmit}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">
                                                        Email Address
                                                    </label>
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
                                                    <label className="form-label fw-semibold">
                                                        Password
                                                    </label>
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
                                                    className="btn btn-primary w-100 fw-semibold"
                                                >
                                                    {isSubmitting
                                                        ? "Logging in..."
                                                        : "Login"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>

                                    <p className="text-center text-muted mt-4 small">
                                        © {new Date().getFullYear()} KBX Admin —
                                        All Rights Reserved
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
