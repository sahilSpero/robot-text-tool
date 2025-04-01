  "use client"

  import { useState } from "react";

  export default function Register() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
      e.preventDefault();
      const res = await fetch("/api/roboUser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
       });
       console.log(res , "res")

      // const data = await res.json();
      // setMessage(data.message);
    };

    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  }
