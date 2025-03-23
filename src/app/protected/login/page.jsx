'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ProtectedLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password.trim() || !recaptchaToken) {
      setError('Please complete all fields and the captcha.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/protected/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
      } else {
        router.push('/protected');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 items-center">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 bg-orange-500 text-white placeholder-white text-center rounded-lg text-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 bg-orange-500 text-white placeholder-white text-center rounded-lg text-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={(token) => setRecaptchaToken(token)}
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-orange-500 rounded-lg text-white font-bold text-xl disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}




