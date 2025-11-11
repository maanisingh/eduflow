import { useState, useEffect } from 'react'
import { Users, BookOpen, LogOut } from 'lucide-react'

export default function TeacherDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({})
  const [classes, setClasses] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsRes, classesRes] = await Promise.all([
        fetch(window.location.origin + '/api/stats/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(window.location.origin + '/api/classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      setStats(await statsRes.json())
      setClasses(await classesRes.json())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <BookOpen size={32} />
          <h2>EduFlow Teacher</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user.firstName}</span>
          <button onClick={onLogout} className="btn btn-sm"><LogOut size={16} /> Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <BookOpen size={32} />
            <div>
              <h3>{stats.my_classes || 0}</h3>
              <p>My Classes</p>
            </div>
          </div>
          <div className="stat-card">
            <Users size={32} />
            <div>
              <h3>{stats.my_students || 0}</h3>
              <p>Total Students</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>My Classes</h3>
          <div className="class-grid">
            {classes.map(cls => (
              <div key={cls.id} className="class-card">
                <h4>{cls.name}</h4>
                <p>Grade: {cls.grade_level}</p>
                <p>Students: {cls.student_count}</p>
                <button className="btn btn-sm btn-primary">Open</button>
              </div>
            ))}
            {classes.length === 0 && <p>No classes assigned yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
