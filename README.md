# 🚀 Wordy Server 🚀

The Wordy Server is the backbone of the <a href="https://github.com/MichalStaszkiewicz/Wordy">
Wordy
</a> application, providing the API endpoints that the Wordy frontend interacts with. Developed using TypeScript and Hapi, the server seamlessly facilitates data exchange and communication between the client and the backend.

## Prerequisites ⚙️

Before diving into the installation and running of the Wordy Server, ensure that you have the following prerequisites in place:

- **Node.js and npm:** Your system must have Node.js and npm installed. If you haven't already, download and install them.
- **PostgreSQL Database:** Set up a PostgreSQL database (e.g., pgAdmin) named 'wordydb'. Create a Postgres user with the username 'postgres' and password '1337'. Ensure the database is running on the default PostgreSQL port, 5432.

## Installation and Running 🧰

1. **Repository Cloning:** Clone the Wordy Server repository from GitHub using the command git clone

```sh
https://github.com/MichalStaszkiewicz/wordy-server.git
```

2. **Open a terminal and navigate to the project directory.**
3. **To install the required dependencies run:**

```sh
  npm install
```

4. **To start the server in development mode run:**

```sh
npm run dev
```

5. **Server Verification:** Upon successful server startup, you should see the message "Server running at: http://localhost:1344" in the console.

## Documentation 📖

The Wordy Server API documentation is available at the '/docs' endpoint.
