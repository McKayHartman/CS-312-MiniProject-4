///////////////////////  SERVER  //////////////////////////////////////
import express from "express" 
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

////////////////////// DATABASE /////////////////////////////////////
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'blog_app',
	password: '1234',
	port: 5432,
});



// API ROUTES
/////////////// GET the blogs from the database
app.get("/posts", async (req, res) =>{
	try{
		const result = await pool.query("SELECT * FROM posts ORDER BY date_created DESC");
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch posts in GET request from db"})
	}
}) ;

/////////////// POST the blogs onto the database
app.post("/posts", async (req, res) => {
	const { creator_name, creator_user_id, title, body } = req.body;
	try{
		const result = await pool.query(
			"INSERT INTO posts (creator_name, creator_user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING *",
			[creator_name, creator_user_id, title, body]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: err.message });
	}
});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));


// LOGIN
let isLoggedIn = false;

app.get("/", (req, res) => {
  if (isLoggedIn) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});


app.use(express.static(path.join(__dirname, '../public')));


// login submission handling
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send("Missing username or password. <a href='/'>Try again</a>");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      
	  // logged in var is set to true to allow access to main app
      isLoggedIn = true;
      res.redirect("/"); 
    } else {
      res.send("Invalid credentials. <a href='/'>Try again</a>");
    }
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).send("Server error. <a href='/'>Try again</a>");
  }
});


// REGISTER path
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/create_account.html'));
});


app.post("/register", async (req, res) => {
  console.log("Incoming registration:", req.body); // <-- debug
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing username or password. <a href='/register'>Try again</a>");
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (user_id, password) VALUES ($1, $2) RETURNING *",
      [username, password]
    );

    res.send("Registration successful. <a href='/'>Login here</a>");
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).send("Error registering user. <a href='/register'>Try again</a>");
  }
});

// LOGOUT path
app.get("/logout", (req, res) => {
  isLoggedIn = false;
  res.redirect("/");
});




// DELTETE (blog psot) --  this is for the delte button in the frontend app.jsx
app.delete("/posts/:blog_id", async (req, res) => {
	const {blog_id} = req.params;
	try{
		const result = await pool.query("DELETE FROM posts WHERE blog_id = $1", [blog_id]);
		res.json({message: "Post deleted"});
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to delete post"});
	}
});

// EDIT (blog post) --  this is from the edit button in the front end app.jsx
app.put("/posts/:blog_id", async (req, res) => {
	const {blog_id} = req.params;
	const { title, body } = req.body;
	try{
		const result = await pool.query(
			"UPDATE posts SET title = $1, body = $2 WHERE blog_id = $3 RETURNING *",
			[title, body, blog_id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to edit post"});
	}
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
