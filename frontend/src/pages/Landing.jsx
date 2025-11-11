import { Link } from 'react-router-dom'
import { BookOpen, Users, BarChart3, Award } from 'lucide-react'

export default function Landing({ user }) {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <BookOpen size={32} />
            <h1>EduFlow</h1>
          </div>
          <div className="nav-links">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Modern School Management Platform</h1>
            <p className="hero-subtitle">
              Streamline your school's operations with EduFlow - comprehensive student information system
              designed for teachers, students, and administrators.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn btn-large btn-primary">Get Started</Link>
              <a href="#features" className="btn btn-large btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Users size={48} />
              <h3>Student Management</h3>
              <p>Easily manage student records, enrollments, and track academic progress all in one place.</p>
            </div>
            <div className="feature-card">
              <BookOpen size={48} />
              <h3>Class Organization</h3>
              <p>Create and manage classes, assign teachers, and organize your curriculum efficiently.</p>
            </div>
            <div className="feature-card">
              <BarChart3 size={48} />
              <h3>Performance Analytics</h3>
              <p>Track student performance with detailed analytics, reports, and visualization tools.</p>
            </div>
            <div className="feature-card">
              <Award size={48} />
              <h3>Grades & Marks</h3>
              <p>Record and manage student grades, assessments, and generate comprehensive report cards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="roles">
        <div className="container">
          <h2 className="section-title">Built for Everyone</h2>
          <div className="roles-grid">
            <div className="role-card">
              <h3>For Administrators</h3>
              <ul>
                <li>Manage all school operations</li>
                <li>Oversight of teachers and students</li>
                <li>Generate reports and analytics</li>
                <li>System-wide configuration</li>
              </ul>
            </div>
            <div className="role-card">
              <h3>For Teachers</h3>
              <ul>
                <li>Manage your classes</li>
                <li>Enter and track student marks</li>
                <li>View class performance</li>
                <li>Communicate with students</li>
              </ul>
            </div>
            <div className="role-card">
              <h3>For Students</h3>
              <ul>
                <li>View your grades and progress</li>
                <li>Access class materials</li>
                <li>Track attendance</li>
                <li>Download reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 EduFlow by AlexandraTechLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
