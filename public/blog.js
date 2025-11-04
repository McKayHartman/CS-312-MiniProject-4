
function BlogApp() {
	const [posts, setPosts] = React.useState([]);

	const [title, setTitle] = React.useState("");
	const [body, setBody] = React.useState("");
	const [author, setAuthor] = React.useState("");
	// for editing posts
	const [editId, setEditId] = React.useState(null); 

	const [timestamp, setTimestamp] = React.useState(null);


	// Fetch posts on render
	React.useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts(){
		try {
			const response = await fetch("/posts");
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error("Error fetching posts:", error);
		}	
	}

	async function handleSubmit(e){
		e.preventDefault();
		if(!author || !body || !title) return;

		const postData = {
			creator_name: author,
			creator_user_id: 0, // placeholder 
			title,
			body,
			blog_id: 0 //placeholder
		};

		const url = editId ? `/posts/${editId}` : "/posts";
		const method = editId ? "PUT" : "POST";

		await fetch(url, {
			method,
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(postData)
		});

		setAuthor("");
		setBody("");
		setTitle("");
		setEditId(null);

		fetchPosts();
	}

	async function handleDelete(id){
		await fetch(`/posts/${id}`, {
			method: "DELETE"
		});

		fetchPosts();
	}


	return React.createElement(
		"div",
		{ className: "container-fluid" },

		React.createElement(
			"div",
			{ className: "leftDiv" },
			React.createElement(
				"div",
				{ className: "postDisplay", id: "postDisplay" },
				posts.map(post =>
					React.createElement(
						"div",
						{ key: post.blog_id },
						React.createElement("h3", null, post.creator_name),
						React.createElement("h4", null, post.title),
						React.createElement("small", 
							null, 
							post.date_created
								? new Date(post.date_created.replace(" ", "T")).toLocaleString()
								: ""
						),
						React.createElement("p", null, post.body),
						React.createElement(
							"button",
							{ onClick: () => {
								setEditId(post.blog_id);
								setAuthor(post.creator_name);
								setTitle(post.title);
								setBody(post.body);
							} },
							"Edit"
						),
						React.createElement(
							"button",
							{ onClick: () => handleDelete(post.blog_id) },
							"Delete"
						),
						React.createElement("hr", null)
					)
				)
			),
			
		),

		React.createElement(
			"div",
			{ className: "rightDiv" },
			
			React.createElement(
				"form",
				{ onSubmit: handleSubmit, id: "inputForm" },
				React.createElement("input", {
					id: "nameInput",
					placeholder: "Name",
					value: author,
					onChange: (e) => setAuthor(e.target.value)
				}),
				React.createElement("input", {
					id: "titleInput",
					placeholder: "Title",
					value: title,
					onChange: (e) => setTitle(e.target.value)
				}),
				React.createElement("textarea", {
					id: "typingBox",
					placeholder: "Write your blog post here...",
					value: body,
					onChange: (e) => setBody(e.target.value)
				}),
				React.createElement(
					"button",
					{ type: "submit" },
					editId ? "Update Post" : "Submit"
				)
			)
		)
	)
};

