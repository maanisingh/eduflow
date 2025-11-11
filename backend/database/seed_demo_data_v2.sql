-- EduFlow Demo Data Seeding Script v2
-- Matches actual database schema

-- Clean existing demo data (keep admin user)
DELETE FROM attendance;
DELETE FROM marks;
DELETE FROM enrollments;
DELETE FROM class_subjects;
DELETE FROM classes;
DELETE FROM users WHERE email NOT LIKE '%@eduflow.com';

-- Insert 10 Teachers with different subjects
INSERT INTO users (email, password_hash, role, first_name, last_name, subject, is_active) VALUES
('john.smith@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'John', 'Smith', 'Mathematics', true),
('sarah.jones@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Sarah', 'Jones', 'English', true),
('david.brown@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'David', 'Brown', 'Life Sciences', true),
('emily.davis@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Emily', 'Davis', 'Physical Sciences', true),
('michael.wilson@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Michael', 'Wilson', 'History', true),
('lisa.taylor@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Lisa', 'Taylor', 'Geography', true),
('james.anderson@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'James', 'Anderson', 'Accounting', true),
('patricia.martin@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Patricia', 'Martin', 'Business Studies', true),
('robert.garcia@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Robert', 'Garcia', 'Life Orientation', true),
('jennifer.rodriguez@eduflow.com', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'teacher', 'Jennifer', 'Rodriguez', 'Afrikaans', true);

-- Insert 60 Students across different grades (Grade 10-12)
INSERT INTO users (email, password_hash, role, first_name, last_name, grade_level, is_active) VALUES
-- Grade 10 Students (20)
('oliver.adams@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Oliver', 'Adams', 10, true),
('emma.baker@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Emma', 'Baker', 10, true),
('noah.clark@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Noah', 'Clark', 10, true),
('ava.davis@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Ava', 'Davis', 10, true),
('liam.evans@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Liam', 'Evans', 10, true),
('sophia.foster@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Sophia', 'Foster', 10, true),
('mason.gray@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Mason', 'Gray', 10, true),
('isabella.harris@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Isabella', 'Harris', 10, true),
('ethan.jackson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Ethan', 'Jackson', 10, true),
('mia.king@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Mia', 'King', 10, true),
('james.lewis@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'James', 'Lewis', 10, true),
('charlotte.moore@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Charlotte', 'Moore', 10, true),
('benjamin.nelson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Benjamin', 'Nelson', 10, true),
('amelia.owen@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Amelia', 'Owen', 10, true),
('lucas.perry@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Lucas', 'Perry', 10, true),
('harper.quinn@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Harper', 'Quinn', 10, true),
('henry.reed@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Henry', 'Reed', 10, true),
('evelyn.scott@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Evelyn', 'Scott', 10, true),
('alexander.turner@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Alexander', 'Turner', 10, true),
('abigail.walker@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Abigail', 'Walker', 10, true),
-- Grade 11 Students (20)
('michael.young@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Michael', 'Young', 11, true),
('emily.allen@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Emily', 'Allen', 11, true),
('daniel.bell@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Daniel', 'Bell', 11, true),
('madison.carter@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Madison', 'Carter', 11, true),
('matthew.dixon@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Matthew', 'Dixon', 11, true),
('elizabeth.ellis@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Elizabeth', 'Ellis', 11, true),
('jackson.ford@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Jackson', 'Ford', 11, true),
('sofia.green@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Sofia', 'Green', 11, true),
('sebastian.hill@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Sebastian', 'Hill', 11, true),
('avery.adams@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Avery', 'Adams', 11, true),
('jack.james@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Jack', 'James', 11, true),
('scarlett.kelly@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Scarlett', 'Kelly', 11, true),
('owen.lopez@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Owen', 'Lopez', 11, true),
('grace.morgan@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Grace', 'Morgan', 11, true),
('wyatt.murphy@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Wyatt', 'Murphy', 11, true),
('chloe.nguyen@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Chloe', 'Nguyen', 11, true),
('luke.parker@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Luke', 'Parker', 11, true),
('victoria.ross@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Victoria', 'Ross', 11, true),
('gabriel.sanders@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Gabriel', 'Sanders', 11, true),
('penelope.taylor@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Penelope', 'Taylor', 11, true),
-- Grade 12 Students (20)
('david.white@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'David', 'White', 12, true),
('lily.brown@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Lily', 'Brown', 12, true),
('joseph.davis@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Joseph', 'Davis', 12, true),
('zoey.wilson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Zoey', 'Wilson', 12, true),
('samuel.martinez@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Samuel', 'Martinez', 12, true),
('hannah.anderson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Hannah', 'Anderson', 12, true),
('john.thomas@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'John', 'Thomas', 12, true),
('natalie.jackson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Natalie', 'Jackson', 12, true),
('carter.harris@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Carter', 'Harris', 12, true),
('aubrey.martin@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Aubrey', 'Martin', 12, true),
('dylan.thompson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Dylan', 'Thompson', 12, true),
('bella.garcia@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Bella', 'Garcia', 12, true),
('isaac.robinson@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Isaac', 'Robinson', 12, true),
('stella.clark@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Stella', 'Clark', 12, true),
('leo.rodriguez@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Leo', 'Rodriguez', 12, true),
('ellie.lewis@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Ellie', 'Lewis', 12, true),
('julian.lee@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Julian', 'Lee', 12, true),
('paisley.walker@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Paisley', 'Walker', 12, true),
('aaron.hall@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Aaron', 'Hall', 12, true),
('aurora.allen@student.edu', '$2b$10$hjqjlXxct3Y7Ogse8hovI.RnoK.2x7a5JpAauixHnvsalSA.nYXCm', 'student', 'Aurora', 'Allen', 12, true);

-- Create Classes (15 classes across grades 10-12)
INSERT INTO classes (name, grade_level, section, academic_year, teacher_id) VALUES
-- Grade 10 Classes
('Mathematics 10A', '10', 'A', '2025', (SELECT id FROM users WHERE email = 'john.smith@eduflow.com')),
('English 10A', '10', 'A', '2025', (SELECT id FROM users WHERE email = 'sarah.jones@eduflow.com')),
('Life Sciences 10A', '10', 'A', '2025', (SELECT id FROM users WHERE email = 'david.brown@eduflow.com')),
('Physical Sciences 10A', '10', 'A', '2025', (SELECT id FROM users WHERE email = 'emily.davis@eduflow.com')),
('History 10A', '10', 'A', '2025', (SELECT id FROM users WHERE email = 'michael.wilson@eduflow.com')),
-- Grade 11 Classes
('Mathematics 11A', '11', 'A', '2025', (SELECT id FROM users WHERE email = 'john.smith@eduflow.com')),
('English 11A', '11', 'A', '2025', (SELECT id FROM users WHERE email = 'sarah.jones@eduflow.com')),
('Life Sciences 11A', '11', 'A', '2025', (SELECT id FROM users WHERE email = 'david.brown@eduflow.com')),
('Accounting 11A', '11', 'A', '2025', (SELECT id FROM users WHERE email = 'james.anderson@eduflow.com')),
('Geography 11A', '11', 'A', '2025', (SELECT id FROM users WHERE email = 'lisa.taylor@eduflow.com')),
-- Grade 12 Classes
('Mathematics 12A', '12', 'A', '2025', (SELECT id FROM users WHERE email = 'john.smith@eduflow.com')),
('English 12A', '12', 'A', '2025', (SELECT id FROM users WHERE email = 'sarah.jones@eduflow.com')),
('Physical Sciences 12A', '12', 'A', '2025', (SELECT id FROM users WHERE email = 'emily.davis@eduflow.com')),
('Business Studies 12A', '12', 'A', '2025', (SELECT id FROM users WHERE email = 'patricia.martin@eduflow.com')),
('Life Orientation 12A', '12', 'A', '2025', (SELECT id FROM users WHERE email = 'robert.garcia@eduflow.com'));

-- Link classes with subjects
INSERT INTO class_subjects (class_id, subject_id) VALUES
-- Grade 10 Classes
((SELECT id FROM classes WHERE name = 'Mathematics 10A'), (SELECT id FROM subjects WHERE name = 'Mathematics')),
((SELECT id FROM classes WHERE name = 'English 10A'), (SELECT id FROM subjects WHERE name = 'English Home Language')),
((SELECT id FROM classes WHERE name = 'Life Sciences 10A'), (SELECT id FROM subjects WHERE name = 'Life Sciences')),
((SELECT id FROM classes WHERE name = 'Physical Sciences 10A'), (SELECT id FROM subjects WHERE name = 'Physical Sciences')),
((SELECT id FROM classes WHERE name = 'History 10A'), (SELECT id FROM subjects WHERE name = 'History')),
-- Grade 11 Classes
((SELECT id FROM classes WHERE name = 'Mathematics 11A'), (SELECT id FROM subjects WHERE name = 'Mathematics')),
((SELECT id FROM classes WHERE name = 'English 11A'), (SELECT id FROM subjects WHERE name = 'English Home Language')),
((SELECT id FROM classes WHERE name = 'Life Sciences 11A'), (SELECT id FROM subjects WHERE name = 'Life Sciences')),
((SELECT id FROM classes WHERE name = 'Accounting 11A'), (SELECT id FROM subjects WHERE name = 'Accounting')),
((SELECT id FROM classes WHERE name = 'Geography 11A'), (SELECT id FROM subjects WHERE name = 'Geography')),
-- Grade 12 Classes
((SELECT id FROM classes WHERE name = 'Mathematics 12A'), (SELECT id FROM subjects WHERE name = 'Mathematics')),
((SELECT id FROM classes WHERE name = 'English 12A'), (SELECT id FROM subjects WHERE name = 'English Home Language')),
((SELECT id FROM classes WHERE name = 'Physical Sciences 12A'), (SELECT id FROM subjects WHERE name = 'Physical Sciences')),
((SELECT id FROM classes WHERE name = 'Business Studies 12A'), (SELECT id FROM subjects WHERE name = 'Business Studies')),
((SELECT id FROM classes WHERE name = 'Life Orientation 12A'), (SELECT id FROM subjects WHERE name = 'Life Orientation'));

-- Enroll Grade 10 students
INSERT INTO enrollments (student_id, class_id, enrollment_date, status)
SELECT u.id, c.id, '2025-01-15', 'active'
FROM users u
CROSS JOIN classes c
WHERE u.grade_level = 10 AND c.grade_level = '10' AND u.role = 'student';

-- Enroll Grade 11 students
INSERT INTO enrollments (student_id, class_id, enrollment_date, status)
SELECT u.id, c.id, '2025-01-15', 'active'
FROM users u
CROSS JOIN classes c
WHERE u.grade_level = 11 AND c.grade_level = '11' AND u.role = 'student';

-- Enroll Grade 12 students
INSERT INTO enrollments (student_id, class_id, enrollment_date, status)
SELECT u.id, c.id, '2025-01-15', 'active'
FROM users u
CROSS JOIN classes c
WHERE u.grade_level = 12 AND c.grade_level = '12' AND u.role = 'student';

-- Insert realistic marks for all enrollments
-- Using class_subject_id instead of separate class_id and subject_id
INSERT INTO marks (student_id, class_subject_id, marks_obtained, marks_total, assessment_type, assessment_date)
SELECT
  e.student_id,
  cs.id as class_subject_id,
  CASE
    WHEN random() < 0.20 THEN 80 + floor(random() * 20)  -- 20% Excellent (80-100)
    WHEN random() < 0.50 THEN 70 + floor(random() * 10)  -- 30% Good (70-79)
    WHEN random() < 0.75 THEN 60 + floor(random() * 10)  -- 25% Average (60-69)
    WHEN random() < 0.90 THEN 50 + floor(random() * 10)  -- 15% Below Average (50-59)
    ELSE 30 + floor(random() * 20)                        -- 10% Needs Improvement (30-49)
  END,
  100,
  'Term 1 Test',
  '2025-03-15'
FROM enrollments e
JOIN class_subjects cs ON e.class_id = cs.class_id;

-- Insert attendance records (past 30 days, ~85% attendance rate)
INSERT INTO attendance (student_id, class_id, attendance_date, status)
SELECT
  e.student_id,
  e.class_id,
  CURRENT_DATE - (i || ' days')::interval,
  CASE
    WHEN random() < 0.85 THEN 'present'   -- 85% present
    WHEN random() < 0.95 THEN 'absent'    -- 10% absent
    ELSE 'late'                            -- 5% late
  END
FROM enrollments e
CROSS JOIN generate_series(1, 30) as i;

-- Summary
SELECT
  'Demo Data Seeded Successfully!' as message,
  (SELECT COUNT(*) FROM users WHERE role = 'teacher') as teachers,
  (SELECT COUNT(*) FROM users WHERE role = 'student') as students,
  (SELECT COUNT(*) FROM classes) as classes,
  (SELECT COUNT(*) FROM enrollments) as enrollments,
  (SELECT COUNT(*) FROM marks) as marks_entries,
  (SELECT COUNT(*) FROM attendance) as attendance_records;
