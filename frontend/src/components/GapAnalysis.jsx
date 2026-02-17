import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_URL } from '../config';

function GapAnalysis() {
    const [competitors, setCompetitors] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [selectedNiche, setSelectedNiche] = useState('tech');
    const [loading, setLoading] = useState(false);

    // Form state
    const [channelId, setChannelId] = useState('');
    const [channelName, setChannelName] = useState('');

    const token = localStorage.getItem('token');

    const fetchCompetitors = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/gaps/list-competitors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompetitors(response.data);
        } catch (error) {
            console.error('Failed to fetch competitors');
        }
    };

    const addCompetitor = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${API_URL}/api/gaps/add-competitor`,
                { channel_id: channelId, channel_name: channelName, niche: selectedNiche },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Competitor added!');
            setChannelId('');
            setChannelName('');
            fetchCompetitors();
        } catch (error) {
            alert('Failed to add competitor');
        }
    };

    const analyzeGaps = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/gaps/analyze`,
                { niche: selectedNiche },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGaps(response.data.gaps);
        } catch (error) {
            alert('Analysis failed');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCompetitors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">🎯 Trend Gap Analysis</h1>

                    {/* Add Competitor Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Track Competitors</h2>
                        <form onSubmit={addCompetitor} className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                placeholder="YouTube Channel ID"
                                value={channelId}
                                onChange={(e) => setChannelId(e.target.value)}
                                className="flex-1 min-w-[200px] p-3 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Channel Name"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                className="flex-1 min-w-[200px] p-3 border rounded"
                                required
                            />
                            <select
                                value={selectedNiche}
                                onChange={(e) => setSelectedNiche(e.target.value)}
                                className="p-3 border rounded"
                            >
                                <option value="tech">Tech</option>
                                <option value="finance">Finance</option>
                                <option value="lifestyle">Lifestyle</option>
                                <option value="health">Health</option>
                            </select>
                            <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">
                                Add
                            </button>
                        </form>

                        {/* Competitors List */}
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Tracked Competitors ({competitors.length}):</h3>
                            <div className="flex flex-wrap gap-2">
                                {competitors.map(comp => (
                                    <span key={comp.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {comp.channel_name} ({comp.niche})
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={analyzeGaps}
                        disabled={loading || competitors.length === 0}
                        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 mb-8"
                    >
                        {loading ? 'Analyzing...' : '🔍 Find Untapped Opportunities'}
                    </button>

                    {/* Gap Results */}
                    {gaps.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">📊 Opportunity Report</h2>
                            <div className="space-y-4">
                                {gaps.map((gap, index) => (
                                    <div key={index} className="border-l-4 border-purple-600 pl-4 py-3 bg-gray-50 rounded">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{gap.keyword}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Volume: {gap.volume?.toLocaleString()} |
                                                    Coverage: {gap.competitor_coverage}/{gap.total_competitors} competitors
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${gap.opportunity === 'High' ? 'bg-green-100 text-green-800' :
                                                gap.opportunity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {gap.opportunity} Opportunity
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-purple-600 h-2 rounded-full"
                                                    style={{ width: `${gap.gap_score * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Gap Score: {gap.gap_score}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GapAnalysis;
