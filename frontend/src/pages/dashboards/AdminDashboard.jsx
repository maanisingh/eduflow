import { useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, BarChart3, LogOut, Plus, Edit2, Trash2, X, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchAnalytics()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(window.location.origin + '/api/stats/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(window.location.origin + '/api/analytics/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
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
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Analytics</button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>Students</button>
          <button className={activeTab === 'teachers' ? 'active' : ''} onClick={() => setActiveTab('teachers')}>Teachers</button>
          <button className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>Classes</button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && <AnalyticsDashboard analytics={analytics} />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'classes' && <ClassManagement />}
        </div>
      </div>
    </div>
  )
}

function AnalyticsDashboard({ analytics }) {
  if (!analytics) return <div className="loading">Loading analytics...</div>

  const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

  return (
    <div className="analytics-container">
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Student Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.performanceDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(analytics.performanceDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Average Marks by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.subjectAverages || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#7c3aed" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Class Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.classTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#7c3aed" strokeWidth={2} name="Average Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.attendanceStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance_rate" fill="#10b981" name="Attendance Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="insights-section">
        <h3><TrendingUp size={24} /> Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <Activity size={20} />
            <div>
              <h4>Top Performing Subject</h4>
              <p>{analytics.topSubject?.name || 'N/A'} ({analytics.topSubject?.average || 0}%)</p>
            </div>
          </div>
          <div className="insight-card">
            <Activity size={20} />
            <div>
              <h4>Overall Pass Rate</h4>
              <p>{analytics.passRate || 0}%</p>
            </div>
          </div>
          <div className="insight-card">
            <Activity size={20} />
            <div>
              <h4>Average Attendance</h4>
              <p>{analytics.avgAttendance || 0}%</p>
            </div>
          </div>
          <div className="insight-card">
            <Activity size={20} />
            <div>
              <h4>Students at Risk</h4>
              <p>{analytics.studentsAtRisk || 0} students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentManagement() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', gradeLevel: ''
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(window.location.origin + '/api/users?role=student', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingStudent
        ? `${window.location.origin}/api/users/${editingStudent.id}`
        : `${window.location.origin}/api/users`

      const response = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, role: 'student' })
      })

      if (response.ok) {
        fetchStudents()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${window.location.origin}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      email: student.email,
      firstName: student.first_name,
      lastName: student.last_name,
      gradeLevel: student.grade_level || '',
      password: ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingStudent(null)
    setFormData({ email: '', password: '', firstName: '', lastName: '', gradeLevel: '' })
  }

  if (loading) return <div className="loading">Loading students...</div>

  return (
    <div className="management-section">
      <div className="section-header">
        <h3>Student Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add Student
        </button>
      </div>

      <div className="table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Grade Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.first_name} {student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.grade_level || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${student.is_active ? 'active' : 'inactive'}`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(student)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(student.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {editingStudent && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingStudent}
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  required
                >
                  <option value="">Select Grade</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update' : 'Create'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TeacherManagement() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', subject: ''
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(window.location.origin + '/api/users?role=teacher', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingTeacher
        ? `${window.location.origin}/api/users/${editingTeacher.id}`
        : `${window.location.origin}/api/users`

      const response = await fetch(url, {
        method: editingTeacher ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, role: 'teacher' })
      })

      if (response.ok) {
        fetchTeachers()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving teacher:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${window.location.origin}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchTeachers()
      }
    } catch (error) {
      console.error('Error deleting teacher:', error)
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      email: teacher.email,
      firstName: teacher.first_name,
      lastName: teacher.last_name,
      subject: teacher.subject || '',
      password: ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingTeacher(null)
    setFormData({ email: '', password: '', firstName: '', lastName: '', subject: '' })
  }

  if (loading) return <div className="loading">Loading teachers...</div>

  return (
    <div className="management-section">
      <div className="section-header">
        <h3>Teacher Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add Teacher
        </button>
      </div>

      <div className="table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.first_name} {teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${teacher.is_active ? 'active' : 'inactive'}`}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(teacher)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(teacher.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {editingTeacher && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingTeacher}
                />
              </div>
              <div className="form-group">
                <label>Subject Specialization</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTeacher ? 'Update' : 'Create'} Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '', gradeLevel: '', section: '', academicYear: new Date().getFullYear()
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(window.location.origin + '/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingClass
        ? `${window.location.origin}/api/classes/${editingClass.id}`
        : `${window.location.origin}/api/classes`

      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchClasses()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${window.location.origin}/api/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchClasses()
      }
    } catch (error) {
      console.error('Error deleting class:', error)
    }
  }

  const handleEdit = (cls) => {
    setEditingClass(cls)
    setFormData({
      name: cls.name,
      gradeLevel: cls.grade_level,
      section: cls.section || '',
      academicYear: cls.academic_year
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingClass(null)
    setFormData({ name: '', gradeLevel: '', section: '', academicYear: new Date().getFullYear() })
  }

  if (loading) return <div className="loading">Loading classes...</div>

  return (
    <div className="management-section">
      <div className="section-header">
        <h3>Class Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add Class
        </button>
      </div>

      <div className="class-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card">
            <h4>{cls.name}</h4>
            <p>Grade: {cls.grade_level}</p>
            <p>Section: {cls.section || 'N/A'}</p>
            <p>Year: {cls.academic_year}</p>
            <div className="card-actions">
              <button className="btn-icon" onClick={() => handleEdit(cls)}>
                <Edit2 size={16} />
              </button>
              <button className="btn-icon danger" onClick={() => handleDelete(cls.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
              <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics 10A"
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  required
                >
                  <option value="">Select Grade</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input
                  type="number"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Update' : 'Create'} Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
