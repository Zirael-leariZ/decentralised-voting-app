# Decentralised Voting App

A blockchain-based decentralised voting application that enables secure, transparent, and tamper-proof voting using Ethereum smart contracts. The application features user authentication, poll creation, and real-time vote tracking with MetaMask wallet integration.

## Features

- 🔐 **Secure Authentication**: JWT-based user authentication system
- 🗳️ **Poll Creation**: Create custom polls with multiple options and expiration dates
- ⛓️ **Blockchain Integration**: Votes are recorded on the Ethereum blockchain for transparency
- 🦊 **MetaMask Integration**: Connect with MetaMask for wallet-based voting
- 📊 **Real-time Results**: View poll results in real-time
- ⏰ **Automated Poll Management**: Automatic poll termination using cron jobs
- 📧 **Email Verification**: Email-based access verification using vlayer proofs
- ⛽ **Gas Faucet**: Built-in gas faucet for testing purposes

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Ethers.js / Web3.js** - Ethereum blockchain interaction
- **Wagmi** - React hooks for Ethereum
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **MetaMask Detect Provider** - Wallet detection

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks

### Smart Contracts
- **Solidity ^0.8.0** - Smart contract language
- **Foundry** - Development framework
- **Hardhat** - Testing and deployment
- **vlayer** - Zero-knowledge proof infrastructure

## Project Structure

```
decentralised-voting-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Application pages
│   │   ├── providers/       # Route and app providers
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── Server app/              # Backend server application
│   ├── api/                 # Blockchain API routes
│   │   ├── abi/            # Contract ABIs
│   │   ├── routes/         # API route handlers
│   │   └── utils/          # Contract utilities
│   ├── contracts/           # Solidity smart contracts
│   │   ├── VotingFactory.sol
│   │   ├── VotingRound.sol
│   │   ├── EmailAccessVerifier.sol
│   │   ├── EmailAccessProver.sol
│   │   └── GasFaucet.sol
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── utilities/           # Helper functions
│   ├── db/                  # Database configuration
│   ├── app.js               # Express app setup
│   └── package.json
│
├── Dockerfile               # Docker container configuration
├── LICENSE                  # MIT License
└── README.md               # This file
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **MetaMask** browser extension
- **Foundry** (for smart contract development)
- **Hardhat** (optional, for testing)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/oishchen42/decentralised-voting-app.git
cd decentralised-voting-app
```

### 2. Install Backend Dependencies

```bash
cd "Server app"
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the `Server app` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/voting-app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_LIFETIME=30d

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=deployed_contract_address
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000
VITE_CHAIN_ID=11155111
```

### 5. Deploy Smart Contracts (Optional)

If you want to deploy your own contracts:

```bash
cd "Server app"
# Using Foundry
forge build
forge script script/Deploy.s.sol --rpc-url <your_rpc_url> --broadcast
```

## Usage

### Starting the Backend Server

```bash
cd "Server app"
npm start
```

The server will start on `http://localhost:4000`

### Starting the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Building for Production

#### Backend
```bash
cd "Server app"
# The backend runs directly with Node.js
node app.js
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## Using Docker

Build and run the application using Docker:

```bash
# Build the Docker image
docker build -t voting-app .

# Run the container
docker run -it --rm voting-app
```

## Smart Contracts

### VotingFactory.sol
The main contract for creating and managing polls. Features:
- Create polls with description, options, and duration
- Cast votes with validation
- Track voter participation
- Automatic expiration handling

### VotingRound.sol
Manages individual voting rounds with enhanced features.

### EmailAccessVerifier.sol & EmailAccessProver.sol
Implements email-based access verification using vlayer zero-knowledge proofs.

### GasFaucet.sol
Provides test tokens for development and testing purposes.

## API Endpoints

### User Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/verify` - Verify JWT token

### Vote Management
- `POST /api/v1/votes/create` - Create a new poll
- `POST /api/v1/votes/vote` - Cast a vote
- `GET /api/v1/votes` - Get all polls
- `GET /api/v1/votes/:id` - Get specific poll details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [vlayer](https://vlayer.xyz) for zero-knowledge proof infrastructure
- Uses [Foundry](https://book.getfoundry.sh/) for smart contract development
- Frontend bootstrapped with [Vite](https://vitejs.dev/)

## Security Considerations

- Never commit your `.env` files or private keys to version control
- Always use environment variables for sensitive information
- Test smart contracts thoroughly before deploying to mainnet
- Keep dependencies up to date for security patches

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

Made with ❤️ for decentralized voting
