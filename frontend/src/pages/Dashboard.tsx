import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock data for demonstration
const mockActivePolls = [
  { id: '1', title: 'Community Governance Proposal', endDate: '2025-06-15', totalVotes: 124, options: ['Option A', 'Option B'] },
  { id: '2', title: 'DAO Treasury Allocation', endDate: '2025-06-20', totalVotes: 89, options: ['Increase funding', 'Maintain current', 'Reduce funding'] },
  { id: '3', title: 'Platform Feature Voting', endDate: '2025-06-18', totalVotes: 156, options: ['New UI', 'Mobile App', 'Analytics Dashboard'] },
  { id: '4', title: 'Token Distribution Model', endDate: '2025-06-22', totalVotes: 67, options: ['Linear vesting', 'Cliff vesting', 'Hybrid model'] },
  { id: '5', title: 'Partnership Selection', endDate: '2025-06-25', totalVotes: 45, options: ['Project Alpha', 'Project Beta', 'Project Gamma'] },
];

const mockCompletedPolls = [
  { id: '6', title: 'Protocol Upgrade Vote', endDate: '2025-05-20', totalVotes: 210, winner: 'Upgrade v2.0', winningPercentage: 68 },
  { id: '7', title: 'Brand Identity Selection', endDate: '2025-05-15', totalVotes: 187, winner: 'Option C', winningPercentage: 52 },
  { id: '8', title: 'Grant Recipient Voting', endDate: '2025-05-10', totalVotes: 153, winner: 'Eco Project', winningPercentage: 45 },
  { id: '9', title: 'Roadmap Prioritization', endDate: '2025-05-05', totalVotes: 198, winner: 'Security Features', winningPercentage: 72 },
  { id: '10', title: 'Community Manager Election', endDate: '2025-04-28', totalVotes: 234, winner: 'Alex Johnson', winningPercentage: 61 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [activeVotes, setActiveVotes] = useState([]);
  const [completedVotes, setCompletedVotes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/votes/getAll')
      .then(response => {
        setActiveVotes(response.data.activeVotes);
        setCompletedVotes(response.data.completedVotes); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
              {mockActivePolls.map((poll) => (
                <Link 
                  key={poll.id} 
                  to={`/poll/${poll.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Ends on {poll.endDate}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {poll.totalVotes} votes
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
              {mockCompletedPolls.map((poll) => (
                <Link 
                  key={poll.id} 
                  to={`/results/${poll.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Ended on {poll.endDate}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {poll.totalVotes} total votes
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
                              <p className="text-sm font-medium text-gray-900">Winner: {poll.winner}</p>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${poll.winningPercentage}%` }}
                                  ></div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{poll.winningPercentage}% of votes</p>
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