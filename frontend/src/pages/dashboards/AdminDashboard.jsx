import { useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, BarChart3, LogOut } from 'lucide-react'

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8447/api/stats/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <BookOpen size={32} />
          <h2>EduFlow Admin</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user.firstName}</span>
          <button onClick={onLogout} className="btn btn-sm"><LogOut size={16} /> Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={32} />
            <div>
              <h3>{stats.total_students || 0}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap size={32} />
            <div>
              <h3>{stats.total_teachers || 0}</h3>
              <p>Total Teachers</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen size={32} />
            <div>
              <h3>{stats.total_classes || 0}</h3>
              <p>Total Classes</p>
            </div>
          </div>
          <div className="stat-card">
            <BarChart3 size={32} />
            <div>
              <h3>{stats.total_subjects || 0}</h3>
              <p>Subjects</p>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>Students</button>
          <button className={activeTab === 'teachers' ? 'active' : ''} onClick={() => setActiveTab('teachers')}>Teachers</button>
          <button className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>Classes</button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h3>System Overview</h3>
              <p>Manage your entire school from this dashboard. Use the tabs above to access different sections.</p>
            </div>
          )}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'classes' && <ClassManagement />}
        </div>
      </div>
    </div>
  )
}

function StudentManagement() {
  return <div className="section"><h3>Student Management</h3><p>Student list and enrollment management coming soon...</p></div>
}

function TeacherManagement() {
  return <div className="section"><h3>Teacher Management</h3><p>Teacher management interface coming soon...</p></div>
}

function ClassManagement() {
  return <div className="section"><h3>Class Management</h3><p>Class management interface coming soon...</p></div>
}
