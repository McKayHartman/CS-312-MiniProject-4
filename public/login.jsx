import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        user_id: userId,
        password,
      });

      if (response.data.success) {
        setMessage(`Welcome, ${response.data.name}!`);
      } else {
        setMessage("Incorrect username or password.");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error connecting to server.");
    }
  };

  // return form
  return (
    <form onSubmit={handleLogin}>
	{/* username input here */}
      <input
        type="text"
        placeholder="Username"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
	  {/* pswd input here */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
	  {/* TO DO style change for this one so its unique */}
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}
