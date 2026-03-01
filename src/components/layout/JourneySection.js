import React from 'react'
import { Link } from 'react-router-dom'

const JourneySection = () => {
    return (
        <>
            <section className="journy-section p-50">
                <div className="container">
                    <div className="journy-inner">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="journy-data">
                                    <div className="cmn-heading">
                                    <h2>Join the Leaders in Study and Work Abroad Guidance</h2>
    <p>
        Ready to take your education or career global? At Studytraveler, we’re here to help you unlock opportunities to study and work abroad. 
    </p>
                                    </div>
                                </div>
                                <div className="header-btn-main">
                                    <Link to="/signup" className="color-btn btn" >
                                        Start Your Journey!
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default JourneySection