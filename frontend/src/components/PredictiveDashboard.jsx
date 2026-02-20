import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_URL } from '../config';

function PredictiveDashboard() {
    const [niches] = useState(['tech', 'finance', 'lifestyle', 'health']);
    const [selectedNiche, setSelectedNiche] = useState('tech');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const fetchPredictions = async (niche, forceRefresh = false) => {
        setLoading(true);

        try {
            let response;

            if (forceRefresh) {
                // Generate new predictions
                response = await axios.post(
                    `${API_URL}/api/predictions/forecast`,
                    { niche },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPredictions(response.data.predictions || []);
            } else {
                // Get cached predictions
                response = await axios.get(
                    `${API_URL}/api/predictions/cached?niche=${niche}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPredictions(response.data || []);
            }
        } catch (error) {
            if (error.response?.status === 400 && !forceRefresh) {
                // Only retry once from cached path — don't recurse if already forcing
                fetchPredictions(niche, true);
            } else if (error.response?.status === 400) {
                // forceRefresh already true — no data available, stop retrying
                setPredictions([]);
            } else {
                alert('Failed to fetch predictions');
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPredictions(selectedNiche);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNiche]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Navbar />
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-2">🔮 Predictive Forecasting</h1>
                        <p className="text-white text-lg">See what will trend before it trends</p>
                    </div>

                    {/* Niche Selector */}
                    <div className="mb-6 flex gap-4 justify-center flex-wrap">
                        {niches.map(niche => (
                            <button
                                key={niche}
                                onClick={() => setSelectedNiche(niche)}
                                className={`px-8 py-4 rounded-lg font-semibold text-lg transition ${selectedNiche === niche
                                    ? 'bg-white text-purple-600 shadow-xl scale-105'
                                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                                    }`}
                            >
                                {niche.charAt(0).toUpperCase() + niche.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Refresh Button */}
                    <div className="text-center mb-6">
                        <button
                            onClick={() => fetchPredictions(selectedNiche, true)}
                            disabled={loading}
                            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 disabled:bg-gray-400"
                        >
                            {loading ? '🔄 Analyzing...' : '⚡ Run Fresh Predictions'}
                        </button>
                    </div>

                    {/* Predictions Grid */}
                    {loading ? (
                        <div className="text-center text-white py-12">
                            <div className="animate-pulse text-2xl">🤖 AI is analyzing trend patterns...</div>
                        </div>
                    ) : predictions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {predictions.map((pred, index) => (
                                <PredictionCard key={index} prediction={pred} rank={index + 1} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-12 text-center text-white">
                            <p className="text-xl mb-4">📊 Building prediction model...</p>
                            <p>We need 3-5 days of historical data to make accurate forecasts.</p>
                            <p className="mt-2">Check back tomorrow!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PredictionCard({ prediction, rank }) {
    const getRecommendationColor = (rec) => {
        if (rec?.includes('🔥')) return 'border-red-500 bg-red-50';
        if (rec?.includes('⚡')) return 'border-orange-500 bg-orange-50';
        if (rec?.includes('📈')) return 'border-blue-500 bg-blue-50';
        if (rec?.includes('⚠️')) return 'border-yellow-500 bg-yellow-50';
        return 'border-gray-500 bg-gray-50';
    };

    const growthColor = prediction.growth_rate > 10 ? 'text-green-600' :
        prediction.growth_rate > 5 ? 'text-blue-600' :
            prediction.growth_rate > 0 ? 'text-gray-600' : 'text-red-600';

    return (
        <div className={`bg-white rounded-lg shadow-xl p-6 border-l-4 ${getRecommendationColor(prediction.recommendation)} hover:shadow-2xl transition relative`}>
            {/* Rank Badge */}
            <div className="absolute top-4 right-4 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {rank}
            </div>

            <h3 className="text-xl font-bold mb-3 pr-10">{prediction.keyword}</h3>

            {/* Current vs Predicted */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500">Current Volume</p>
                    <p className="text-2xl font-bold text-gray-800">{prediction.current_volume?.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Predicted (7d)</p>
                    <p className="text-2xl font-bold text-purple-600">{prediction.predicted_volume_7d?.toLocaleString()}</p>
                </div>
            </div>

            {/* Growth Rate */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Daily Growth Rate</p>
                <p className={`text-3xl font-bold ${growthColor}`}>
                    {prediction.growth_rate > 0 ? '+' : ''}{prediction.growth_rate}%
                </p>
            </div>

            {/* Confidence Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Predicted Peak */}
            <div className="mb-4">
                <p className="text-xs text-gray-500">Predicted Peak Date</p>
                <p className="font-semibold">{prediction.predicted_peak_date ? new Date(prediction.predicted_peak_date).toLocaleDateString() : 'N/A'}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                <p className="text-sm font-semibold">{prediction.recommendation}</p>
            </div>
        </div>
    );
}

export default PredictiveDashboard;
