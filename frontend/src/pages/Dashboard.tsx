import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Poll {
  id: number;
  description: string;
  domain: string;
  options: string[];
  num_participants: number;
  expiration_date: Date;
  status: 'active' | 'completed';
  __v: number;
  total_votes: number;
  winner: string;
  winning_percentage: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [activeVotes, setActiveVotes] = useState<Poll[]>([]);
  const [completedVotes, setCompletedVotes] = useState<Poll[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/votes/getAll')
      .then(response => {
        const active = response.data.activeVotes;
        const completed = response.data.completedVotes;
        
        setActiveVotes(active);
        setCompletedVotes(completed); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // function to handle voting
  const handleVote = async (pollId: number, option: string) => {
    try {
      const response = await axios.post(`/api/votes/${pollId}/vote`, { option });
      alert('Vote casted successfully');
      // Uodate the activeVotes state to reflect the new vote count
      setActiveVotes(prevVotes => prevVotes.map(poll => 
        poll.id === pollId ? { ...poll, total_votes: poll.total_votes + 1 } : poll
      ));
    } catch (error) {
      alert('Error voting: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Voting Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Participate in active polls and review completed voting results
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Polls
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Polls
          </button>
        </div>

        {/* Active Polls Section */}
        {activeTab === 'active' && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Polls</h2>
              <Link to="/create-poll" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create New Poll
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {activeVotes.map((poll) => (
                <div key={poll.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{poll.description}</h3>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Ends on {new Date(poll.expiration_date).toLocaleDateString()}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {poll.num_participants} participants
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {poll.domain}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {poll.options.map((option, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Vote Button */}
                        <div className="mt-4">
                          {new Date(poll.expiration_date) > new Date() && (
                            <button
                              className="py-2 px-4 bg-blue-600 text-white rounded-md"
                              onClick={() => handleVote(poll.id, poll.options[0])}
                            >
                              Vote for {poll.options[0]}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeVotes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No active polls available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Polls Section */}
        {activeTab === 'completed' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Completed Polls</h2>
              <Link to="/create-poll" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create New Poll
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {completedVotes.map((poll) => (
                <Link 
                  key={poll.id} 
                  to={`/results/${poll.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{poll.description}</h3>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Ended on {new Date(poll.expiration_date).toLocaleDateString()}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {poll.total_votes} total votes
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {poll.domain}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-full p-1">
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                Winner: {poll.winner || 'No winner determined'}
                              </p>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${(poll.winning_percentage * 100)}%` }}
                                  ></div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                  {(poll.winning_percentage * 100).toFixed(1)}% of votes
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show message if no completed votes */}
            {completedVotes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed polls available.</p>
              </div>
            )}
          </div>
        )}

        {/* Create Poll Button (Fixed at bottom on mobile) */}
        <div className="sm:hidden fixed bottom-6 right-6">
          <Link to="/create-poll" className="flex items-center justify-center rounded-full w-14 h-14 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
