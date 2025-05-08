import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Portfolio.css';

const AnimatedPortfolio = () => {
  const yourName = "Shivansh Yadav";
  const canvasRef = useRef(null);
  const contactSectionRef = useRef(null);
  
  // State to track which featured project is being hovered
  const [hoveredFeatured, setHoveredFeatured] = useState(null);
  
  // State to track which secondary project is being hovered
  const [hoveredSecondary, setHoveredSecondary] = useState(null);
  
  // State for theme color
  const [themeColor, setThemeColor] = useState('#b4f1b1');
  
  // State for modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  
  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Use useMemo to memoize the colorPresets array
  const colorPresets = useMemo(() => [
    '#b4f1b1', // Original light green
    '#61dafb', // React blue
    '#f9c74f', // Bright yellow
    '#f94144', // Bright red
    '#90be6d', // Muted green
    '#f8961e', // Orange
    '#c792ea', // Purple
    '#43aa8b', // Teal
    '#ff85a1', // Pink
    '#4cc9f0'  // Cyan
  ], []); // Empty dependency array means this will only be created once
  
  // Set random theme color on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colorPresets.length);
    const selectedColor = colorPresets[randomIndex];
    setThemeColor(selectedColor);
    
    // Apply the selected color to CSS variables
    document.documentElement.style.setProperty('--theme-color', selectedColor);
    
    // Set a complementary darker variation for hover effects
    const darkerColor = adjustColorBrightness(selectedColor, -20);
    document.documentElement.style.setProperty('--theme-color-dark', darkerColor);
    
    // Set a complementary lighter variation
    const lighterColor = adjustColorBrightness(selectedColor, 20);
    document.documentElement.style.setProperty('--theme-color-light', lighterColor);
  }, []); // Empty dependency array - only runs once on mount
  
  // Helper function to adjust color brightness
  const adjustColorBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00FF) + percent;
    const b = (num & 0x0000FF) + percent;
    
    const newR = Math.min(255, Math.max(0, r)).toString(16).padStart(2, '0');
    const newG = Math.min(255, Math.max(0, g)).toString(16).padStart(2, '0');
    const newB = Math.min(255, Math.max(0, b)).toString(16).padStart(2, '0');
    
    return `#${newR}${newG}${newB}`;
  };
  
  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    
    // Animation variables
    let particles = [];
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let radiusScale = 1;
    const RADIUS = 20;
    const QUANTITY = 10; // Increased from 5 to 10 for more particles
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    // Create particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < QUANTITY; i++) {
        particles.push({
          size: 0.1,
          position: { x: mouseX, y: mouseY },
          offset: { x: 0, y: 0 },
          shift: { x: mouseX, y: mouseY },
          speed: 0.01 + Math.random() * 0.04,
          targetSize: 1,
          fillColor: themeColor, // Use the dynamic theme color
          orbit: RADIUS * 0.5 + (RADIUS * 0.5 * Math.random())
        });
      }
    };
    
    // Animation loop
    const loop = () => {
      // Fade effect for trailing
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const lastPosition = { x: particle.position.x, y: particle.position.y };
        
        // Rotation
        particle.offset.x += particle.speed;
        particle.offset.y += particle.speed;
        
        // Follow mouse with lag
        particle.shift.x += (mouseX - particle.shift.x) * particle.speed;
        particle.shift.y += (mouseY - particle.shift.y) * particle.speed;
        
        // Apply position
        particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit * radiusScale);
        particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit * radiusScale);
        
        // Limit to screen bounds
        particle.position.x = Math.max(Math.min(particle.position.x, canvas.width), 0);
        particle.position.y = Math.max(Math.min(particle.position.y, canvas.height), 0);
        
        // Adjust size
        particle.size += (particle.targetSize - particle.size) * 0.05;
        if (Math.round(particle.size) === Math.round(particle.targetSize)) {
          particle.targetSize = 1 + Math.random() * 7;
        }
        
        // Draw particle trail
        context.beginPath();
        context.strokeStyle = themeColor; // Use theme color
        context.lineWidth = particle.size;
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(particle.position.x, particle.position.y);
        context.stroke();
        
        // Draw particle
        context.beginPath();
        context.fillStyle = themeColor; // Use theme color
        context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
        context.fill();
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    createParticles();
    let animationFrameId = requestAnimationFrame(loop);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeColor]);
  
  // Featured projects data
  const featuredProjects = [
    {
      id: 1,
      title: "CodePad – AI-Powered Code Companion",
      description: "A Chrome extension that analyzes code, generates test cases, and offers intelligent feedback for developers.",
      technologies: "JavaScript, Chrome APIs, React, AI Integration",
      longDescription: "CodePad is a developer-focused Chrome extension designed to assist with real-time coding feedback and test generation. It supports intelligent code analysis, generates categorized test cases (easy, medium, hard), and includes a 'talk to code' feature that explains logic in plain language. With real-time mirroring to files or editors, CodePad enhances productivity and learning for developers and students alike.",
      links: {
        github: "https://github.com/JustRookie69",
        live: "https://chromewebstore.google.com/detail/becjmaipmibfklbmnodpglepcapnbkhf?utm_source=item-share-cb",
        // demo: "https://youtu.be/example"
      }
    },
    {
      id: 2,
      title: "BGPDF – Binary Grid PDF Format",
      description: "A C++ console tool for extracting and encoding PDFs into an binary grid format optimized for AI/Ml.",
      technologies: "C++, Poppler, Custom Compression, Grid Encoding",
      longDescription: "BGPDF is a custom document processing framework that converts structured PDFs into a compressed binary grid format optimized for AI/ML tasks. It includes smart layout parsing, image coverage detection, Huffman encoding, and mode-based adaptive compression (e.g., MapMode, TokenMode). Ideal for large-scale document analysis, training data preparation, and government form digitization.",
      links: {
        github: "https://github.com/JustRookie69",
        live: "https://ai-generator.shivanshyadav.com",
        // demo: "https://youtu.be/example2"
      }
    }
  ];
  
  // Secondary projects data
  const secondaryProjects = [
    {
      id: 1,
      title: "Equation Solver",
      description: "A tool that teaches step-by-step solutions to linear and quadratic equations.",
      technologies: "React JS, Go, Firebase",
      longDescription: "This educational web app helps students solve and understand linear and quadratic equations. Users input an equation, and the app displays step-by-step solutions and key concepts. It's built using React for the frontend and Go for the backend, with Firebase managing user sessions and real-time interaction.",
      links: {
        github: "https://github.com/shivanshyadav/equation-solver",  // Update if incorrect
        live: "https://equations.shivanshyadav.com",
        // demo: null
      }
    },
    {
      id: 2,
      title: "Video 2-3D",
      description: "Experimental tool for depth estimation from 2D videos.",
      technologies: "Python, OpenCV, NumPy",
      longDescription: "Video 2-3D is a computer vision project that processes 2D video frames to estimate depth and simulate 3D structures. It uses OpenCV and NumPy for frame extraction, edge detection, and basic stereo disparity simulation. This tool is a stepping stone toward building real-time 3D reconstruction systems from conventional video sources.",
      links: {
        github: "https://github.com/shivanshyadav/video-to-3d",
        live: "https://3dvision.shivanshyadav.com",  // Optional, adjust if needed
        // demo: "https://youtu.be/example3"
      }
    },
    {
      id: 3,
      title: "Smart Classroom Teaching Tool",
      description: "An interactive teaching platform to visualize concepts through movement and physics.",
      technologies: "Python",
      longDescription: "Designed for educators, this tool simulates physics and math concepts using arrows, object motion, and timeline navigation. It features a grid-based canvas and smart object interactions, making it ideal for explaining motion, vectors, and dynamic systems. Built in Python, it supports real-time teaching in both physical and virtual classrooms.",
      links: {
        github: "https://github.com/shivanshyadav/smart-classroom",
        live: "https://smartclass.shivanshyadav.com",
        // demo: null
      }
    },
    {
      id: 4,
      title: "one08 – Interval Training Watch App",
      description: "A smartwatch app for customized interval vibration alerts during workouts.",
      technologies: "Kotlin",
      longDescription: "One08 is a smartwatch utility designed for fitness enthusiasts. It allows users to set vibration alerts that trigger every N seconds for T duration, helping with interval-based workouts, breathing exercises, or focus training. Built natively in Kotlin for Android-based smartwatches.",
      links: {
        github: "https://github.com/shivanshyadav/one08",
        live: null,
        // demo: "https://youtu.be/example4"
      }
    }
  ];

  // About me data
  const aboutMe = {
    image: "/myfolio/me.jpeg",
    bio: "I'm a developer and researcher passionate about blending software engineering with real-world impact. At Physics Wallah, I work on building intelligent systems that support education and research. My projects span AI-powered tools like CodePad, document compression formats like BGPDF for ML pipelines, and interactive platforms like the Smart Classroom Teaching Tool. With a foundation in computer science and a strong inclination toward problem-solving, I enjoy working on high-performance systems, data-centric applications, and experimental projects that push boundaries in ed-tech, AI, and healthcare.",
    skills: [
      "Full-stack Development (React, Node.js, Go)",
      "AI-Powered Tools & LLM Integration",
      "Smart Document Formats & Compression (BGPDF)",
      "Interactive Educational Platforms",
      "Chrome Extension & Productivity Tools",
      "Smartwatch App Development (Kotlin)",
      "C++ Systems Programming & Optimization",
      "Computer Vision & 3D Estimation (OpenCV, NumPy)"
    ],
    education: "BTech in Computer Science, Bennett University (Graduated 2021)",
    experience: "Software Development Engineer at Physics Wallah (2021–Present)"
  };
  

  // Function to open modal with project details
  const openProjectModal = (project, type) => {
    console.log('Opening modal for project:', project.title, 'Type:', type);
    setSelectedProject({...project, type});
    setModalOpen(true);
    // When modal is open, prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };

  // Function to open about modal
  const openAboutModal = () => {
    setAboutModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Function to close about modal
  const closeAboutModal = () => {
    setAboutModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Function to open GitHub confirmation modal
  const openGithubModal = () => {
    setGithubModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Function to close GitHub confirmation modal
  const closeGithubModal = () => {
    setGithubModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Function to navigate to GitHub
  const navigateToGithub = () => {
    window.open("https://github.com/shivanshyadav", "_blank");
    closeGithubModal();
  };

  // Function to scroll to contact section
  const scrollToContact = () => {
    contactSectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Handle contact form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Set submitting state
    setIsSubmitting(true);
    
    try {
      // This would be replaced with your actual API call to the Go backend
      // Example:
      // const response = await fetch('https://your-go-api.com/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Show success message
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({
        submit: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portfolio-container">
      {/* Canvas for particle animation */}
      <canvas ref={canvasRef} className="animation-canvas"></canvas>
      
      {/* Navigation Bar */}
      <header className="nav-header">
        <div className="nav-name">{yourName}</div>
        <nav>
          <ul className="nav-buttons">
            <li><button className="nav-button" onClick={openGithubModal}>Projects</button></li>
            <li><button className="nav-button" onClick={openAboutModal}>About</button></li>
            <li><button className="nav-button" onClick={scrollToContact}>Contact</button></li>
          </ul>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Left Side - Your Name */}
        <div className="left-section">
          <div className="name-container">
            <h1 className="main-name">{yourName}</h1>
            <p className="profession">SDE, Physics Wallah</p>
            <p className="intro-text">
            Passionate developer blending code with real-world impact.
            From AI-ready document formats to intuitive tools for education and medical research.
            </p>
          </div>
        </div>
        
        {/* Right Side - Working Area */}
        <div className="right-section">
          <div className="project-showcase">
            Project showcase area
          </div>
        </div>
      </main>
      
      {/* Featured Projects Section - 2 blocks with hover effect */}
      <section className="featured-projects-section">
        <h2 className="section-title">Featured Projects</h2>
        <div className="featured-projects-container">
          {featuredProjects.map(project => (
            <div 
              key={project.id}
              className={`featured-project-card ${hoveredFeatured === project.id ? 'expanded' : ''} ${hoveredFeatured !== null && hoveredFeatured !== project.id ? 'contracted' : ''}`}
              onMouseEnter={() => setHoveredFeatured(project.id)}
              onMouseLeave={() => setHoveredFeatured(null)}
              onClick={() => openProjectModal(project, 'featured')}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-tech">
                <span className="tech-label">Technologies:</span> {project.technologies}
              </p>
              <button 
                className="view-project-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openProjectModal(project, 'featured');
                }}
              >
                View Project
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Secondary Projects Section - 4 adjacent boxes */}
      <section className="secondary-projects-section">
        <h2 className="section-title">Other Projects</h2>
        <div className="secondary-projects-container">
          {secondaryProjects.map(project => (
            <div 
              key={project.id}
              className={`secondary-project-card ${hoveredSecondary === project.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredSecondary(project.id)}
              onMouseLeave={() => setHoveredSecondary(null)}
              onClick={() => openProjectModal(project, 'secondary')}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-tech">
                <span className="tech-label">Technologies:</span> {project.technologies}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="contact-section" ref={contactSectionRef}>
        <h2 className="section-title">Contact Me</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">shivansh.yadav@example.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">LinkedIn:</span>
              <span className="contact-value">https://www.linkedin.com/in/shivansho1/</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">GitHub:</span>
              <span className="contact-value">https://github.com/JustRookie69</span>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <textarea 
                  name="message"
                  placeholder="Your Message" 
                  className={`form-textarea ${formErrors.message ? 'error' : ''}`}
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
                {formErrors.message && <div className="error-message">{formErrors.message}</div>}
              </div>
              {formErrors.submit && <div className="error-message">{formErrors.submit}</div>}
              {submitSuccess && <div className="success-message">Message sent successfully!</div>}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Project Modal */}
      {modalOpen && selectedProject && (
        <div 
          className="modal-overlay" 
          onClick={closeModal}
        >
          <div 
            className="project-modal" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={closeModal}
            >×</button>
            <h2 className="modal-title">
              {selectedProject.title}
            </h2>
            <div className="modal-content">
              <div className="modal-description">
                <p>{selectedProject.longDescription}</p>
                <div className="modal-tech-stack">
                  <h3>Technologies Used:</h3>
                  <p>{selectedProject.technologies}</p>
                </div>
              </div>
              <div className="modal-links">
                <h3>Project Links</h3>
                <div className="links-container">
                  {selectedProject.links.github && (
                    <a 
                      href={selectedProject.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link github"
                    >
                      GitHub Repository
                    </a>
                  )}
                  {selectedProject.links.live && (
                    <a 
                      href={selectedProject.links.live} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link live"
                    >
                      Live Demo
                    </a>
                  )}
                  {selectedProject.links.demo && (
                    <a 
                      href={selectedProject.links.demo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link video"
                    >
                      Video Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* About Me Modal */}
      {aboutModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={closeAboutModal}
        >
          <div 
            className="project-modal" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={closeAboutModal}
            >×</button>
            <h2 className="modal-title">
              About Me
            </h2>
            <div className="modal-content">
              <div className="modal-description">
                <p>{aboutMe.bio}</p>
                <div className="modal-tech-stack">
                  <h3>Skills:</h3>
                  <ul>
                    {aboutMe.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <h3>Education:</h3>
                  <p>{aboutMe.education}</p>
                  <h3>Experience:</h3>
                  <p>{aboutMe.experience}</p>
                </div>
              </div>
              <div className="modal-links">
                <img 
                  src={aboutMe.image} 
                  alt="Shivansh Yadav" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }} 
                />
                <div className="links-container">
                  <a 
                    href="https://linkedin.com/in/shivanshyadav" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link github"
                    style={{ backgroundColor: '#0077B5' }}
                  >
                    LinkedIn Profile
                  </a>
                  <a 
                    href="https://github.com/JustRookie69" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link github"
                  >
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GitHub Navigation Confirmation Modal */}
      {githubModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={closeGithubModal}
        >
          <div 
            className="project-modal" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '500px' }}
          >
            <button 
              className="modal-close-btn" 
              onClick={closeGithubModal}
            >×</button>
            <h2 className="modal-title">
              Navigate to GitHub
            </h2>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem' }}>
                Would you like to navigate to my GitHub profile to see all my projects?
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button 
                  className="view-project-btn"
                  onClick={navigateToGithub}
                  style={{ 
                    backgroundColor: 'var(--theme-color)',
                    color: '#000',
                    border: 'none'
                  }}
                >
                  Yes, take me there
                </button>
                <button 
                  className="view-project-btn"
                  onClick={closeGithubModal}
                >
                  No, stay here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 {yourName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AnimatedPortfolio;