# Wordy Server

The Wordy Server is the backend server for the Wordy application. It provides API endpoints for the Wordy frontend to interact with. The server is developed using TypeScript and the Hapi framework.

## Prerequisites
Before running the Wordy Server, make sure you have the following dependencies set up:
- Node.js and npm installed on your system.
- PostgreSQL database (e.g., pgAdmin) set up with a database named 'wordydb' and a Postgres user with the username 'postgres' and password '1337'. The database should be running on the default PostgreSQL port, 5432.

## Installation and Running the Server
1. Clone the Wordy Server repository from GitHub.
2. Open a terminal and navigate to the project directory.
3. Run `npm install` to install the required dependencies.
4. Run `npm run dev` to start the server in development mode.
5. If the server starts successfully, you should see the message "Server running at: http://localhost:1344" in the console.

## Documentation
The Wordy Server API documentation is available at the '/docs' endpoint. However, many endpoints require authentication using a JWT token obtained after user login. You can explore the documentation to understand the available endpoints and their functionality.
