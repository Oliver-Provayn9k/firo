"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    const res = await fetch("/api/protected/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, recaptchaToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful!");
    router.push("/protected/login"); // môžeš zmeniť na '/access' ak chceš login len tam
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 flex flex-col items-center">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 bg-orange-500 text-white placeholder-white text-center rounded-lg text-xl"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-orange-500 text-white placeholder-white text-center rounded-lg text-xl"
          required
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 bg-orange-500 text-white placeholder-white text-center rounded-lg text-xl"
          required
        />

        <div className="w-full flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        {error && <p className="text-red-500 text-center text-lg w-full">{error}</p>}
        <button
          type="submit"
          className="w-full p-4 bg-orange-500 rounded-lg text-white font-bold text-xl text-center"
        >
          Register
        </button>
      </form>
    </div>
  );
}

