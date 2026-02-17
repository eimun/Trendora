import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {isRegister ? 'Sign Up' : 'Login'} to Trendora
                </h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mb-4 border rounded"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-4 border rounded"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white p-3 rounded font-semibold hover:bg-purple-700"
                    >
                        {isRegister ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-purple-600 hover:underline"
                    >
                        {isRegister ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
