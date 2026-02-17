import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-2xl font-bold text-purple-600">
                            Trendora
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                📊 Dashboard
                            </Link>
                            <Link
                                to="/gap-analysis"
                                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                🎯 Gap Analysis
                            </Link>
                            <Link
                                to="/predictions"
                                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                🔮 Predictions
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
