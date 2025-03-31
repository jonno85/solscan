# Solana Explorer

A blockchain explorer for the Solana network, similar to Solscan.io.
Dummy docker configuration including secret just for demonstration purposes.

## Features

- Block explorer
- Transaction details viewer
- Account information
- Token tracking
- Real-time updates

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your Solana RPC endpoint in `config/default.json`
   Secrets are in plain text only for demo purposes

4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Technologies Used

- Backend: Node.js, Express, MongoDB
- Frontend: React, Bootstrap
- Solana: web3.js, SPL Token libraries
