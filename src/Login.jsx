import { useState } from "react";
import { db } from "./api/gsheet";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Username dan password wajib diisi!"); return; }
    setLoading(true);
    setError("");
    try {
      const users = await db.getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Username atau password salah!");
      }
    } catch(e) {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Mini ERP</h1>
          <p className="text-gray-400 text-sm mt-1">Silakan login untuk melanjutkan</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Username</label>
            <input
              className="w-full border rounded-lg p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-3">{error}</div>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Mini ERP v9 · PT Contoh Industri
        </div>
      </div>
    </div>
  );
}
