// src/pages/CreateVote.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateVote() {
  const [domain, setDomain] = useState('');
  const [participants, setParticipants] = useState<number>();
  const [options, setOptions] = useState<string[]>(['', '']);
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (options.filter(Boolean).length < 2) {
      alert("At least two options are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/votes/addVote', {
        domain,
        "num_participants" : participants,
        options,
        description,
        "expiration_date": endDate,
      });

      alert("Vote successfully created!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Vote creation error:', error.response?.data?.msg || error.message);
      alert(error.response?.data?.msg || 'Failed to create vote');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new vote
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <input
                id="domain"
                name="domain"
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter domain (e.g. company.com, national)"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter desired description"
              />
            </div>

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Number of participants
              </label>
              <input
                id="participants"
                name="participants"
                type="number"
                min={1}
                required
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter desired number of Participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              {options.map((option, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionField(index)}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                    >
                      -
                    </button>
                  )}
                  {index === options.length - 1 && (
                    <button
                      type="button"
                      onClick={addOptionField}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
			<div>
			<label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
				Ending Date
			</label>
			<input
				id="endDate"
				name="endDate"
				type="date"
				required
        min={new Date().toISOString().split("T")[0]}
				value={endDate}
				onChange={(e) => setEndDate(e.target.value)}
				className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
			</div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Vote
            </button>
          </div>
          <div className="text-center">
            <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
              Back to dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
