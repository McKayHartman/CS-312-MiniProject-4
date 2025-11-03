import {useState} from "react";


export default function Signup() {
	const [userId, setUserId] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("")

	const signUp = async (e) => {
		e.preventDefault();

    // attempt to sign in to backend
		try {
			const response = await axios.post("/signup",{
				user_id: userId,
				name,
				password,
			});
			console.log(response.data);
		} catch (err) {
			console.error(err.response?.data || err.message);
		}
	};


  // return form
return (
    <form onSubmit={handleSignup}>
      {/* user */}
      <input
        type="text"
        placeholder="Username"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
      {/* name?  TO DO check if necessary */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {/* passwrd  */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );

}