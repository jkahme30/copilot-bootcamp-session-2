const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Get all items
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});


// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT,
    tags TEXT,
    completed INTEGER DEFAULT 0,
    subtasks TEXT,
    recurrence TEXT,
    attachments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert some initial data
const initialItems = ['Item 1', 'Item 2', 'Item 3'];
const insertStmt = db.prepare('INSERT INTO items (name) VALUES (?)');

initialItems.forEach(item => {
  insertStmt.run(item);
});

console.log('In-memory database initialized with sample data');

// API Routes

// --- TASKS CRUD & FILTERING ---

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate, priority, tags, completed, subtasks, recurrence, attachments } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }
  const stmt = db.prepare(`INSERT INTO tasks (title, description, dueDate, priority, tags, completed, subtasks, recurrence, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(
    title,
    description || '',
    dueDate || '',
    priority || 'medium',
    tags ? JSON.stringify(tags) : '[]',
    completed ? 1 : 0,
    subtasks ? JSON.stringify(subtasks) : '[]',
    recurrence || '',
    attachments ? JSON.stringify(attachments) : '[]'
  );
  const id = result.lastInsertRowid;
  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(201).json({ ...newTask, tags: JSON.parse(newTask.tags), subtasks: JSON.parse(newTask.subtasks), attachments: JSON.parse(newTask.attachments), completed: !!newTask.completed });
});

// Get all tasks (with optional filtering, sorting, search)
app.get('/api/tasks', (req, res) => {
  let query = 'SELECT * FROM tasks';
  let clauses = [];
  let params = [];
  // Filtering
  if (req.query.completed !== undefined) {
    clauses.push('completed = ?');
    params.push(req.query.completed === 'true' ? 1 : 0);
  }
  if (req.query.priority) {
    clauses.push('priority = ?');
    params.push(req.query.priority);
  }
  // Search
  if (req.query.q) {
    clauses.push('(title LIKE ? OR description LIKE ?)');
    params.push(`%${req.query.q}%`, `%${req.query.q}%`);
  }
  if (clauses.length) {
    query += ' WHERE ' + clauses.join(' AND ');
  }
  // Sorting
  if (req.query.sortBy) {
    const allowed = ['dueDate', 'priority', 'created_at'];
    if (allowed.includes(req.query.sortBy)) {
      query += ` ORDER BY ${req.query.sortBy} ASC`;
    }
  } else {
    query += ' ORDER BY created_at DESC';
  }
  const rows = db.prepare(query).all(...params);
  // Tag filtering
  let result = rows.map(t => ({ ...t, tags: JSON.parse(t.tags), subtasks: JSON.parse(t.subtasks), attachments: JSON.parse(t.attachments), completed: !!t.completed }));
  if (req.query.tag) {
    result = result.filter(t => t.tags.includes(req.query.tag));
  }
  res.json(result);
});

// Get a single task
app.get('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ ...task, tags: JSON.parse(task.tags), subtasks: JSON.parse(task.subtasks), attachments: JSON.parse(task.attachments), completed: !!task.completed });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, dueDate, priority, tags, completed, subtasks, recurrence, attachments } = req.body;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const stmt = db.prepare(`UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, tags = ?, completed = ?, subtasks = ?, recurrence = ?, attachments = ? WHERE id = ?`);
  stmt.run(
    title !== undefined ? title : task.title,
    description !== undefined ? description : task.description,
    dueDate !== undefined ? dueDate : task.dueDate,
    priority !== undefined ? priority : task.priority,
    tags !== undefined ? JSON.stringify(tags) : task.tags,
    completed !== undefined ? (completed ? 1 : 0) : task.completed,
    subtasks !== undefined ? JSON.stringify(subtasks) : task.subtasks,
    recurrence !== undefined ? recurrence : task.recurrence,
    attachments !== undefined ? JSON.stringify(attachments) : task.attachments,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags), subtasks: JSON.parse(updated.subtasks), attachments: JSON.parse(updated.attachments), completed: !!updated.completed });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ ...task, tags: JSON.parse(task.tags), subtasks: JSON.parse(task.subtasks), attachments: JSON.parse(task.attachments), completed: !!task.completed });
});

// Mark task complete/incomplete
app.patch('/api/tasks/:id/complete', (req, res) => {
  const { completed } = req.body;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, req.params.id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags), subtasks: JSON.parse(updated.subtasks), attachments: JSON.parse(updated.attachments), completed: !!updated.completed });
});

app.post('/api/items', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = insertStmt.run(name);
    const id = result.lastInsertRowid;

    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db, insertStmt };