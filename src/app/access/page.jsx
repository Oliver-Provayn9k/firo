'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function AccessPage() {
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification.');
      return;
    }

    const res = await fetch('/api/auth/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError('Invalid password.');
      return;
    }

    router.push('/protected');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 flex flex-col items-center"
      >
        <input
          type="password"
          placeholder="Password"
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

        {error && (
          <p className="text-red-500 text-center text-lg w-full">{error}</p>
        )}

        <button
          type="submit"
          className="w-full p-4 bg-orange-500 rounded-lg text-white font-bold text-xl text-center"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
