import React from 'react';

const projects = [
    {
        title: "Course Schedule Generator - Full Stack",
        description: "Built a full-stack Course Schedule Generator using a greedy algorithm to automate timetable creation, ensuring constraint satisfaction and efficiency.",
        tags: ["Java", "React.js", "MySQL"],
        delay: 0
    },
    {
        title: "Resource-Aware Split-Fed Learning - Deep learning",
        description: "Implemented a dynamic layer-splitting strategy in split-fed learning for thin clients, achieving high accuracy on the MNIST dataset with reduced client-side computational load.",
        tags: ["Python", "PyTorch", "NumPy"],
        delay: 100
    }
];

function Projects() {
    return (
        <section id="projects">
            <div className="container">
                <h2 className="reveal-on-scroll">Selected Work</h2>
                <div className="project-grid">
                    {projects.map(project => (
                        <div 
                            key={project.title} 
                            className="project-card reveal-on-scroll" 
                            style={{ transitionDelay: `${project.delay}ms` }}
                        >
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
