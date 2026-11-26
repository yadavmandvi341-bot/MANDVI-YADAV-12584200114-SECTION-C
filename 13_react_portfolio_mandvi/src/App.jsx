import React, { useState } from 'react';
import { portfolioData } from './data/portfolioData';

export default function App() {
  const [filter, setFilter] = useState('All');
  const [sent, setSent] = useState(false);

  const filters = ['All', 'MERN', 'ASP.NET', 'Vue'];
  const filteredProjects = portfolioData.projects.filter((p) => {
    if (filter === 'All') return true;
    return p.stack.toLowerCase().includes(filter.toLowerCase());
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <nav className="nav">
        <strong>{portfolioData.name}</strong>
        <div className="nav-links">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero">
        <h1>Hi, I&apos;m {portfolioData.name}</h1>
        <p className="role">{portfolioData.role}</p>
        <p className="edu">{portfolioData.education} • {portfolioData.location}</p>
        <p>{portfolioData.tagline}</p>
      </header>

      <section id="skills" className="section">
        <h2>Technical Skills</h2>
        <div className="grid">
          {portfolioData.skills.map((group) => (
            <div key={group.category} className="card">
              <h3>{group.category}</h3>
              <div className="tags">
                {group.items.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <h2>Featured Projects</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f}
              className="btn"
              style={{ background: filter === f ? '#7c3aed' : '#312e81', border: '1px solid #4338ca' }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid">
          {filteredProjects.map((proj) => (
            <div key={proj.title} className="card">
              <h3>{proj.title}</h3>
              <span className="stack">{proj.stack}</span>
              <p style={{ color: '#ddd6fe', fontSize: '0.92rem' }}>{proj.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section">
        <h2>Contact Me</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your Name</label>
          <input type="text" placeholder="Recruiter / Faculty Name" required />
          <label>Your Email</label>
          <input type="email" placeholder="email@company.com" required />
          <label>Message</label>
          <textarea rows="4" placeholder="Let's connect..." required />
          <button type="submit" className="btn">Send Message</button>
          {sent && <p style={{ color: '#4ade80', marginTop: '10px' }}>Thank you! Your message has been recorded.</p>}
        </form>
      </section>

      <footer>
        © 2026 {portfolioData.name} • Built with React for Full Stack Development Lab
      </footer>
    </div>
  );
}
