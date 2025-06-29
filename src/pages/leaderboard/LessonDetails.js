import React from 'react'

function LessonDetails() {
    return (
        <section className="lesson-details">
            <h2>Lesson Details</h2>
            <div className="skills-container">
                <span className="skill">Learning</span>
                <span className="skill">Speaking</span>
                <span className="skill">Reading</span>
                <span className="skill">Listening</span>
            </div>
            <a href="#" className="view-all">View all</a>
        </section>
    )
}

export default LessonDetails
