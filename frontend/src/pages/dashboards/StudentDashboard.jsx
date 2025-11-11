import { useState, useEffect } from 'react'
import { BookOpen, Award, BarChart3, LogOut } from 'lucide-react'

export default function StudentDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({})
  const [marks, setMarks] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsRes, marksRes] = await Promise.all([
        fetch(window.location.origin + '/api/stats/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(window.location.origin + '/api/marks', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      setStats(await statsRes.json())
      setMarks(await marksRes.json())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <BookOpen size={32} />
          <h2>EduFlow Student</h2>
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
              <h3>{stats.enrolled_classes || 0}</h3>
              <p>Enrolled Classes</p>
            </div>
          </div>
          <div className="stat-card">
            <BarChart3 size={32} />
            <div>
              <h3>{stats.average_score?.toFixed(1) || 0}%</h3>
              <p>Average Score</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>My Grades</h3>
          <div className="table-container">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, idx) => (
                  <tr key={idx}>
                    <td>{mark.subject_name}</td>
                    <td>{mark.assessment_type}</td>
                    <td>{mark.marks_obtained}/{mark.marks_total}</td>
                    <td>{((mark.marks_obtained / mark.marks_total) * 100).toFixed(1)}%</td>
                    <td>{new Date(mark.assessment_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {marks.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No marks recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
