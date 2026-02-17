import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function StyleTrainer() {
    const [styleStatus, setStyleStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const checkStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/style/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStyleStatus(response.data);
        } catch (error) {
            console.error('Failed to check style status');
        }
    };

    const trainStyle = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/style/train`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            checkStatus();
        } catch (error) {
            alert(error.response?.data?.error || 'Training failed');
        }
        setLoading(false);
    };

    const resetStyle = async () => {
        if (!window.confirm('Are you sure you want to reset your style profile?')) return;

        try {
            await axios.post(
                `${API_URL}/api/style/reset`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Style profile reset!');
            checkStatus();
        } catch (error) {
            alert('Reset failed');
        }
    };

    useEffect(() => {
        checkStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">✨ Your Writing Style</h2>

            {styleStatus?.trained ? (
                <div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <p className="font-semibold text-green-800">✅ Style Profile Active</p>
                        <p className="text-sm text-green-700 mt-1">
                            AI will now write in your unique voice!
                        </p>
                    </div>

                    {styleStatus.profile && (
                        <div className="bg-gray-50 p-4 rounded mb-4">
                            <h3 className="font-semibold mb-2">Your Style Characteristics:</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Tone:</strong> {styleStatus.profile.tone}</div>
                                <div><strong>Vocabulary:</strong> {styleStatus.profile.vocabulary_level}</div>
                                <div><strong>Humor:</strong> {styleStatus.profile.humor_style}</div>
                                <div><strong>Pacing:</strong> {styleStatus.profile.pacing}</div>
                            </div>
                            {styleStatus.profile.signature_phrases && (
                                <div className="mt-3">
                                    <strong>Signature Phrases:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {styleStatus.profile.signature_phrases.map((phrase, i) => (
                                            <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                                {phrase}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={resetStyle}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Reset Style Profile
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">
                        Save at least 3 scripts to train your personalized style profile.
                        The AI will then write content that sounds like YOU!
                    </p>
                    <button
                        onClick={trainStyle}
                        disabled={loading}
                        className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Training...' : '🎓 Train My Style'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default StyleTrainer;
