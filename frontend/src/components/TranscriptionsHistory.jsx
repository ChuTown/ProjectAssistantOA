import { useState, useEffect, useCallback } from 'react';
import './TranscriptionsHistory.css';

const TranscriptionsHistory = ({ username, refreshKey }) => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTranscription, setSelectedTranscription] = useState(null);

  const fetchTranscriptions = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/transcriptions/${username}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTranscriptions(data.transcriptions || []);
    } catch (err) {
      setError('Error fetching transcriptions: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchTranscriptions();
    }
  }, [username, refreshKey, fetchTranscriptions]);

  const viewTranscription = async (transcriptionId) => {
    try {
      const response = await fetch(`http://localhost:5000/transcription/${transcriptionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const transcription = await response.json();
      setSelectedTranscription(transcription);
    } catch (err) {
      setError('Error fetching transcription details: ' + err.message);
    }
  };

  const closeTranscription = () => {
    setSelectedTranscription(null);
  };

  const deleteTranscription = async (transcriptionId) => {
    if (!window.confirm('Are you sure you want to delete this transcription? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/transcription/${transcriptionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Remove from local state and refresh
      setTranscriptions(prev => prev.filter(t => t.id !== transcriptionId));
      
      // Close modal if it was open for this transcription
      if (selectedTranscription && selectedTranscription.id === transcriptionId) {
        setSelectedTranscription(null);
      }
      
      // Show success message (optional)
      console.log('Transcription deleted successfully');
      
    } catch (err) {
      setError('Error deleting transcription: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown duration';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="transcriptions-history">
        <h3>Loading your transcriptions...</h3>
      </div>
    );
  }

  return (
    <div className="transcriptions-history">
      <div className="history-header">
        <h3>Your Transcription History</h3>
        <button onClick={fetchTranscriptions} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {transcriptions.length === 0 ? (
        <div className="no-transcriptions">
          <p>No transcriptions found. Start recording to create your first one!</p>
        </div>
      ) : (
        <div className="transcriptions-list">
          {transcriptions.map((transcription) => (
            <div key={transcription.id} className="transcription-item">
              <div className="transcription-preview">
                <div className="transcription-text">
                  {transcription.text.length > 100 
                    ? transcription.text.substring(0, 100) + '...' 
                    : transcription.text
                  }
                </div>
                <div className="transcription-meta">
                  <span className="duration">⏱️ {formatDuration(transcription.duration)}</span>
                  <span className="language">🌐 {transcription.language || 'Unknown'}</span>
                  <span className="date">📅 {formatDate(transcription.created_at)}</span>
                </div>
              </div>
              <button 
                onClick={() => viewTranscription(transcription.id)}
                className="view-btn"
              >
                View Full
              </button>
              <button 
                onClick={() => deleteTranscription(transcription.id)}
                className="delete-btn"
                title="Delete transcription"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full transcription */}
      {selectedTranscription && (
        <div className="transcription-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Full Transcription</h3>
              <div className="modal-actions">
                <button 
                  onClick={() => deleteTranscription(selectedTranscription.id)}
                  className="delete-btn"
                  title="Delete transcription"
                >
                  🗑️ Delete
                </button>
                <button onClick={closeTranscription} className="close-btn">
                  ✕
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="full-transcription-text">
                {selectedTranscription.text}
              </div>
              <div className="transcription-details">
                <div className="detail-item">
                  <strong>Duration:</strong> {formatDuration(selectedTranscription.duration)}
                </div>
                <div className="detail-item">
                  <strong>Words:</strong> {selectedTranscription.words?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionsHistory;
