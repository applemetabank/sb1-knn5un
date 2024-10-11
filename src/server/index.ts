import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user info
app.get('/api/user', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student routes
app.get('/api/student/courses', authenticateToken, async (req: any, res) => {
  try {
    const courses = await prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: { course: { include: { teacher: { include: { user: true } } } } },
    });
    res.json(courses.map(enrollment => ({
      id: enrollment.course.id,
      name: enrollment.course.name,
      teacherName: enrollment.course.teacher.user.name,
    })));
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/student/attendance', authenticateToken, async (req: any, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.user.id },orderBy: { date: 'desc' },
      take: 10,
    });
    res.json(attendance.map(record => ({
      date: record.date.toISOString().split('T')[0],
      present: record.present,
    })));
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher routes
app.get('/api/teacher/courses', authenticateToken, async (req: any, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: req.user.id },
      include: { enrollments: true },
    });
    res.json(courses.map(course => ({
      id: course.id,
      name: course.name,
      studentCount: course.enrollments.length,
    })));
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/teacher/upcoming-classes', authenticateToken, async (req: any, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const schedules = await prisma.schedule.findMany({
      where: {
        course: { teacherId: req.user.id },
        dayOfWeek: { in: [1, 2, 3, 4, 5] }, // Assuming classes are on weekdays
      },
      include: { course: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    const upcomingClasses = schedules.map(schedule => {
      const classDate = new Date(today);
      classDate.setDate(today.getDate() + (schedule.dayOfWeek + 7 - today.getDay()) % 7);
      return {
        id: schedule.id,
        courseName: schedule.course.name,
        date: classDate.toISOString().split('T')[0],
        time: schedule.startTime,
      };
    }).filter(class_ => new Date(class_.date) <= nextWeek);

    res.json(upcomingClasses);
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/user-count', authenticateToken, async (req: any, res) => {
  try {
    const userCount = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });
    const counts = {
      students: 0,
      teachers: 0,
      admins: 0,
    };
    userCount.forEach(count => {
      counts[count.role.toLowerCase() as keyof typeof counts] = count._count.role;
    });
    res.json(counts);
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/recent-courses', authenticateToken, async (req: any, res) => {
  try {
    const recentCourses = await prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: { include: { user: true } },
        enrollments: true,
      },
    });
    res.json(recentCourses.map(course => ({
      id: course.id,
      name: course.name,
      teacherName: course.teacher.user.name,
      studentCount: course.enrollments.length,
    })));
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});