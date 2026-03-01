import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/config";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            const email = searchParams.get("email");
            const token = searchParams.get("token");
            const type = searchParams.get("type");

            if (!email || !token || !type) {
                toast.error("Invalid verification link.");
                setError("Invalid verification link.");
                setLoading(false);
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            try {
                const response = await axios.post(`${config.baseURL}/verify/email-token`, {
                    user_email: email,
                    token,
                    type,
                });

                if (response.data.success) {
                    if (type === "verify") {
                        toast.success(response.data.message || "Email verified successfully! Please log in.");
                        setTimeout(() => navigate("/login"), 2000);
                    } else if (type === "password") {
                        toast.success(response.data.message || "Verification successful! Please reset your password.");
                        setTimeout(() => navigate(`/reset-password?email=${email}&token=${token}`), 2000);
                    }
                } else {
                    toast.error(response.data.message || "Verification failed.");
                    setError(response.data.message || "Verification failed.");
                    setTimeout(() => navigate("/login"), 2000);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Verification failed.";
                toast.error(errorMessage);
                setError(errorMessage);
                setTimeout(() => navigate("/login"), 2000);
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="verify-email-container">
            <div className="verify-email-card">
                {loading ? (
                    <div>
                        <div className="spinner"></div>
                        <h2 className="heading">Verifying...</h2>
                        <p className="text">Please wait a moment.</p>
                    </div>
                ) : error ? (
                    <div>
                        <svg
                            className="icon error"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <h2 className="heading error">Verification Failed</h2>
                        <p className="text">{error}</p>
                    </div>
                ) : (
                    <div>
                        <svg
                            className="icon success"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <h2 className="heading success">Verified Successfully!</h2>
                        <p className="text">Redirecting...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;