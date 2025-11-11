import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './config/database.js';
import { authenticateToken, authorize } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8447;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'EduFlow API',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await query(
      'SELECT id, email, password_hash, role, first_name, last_name, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is disabled' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, role, first_name, last_name, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Classes endpoints
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    let queryStr = `
      SELECT c.*,
             u.first_name || ' ' || u.last_name as teacher_name,
             COUNT(DISTINCT e.student_id) as student_count
      FROM classes c
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN enrollments e ON c.id = e.class_id AND e.status = 'active'
    `;

    if (req.user.role === 'teacher') {
      queryStr += ' WHERE c.teacher_id = $1';
      const result = await query(queryStr + ' GROUP BY c.id, u.first_name, u.last_name ORDER BY c.grade_level, c.name', [req.user.id]);
      return res.json(result.rows);
    }

    const result = await query(queryStr + ' GROUP BY c.id, u.first_name, u.last_name ORDER BY c.grade_level, c.name', []);
    res.json(result.rows);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/classes', authenticateToken, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { name, grade_level, section, academic_year, teacher_id } = req.body;

    const result = await query(
      'INSERT INTO classes (name, grade_level, section, academic_year, teacher_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, grade_level, section, academic_year, teacher_id || req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Students endpoints
app.get('/api/students', authenticateToken, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { class_id } = req.query;

    let queryStr = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
             c.name as class_name, c.grade_level
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.student_id AND e.status = 'active'
      LEFT JOIN classes c ON e.class_id = c.id
      WHERE u.role = 'student' AND u.is_active = true
    `;

    if (class_id) {
      queryStr += ' AND e.class_id = $1';
      const result = await query(queryStr + ' ORDER BY u.last_name, u.first_name', [class_id]);
      return res.json(result.rows);
    }

    const result = await query(queryStr + ' ORDER BY u.last_name, u.first_name', []);
    res.json(result.rows);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/students', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, class_id } = req.body;

    const hashedPassword = await bcrypt.hash(password || 'student123', 10);

    const userResult = await query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, 'student', first_name, last_name, phone]
    );

    if (class_id) {
      await query(
        'INSERT INTO enrollments (student_id, class_id) VALUES ($1, $2)',
        [userResult.rows[0].id, class_id]
      );
    }

    res.status(201).json(userResult.rows[0]);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Marks endpoints
app.get('/api/marks', authenticateToken, async (req, res) => {
  try {
    const { student_id, class_id } = req.query;

    let queryStr = `
      SELECT m.*,
             s.name as subject_name,
             u.first_name || ' ' || u.last_name as student_name,
             c.name as class_name
      FROM marks m
      JOIN class_subjects cs ON m.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN users u ON m.student_id = u.id
      JOIN classes c ON cs.class_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (req.user.role === 'student') {
      queryStr += ` AND m.student_id = $${paramCount++}`;
      params.push(req.user.id);
    } else if (student_id) {
      queryStr += ` AND m.student_id = $${paramCount++}`;
      params.push(student_id);
    }

    if (class_id) {
      queryStr += ` AND cs.class_id = $${paramCount++}`;
      params.push(class_id);
    }

    const result = await query(queryStr + ' ORDER BY m.assessment_date DESC', params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/marks', authenticateToken, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { student_id, class_subject_id, assessment_type, marks_obtained, marks_total, assessment_date, remarks } = req.body;

    const result = await query(
      'INSERT INTO marks (student_id, class_subject_id, assessment_type, marks_obtained, marks_total, assessment_date, remarks, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [student_id, class_subject_id, assessment_type, marks_obtained, marks_total, assessment_date, remarks, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create mark error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subjects endpoints
app.get('/api/subjects', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM subjects ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Teachers endpoints
app.get('/api/teachers', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, created_at,
              (SELECT COUNT(*) FROM classes WHERE teacher_id = users.id) as class_count
       FROM users
       WHERE role = 'teacher' AND is_active = true
       ORDER BY last_name, first_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/teachers', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);

    const result = await query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, 'teacher', first_name, last_name, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard stats
app.get('/api/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = {};

    if (req.user.role === 'admin') {
      const [students, teachers, classes, subjects] = await Promise.all([
        query('SELECT COUNT(*) FROM users WHERE role = $1 AND is_active = true', ['student']),
        query('SELECT COUNT(*) FROM users WHERE role = $1 AND is_active = true', ['teacher']),
        query('SELECT COUNT(*) FROM classes'),
        query('SELECT COUNT(*) FROM subjects')
      ]);

      stats.total_students = parseInt(students.rows[0].count);
      stats.total_teachers = parseInt(teachers.rows[0].count);
      stats.total_classes = parseInt(classes.rows[0].count);
      stats.total_subjects = parseInt(subjects.rows[0].count);
    } else if (req.user.role === 'teacher') {
      const [classes, students] = await Promise.all([
        query('SELECT COUNT(*) FROM classes WHERE teacher_id = $1', [req.user.id]),
        query('SELECT COUNT(DISTINCT e.student_id) FROM enrollments e JOIN classes c ON e.class_id = c.id WHERE c.teacher_id = $1', [req.user.id])
      ]);

      stats.my_classes = parseInt(classes.rows[0].count);
      stats.my_students = parseInt(students.rows[0].count);
    } else if (req.user.role === 'student') {
      const [classes, marks] = await Promise.all([
        query('SELECT COUNT(*) FROM enrollments WHERE student_id = $1 AND status = $2', [req.user.id, 'active']),
        query('SELECT AVG((marks_obtained / marks_total) * 100) as avg_score FROM marks WHERE student_id = $1', [req.user.id])
      ]);

      stats.enrolled_classes = parseInt(classes.rows[0].count);
      stats.average_score = parseFloat(marks.rows[0].avg_score) || 0;
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== CRUD ENDPOINTS ==========

// Get users by role
app.get('/api/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    let queryText = 'SELECT id, email, first_name, last_name, role, grade_level, subject, is_active, created_at FROM users';
    const params = [];

    if (role) {
      queryText += ' WHERE role = $1';
      params.push(role);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (CRUD)
app.post('/api/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, gradeLevel, subject } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, grade_level, subject) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, role, grade_level, subject, is_active',
      [email, hashedPassword, role, firstName, lastName, gradeLevel || null, subject || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, gradeLevel, subject } = req.body;

    let updateQuery = 'UPDATE users SET email = $1, first_name = $2, last_name = $3, grade_level = $4, subject = $5';
    const params = [email, firstName, lastName, gradeLevel || null, subject || null];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password_hash = $6 WHERE id = $7 RETURNING id, email, first_name, last_name, role, grade_level, subject, is_active';
      params.push(hashedPassword, id);
    } else {
      updateQuery += ' WHERE id = $6 RETURNING id, email, first_name, last_name, role, grade_level, subject, is_active';
      params.push(id);
    }

    const result = await query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
app.delete('/api/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update class
app.put('/api/classes/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gradeLevel, section, academicYear } = req.body;

    const result = await query(
      'UPDATE classes SET name = $1, grade_level = $2, section = $3, academic_year = $4 WHERE id = $5 RETURNING *',
      [name, gradeLevel, section || null, academicYear, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete class
app.delete('/api/classes/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM classes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ANALYTICS ENDPOINTS ==========

// Admin analytics
app.get('/api/analytics/admin', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Performance distribution
    const perfDist = await query(`
      SELECT
        CASE
          WHEN (marks_obtained::float / marks_total * 100) >= 80 THEN 'Excellent'
          WHEN (marks_obtained::float / marks_total * 100) >= 70 THEN 'Good'
          WHEN (marks_obtained::float / marks_total * 100) >= 60 THEN 'Average'
          WHEN (marks_obtained::float / marks_total * 100) >= 50 THEN 'Below Average'
          ELSE 'Needs Improvement'
        END as name,
        COUNT(*) as value
      FROM marks
      GROUP BY name
    `);

    // Subject averages
    const subjectAvg = await query(`
      SELECT
        s.name as subject,
        ROUND(AVG(m.marks_obtained::float / m.marks_total * 100)::numeric, 2) as average
      FROM marks m
      JOIN subjects s ON m.subject_id = s.id
      GROUP BY s.name
      ORDER BY average DESC
    `);

    // Class performance trends
    const classTrends = await query(`
      SELECT
        c.name as class,
        ROUND(AVG(m.marks_obtained::float / m.marks_total * 100)::numeric, 2) as average
      FROM marks m
      JOIN classes c ON m.class_id = c.id
      GROUP BY c.name
      ORDER BY c.name
    `);

    // Attendance stats
    const attendanceStats = await query(`
      SELECT
        c.name as class,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 100 ELSE 0 END)::numeric, 2) as attendance_rate
      FROM attendance a
      JOIN classes c ON a.class_id = c.id
      GROUP BY c.name
      ORDER BY c.name
    `);

    // Top performing subject
    const topSubject = subjectAvg.rows.length > 0 ? {
      name: subjectAvg.rows[0].subject,
      average: parseFloat(subjectAvg.rows[0].average)
    } : null;

    // Overall pass rate (assuming 50% is pass)
    const passRate = await query(`
      SELECT
        ROUND(AVG(CASE WHEN (marks_obtained::float / marks_total * 100) >= 50 THEN 100 ELSE 0 END)::numeric, 2) as pass_rate
      FROM marks
    `);

    // Average attendance
    const avgAttendance = await query(`
      SELECT
        ROUND(AVG(CASE WHEN status = 'present' THEN 100 ELSE 0 END)::numeric, 2) as avg_attendance
      FROM attendance
    `);

    // Students at risk (< 50%)
    const atRisk = await query(`
      SELECT COUNT(DISTINCT student_id) as count
      FROM marks
      WHERE (marks_obtained::float / marks_total * 100) < 50
    `);

    res.json({
      performanceDistribution: perfDist.rows,
      subjectAverages: subjectAvg.rows,
      classTrends: classTrends.rows,
      attendanceStats: attendanceStats.rows,
      topSubject,
      passRate: parseFloat(passRate.rows[0]?.pass_rate || 0),
      avgAttendance: parseFloat(avgAttendance.rows[0]?.avg_attendance || 0),
      studentsAtRisk: parseInt(atRisk.rows[0]?.count || 0)
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EduFlow API running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 http://localhost:${PORT}/api/health`);
});
