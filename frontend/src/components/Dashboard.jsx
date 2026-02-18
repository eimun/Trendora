import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import StyleTrainer from './StyleTrainer';
import { API_URL } from '../config';

function Dashboard() {
    const [niches] = useState(['tech', 'finance', 'lifestyle', 'health']);
    const [selectedNiche, setSelectedNiche] = useState('tech');
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrends = async (niche) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/trends/fetch`,
                { niche },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTrends(response.data.trends);
        } catch (error) {
            alert('Failed to fetch trends');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTrends(selectedNiche);
    }, [selectedNiche]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Trending Topics Dashboard</h1>

                    {/* Niche Selector */}
                    <div className="mb-6 flex gap-4">
                        {niches.map(niche => (
                            <button
                                key={niche}
                                onClick={() => setSelectedNiche(niche)}
                                className={`px-6 py-3 rounded-lg font-semibold ${selectedNiche === niche
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {niche.charAt(0).toUpperCase() + niche.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Style Trainer Section */}
                    <div className="mb-8">
                        <StyleTrainer />
                    </div>

                    {/* Trends Grid */}
                    {loading ? (
                        <div className="text-center py-12">Loading trends...</div>
                    ) : trends.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-xl mb-2">No trends found</p>
                            <p>Try selecting a different niche or refresh the page.</p>
                            <button
                                onClick={() => fetchTrends(selectedNiche)}
                                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trends.map((trend, index) => (
                                <TrendCard key={index} trend={trend} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TrendCard({ trend }) {
    const [showGenerator, setShowGenerator] = useState(false);

    // Get color based on virality score
    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-gray-500';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition relative overflow-hidden">
            {/* Virality Score Badge */}
            <div className="absolute top-4 right-4">
                <div className={`${getScoreColor(trend.virality_score)} text-white px-4 py-2 rounded-full font-bold text-lg`}>
                    {trend.virality_score || 0}
                </div>
                <p className="text-xs text-center mt-1 text-gray-500">Virality</p>
            </div>

            <div className="flex justify-between items-start mb-4 pr-20">
                <h3 className="text-xl font-semibold">{trend.keyword}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${trend.velocity === 'rising_fast' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {trend.velocity === 'rising_fast' ? '🔥 Hot' : '📈 Rising'}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-gray-600">Volume: {trend.volume?.toLocaleString()}</p>

                {/* Score Breakdown */}
                {trend.virality_score > 0 && (
                    <div className="mt-3">
                        <div className="bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className={`${getScoreColor(trend.virality_score)} h-2 rounded-full transition-all`}
                                style={{ width: `${trend.virality_score}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                            {trend.virality_score >= 80 ? '🎯 Excellent viral potential' :
                                trend.virality_score >= 60 ? '✅ Good opportunity' :
                                    trend.virality_score >= 40 ? '⚠️ Moderate potential' :
                                        '❌ Low viral chance'}
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={() => setShowGenerator(true)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
                Generate Content
            </button>

            {showGenerator && (
                <ContentGenerator keyword={trend.keyword} onClose={() => setShowGenerator(false)} />
            )}
        </div>
    );
}

function ContentGenerator({ keyword, onClose }) {
    const [script, setScript] = useState(null);
    const [loading, setLoading] = useState(false);
    const [useStyle, setUseStyle] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/generate/script`,
                { keyword, type: 'video', use_style: useStyle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setScript(response.data);
        } catch (error) {
            alert('Generation failed');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Content for: {keyword}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                {/* Style Toggle */}
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="useStyle"
                        checked={useStyle}
                        onChange={(e) => setUseStyle(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="useStyle" className="text-sm">
                        ✨ Use My Writing Style
                    </label>
                </div>

                {!script && !loading ? (
                    <button
                        onClick={handleGenerate}
                        className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
                    >
                        Generate Content
                    </button>
                ) : loading ? (
                    <div className="text-center py-12">Generating content...</div>
                ) : script ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Hook:</h3>
                            <p className="bg-gray-100 p-4 rounded">{script.script?.hook}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Body:</h3>
                            <p className="bg-gray-100 p-4 rounded">{script.script?.body}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Call to Action:</h3>
                            <p className="bg-gray-100 p-4 rounded">{script.script?.cta}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Alternative Hooks:</h3>
                            <div className="space-y-2">
                                {script.hooks?.map((hook, i) => (
                                    <p key={i} className="bg-blue-50 p-3 rounded">{hook}</p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Hashtags:</h3>
                            <p className="text-blue-600">{script.hashtags?.join(' ')}</p>
                        </div>

                        <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
                            Save to Calendar
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Dashboard;
