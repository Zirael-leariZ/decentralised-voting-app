import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Poll {
  description: string;
  options: string[];
  total_votes: number;
  winner: string;
  winning_percentage: number;
}

export default function PollResults() {
  const { id } = useParams(); // Get the poll ID from the URL parameters
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/votes/${id}/results`)
      .then(response => {
        setPoll(response.data);
      })
      .catch(error => {
        console.error('Error fetching poll results:', error);
      });
  }, [id]);

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Poll Results</h1>
          <p className="mt-2 text-gray-600">Results for: {poll.description}</p>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Winner: {poll.winner}</h2>
          <div className="mt-4">
            {poll.options.map((option, index) => (
              <div key={index} className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{option}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${poll.winning_percentage}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{poll.winning_percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
