import React, { useState, useEffect } from 'react';
import config from "../../config/config"; 


const FaqSection = ({ relatedTo = 'All' }) => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch FAQ data from the API based on relatedTo prop
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.baseURL}/site-content/faqs/get?related_to=${encodeURIComponent(relatedTo)}`);
                const data = await response.json();
                if (data.success) {
                    setFaqs(data.data || []);
                } else {
                    setError(data.message || 'Failed to fetch FAQs');
                }
            } catch (error) {
                console.error('Error fetching FAQs:', error);
                setError('An error occurred while fetching FAQs');
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, [relatedTo]);

    return (
        <div className="faq-inner">
                                {loading ? (
                                    <p>Loading FAQs...</p>
                                ) : error ? (
                                    <p className="text-danger">{error}</p>
                                ) : faqs.length === 0 ? (
                                    <p>No FAQs available for this category.</p>
                                ) : (
                                    <div className="accordion" id="faqAccordion">
                                        {faqs.map((faq, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={`heading${index}`}>
                                                    <button
                                                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse${index}`}
                                                        aria-expanded={index === 0 ? 'true' : 'false'}
                                                        aria-controls={`collapse${index}`}
                                                    >
                                                        {faq.question}
                                                    </button>
                                                </h2>
                                                <div
                                                    id={`collapse${index}`}
                                                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                                    aria-labelledby={`heading${index}`}
                                                    data-bs-parent="#faqAccordion"
                                                >
                                                    <div className="accordion-body">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
    );
};

export default FaqSection;