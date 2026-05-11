"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  // STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      // LOGIN GAGAL
      if (!result.success) {
        alert(result.message);
        return;
      }

      // SIMPAN USER KE LOCAL STORAGE
      localStorage.setItem("user", JSON.stringify(result.user));

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-purple-900/60 to-indigo-900/70" />

          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold leading-tight">
                Dashboard Pojok Statistik
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-purple-100">
                Platform pengelolaan artikel, infografis, dan publikasi
                statistik untuk admin dan mahasiswa.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="flex items-center justify-center p-8 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Login</h1>

              <p className="mt-2 text-sm text-slate-500">
                Masukkan username dan password untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* USERNAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full rounded-xl border border-slate-200 text-slate-700 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-slate-200 text-slate-700 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  Ingat saya
                </label>

                <button
                  type="button"
                  className="font-medium text-purple-700 hover:text-purple-800"
                >
                  Lupa password?
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Masuk"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
