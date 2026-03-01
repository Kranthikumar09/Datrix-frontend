import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config'; // Adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TermsCondition = () => {
    const [termsContent, setTermsContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTermsAndConditions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${config.baseURL}/site-content/legal-page-content/get`,
                new URLSearchParams({
                    page_key: 'terms_and_conditions',
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.success && response.data.data) {
                setTermsContent(response.data.data);
            } else {
                throw new Error('No terms and conditions content available');
            }
        } catch (err) {
            console.error('Error fetching terms and conditions:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load terms and conditions';
            setError(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTermsAndConditions();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                    style={{ zIndex: 9999 }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                <h4>Error loading terms and conditions</h4>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchTermsAndConditions}>
                    Try Again
                </button>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                    style={{ zIndex: 9999 }}
                />
            </div>
        );
    }

    return (
        <>
            <div className="main-section">
                <section className="page-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="pagebanner-text">
                                    <h1>{termsContent?.heading || 'Terms & Conditions'}</h1>
                                    {termsContent?.sub_heading && <p>{termsContent.sub_heading}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="terms-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="inner-content">
                                    {termsContent?.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: termsContent.content }} />
                                    ) : (
                                        <p>No content available at this time.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
                style={{ zIndex: 9999 }}
            />
        </>
    );
};

export default TermsCondition;
