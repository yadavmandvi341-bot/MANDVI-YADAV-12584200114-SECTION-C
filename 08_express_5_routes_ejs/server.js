const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3008;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const courses = [
  { code: 'FSD-101', title: 'HTML5, CSS3 & Responsive Design', credits: 4 },
  { code: 'FSD-102', title: 'Modern JavaScript & DOM APIs', credits: 4 },
  { code: 'FSD-103', title: 'Node.js, Express & Template Engines', credits: 4 },
  { code: 'FSD-104', title: 'MongoDB & RESTful Architecture', credits: 4 }
];

const submissions = [
  { id: 1, name: 'Mandvi Yadav', email: 'mandvi.mca@gla.ac.in', message: 'Lab Task 8 Express + EJS verified!', createdAt: new Date().toLocaleString() }
];

// Route 1: GET /
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', student: 'Mandvi Yadav', courseCount: courses.length, submissionCount: submissions.length });
});

// Route 2: GET /about
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Route 3: GET /courses
app.get('/courses', (req, res) => {
  res.render('courses', { title: 'Courses', courses });
});

// Route 4: POST /courses
app.post('/courses', (req, res) => {
  const { code, title, credits } = req.body;
  if (code && title) {
    courses.push({ code: code.trim(), title: title.trim(), credits: Number(credits) || 3 });
  }
  res.redirect('/courses');
});

// Route 5: GET /contact
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Route 6: POST /contact
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (name && email && message) {
    submissions.unshift({
      id: submissions.length + 1,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toLocaleString()
    });
  }
  res.redirect('/submissions');
});

// Route 7: GET /submissions
app.get('/submissions', (req, res) => {
  res.render('submissions', { title: 'Submissions', submissions });
});

app.listen(PORT, () => {
  console.log(`Task 8 Express + EJS server running at http://localhost:${PORT}`);
});
