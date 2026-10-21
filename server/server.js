const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT id, email, password_hash
       FROM public.users
       WHERE email = $1`,
      [email.trim().toLowerCase()],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: "Login failed",
    });
  }
});

//Sign up route

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        error: "Valid email and password (at least 8 characters) are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO public.users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [normalizedEmail, passwordHash],
    );

    res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("My Daily Task App backend is running!");
});

// GET: Read tasks from PostgreSQL
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");

    res.json(result.rows);
  } catch (error) {
    console.error("GET error:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST: Add a task to PostgreSQL
app.post("/tasks", async (req, res) => {
  console.log("POST route HIT - PostgreSQL INSERT");

  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Task title is required",
      });
    }

    const result = await pool.query(
      "INSERT INTO public.tasks (title) VALUES ($1) RETURNING id, title, completed",
      [title.trim()],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST error:", error.message);
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const result = await pool.query(
      `UPDATE public.tasks
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3
       RETURNING *`,
      [title ?? null, completed ?? null, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PATCH error:", error.message);
    res.status(500).json({
      error: "Failed to update task",
    });
  }
});

//Delete tasks from db
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM public.tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE error:", error.message);

    res.status(500).json({
      error: "Failed to delete task",
    });
  }
});

// Test PostgreSQL connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
