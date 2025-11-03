// Get all doc elements by id into variables

const form = document.getElementById("postSubmissionForm");
const textarea = document.getElementById("typingBox");
const blogTitle = document.getElementById("titleInput")
const authorName = document.getElementById("nameInput")
const postDisplay = document.getElementById("postDisplay");
let editMode = false;

// Event listener for submit button press

form.addEventListener('submit', async function(e) {
  e.preventDefault();

	const creator_name = authorName.value;
	const body = textarea.value;
	const creator_user_id = "0";
	const title = blogTitle.value;


  if (body !== '' && creator_name !== '') {
    const response = await fetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creator_name,
        creator_user_id,
		blog_id: null,
		title,
		body
      }),
    });

    const currentPost = await response.json();

	console.log(currentPost);

	// THis is a bad solution but it works
	if (editMode) {
		// handle edit
		// delete old post
		handleDelete(blog_id);
		editMode = false;
		addPost(currentPost)
		//reset fields
		textarea.value = '';
		blogTitle.value = '';
		authorName.value = '';
		return;
	}
    // add the post
    addPost(currentPost);

    // reset fields
    textarea.value = '';
	blogTitle.value = '';
    authorName.value = '';
  }
});
			
// function adds posts to the DOM
function addPost(post) {
  const postContainer = document.createElement('div');

  // Authorf
  const newAuthor = document.createElement('h3');
  newAuthor.textContent = post.creator_name;
  postContainer.appendChild(newAuthor);

  // Title
  const newTitle = document.createElement('h4');
  newTitle.textContent = post.title;
  postContainer.appendChild(newTitle);

    // Timestamp
  const timestamp = document.createElement('small');
  const stamp = new Date(post.date_created || post.timestamp);
  timestamp.textContent = stamp.toDateString() + " " + stamp.toLocaleTimeString();
  postContainer.appendChild(timestamp);

  // Blog post content
  const newPost = document.createElement('p');
  newPost.innerHTML = post.body.replace(/\n/g, '<br>');
  postContainer.appendChild(newPost);

  // Buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('post-buttons');

  // Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn', 'btn-sm');
  editButton.addEventListener('click', () => {
	editMode = true;
	blog_id = post.blog_id;
    textarea.value = post.body
    authorName.value = post.creator_name;
    postContainer.remove();
  });

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('btn', 'btn-sm');
  deleteButton.addEventListener('click', async () => 
	await handleDelete(post.blog_id) &&
	postContainer.remove());

  // Append buttons
  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(deleteButton);
  postContainer.appendChild(buttonsDiv);

  // Separators
  postContainer.appendChild(document.createElement('br'));
  postContainer.appendChild(document.createElement('hr'));
  postContainer.appendChild(document.createElement('br'));

  // Append to page
  postDisplay.appendChild(postContainer);
}


// Fetch and display existing posts on page load
async function fetchPosts() {
try{
  const response = await fetch("/posts");
  const posts = await response.json();

  // Clear existing posts
  postDisplay.innerHTML = '';

  // Add each post to the DOM
  posts.forEach(post => addPost(post));
} catch (err) {
  console.error("Failed to fetch posts in app.js: ", err);
  console.log(err.message)
	}
}


// dont load untul DOM is ready
document.addEventListener('DOMContentLoaded', fetchPosts);



// handle the delte request from to the backend
const handleDelete = async (blog_id) => {
  try {
	const response = await fetch(`/posts/${blog_id}`, {
	  method: 'DELETE',
	});
	if (response.ok) {
	  console.log('Post deleted');
	  return true;
	}  
	else {
	  	console.error('Failed to delete post');
	  	return false;
	}
	}
	catch (err) {
			console.error('Error deleting post:', err);
			return false;
		}	
};


const handleEdit = async (blog_id) => {
  try {
	const response = await fetch(`/posts/${blog_id}`, {
	  method: 'EDIT',
	});
	if (response.ok) {
	  console.log('Post edited');
	  return true;
	}  
	else {
	  	console.error('Failed to edit post');
	  	return false;
	}
	}
	catch (err) {
			console.error('Error editing post:', err);
			return false;
		}	
}