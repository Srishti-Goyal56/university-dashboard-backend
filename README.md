# University Dashboard Backend

A backend project for a University Dashboard, built with Node.js and organized into modules for maintainability and testing.

## Overview

The project includes backend application code, student-related routes, and integration testing resources. It also includes a Postman collection for testing student-related API workflows.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Include if used by the application
- **Jest** — Testing framework
- **Postman** — API testing

## Project Structure

```text
university-dashboard-backend/
├── src/
│   ├── app.js
│   └── modules/
│       └── students/
│           └── students.routes.js
├── tests/
│   └── student-integration.test.js
├── jest.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed

### Installation

Clone the repository:

```bash
git clone https://github.com/Srishti-Goyal56/university-dashboard-backend.git
cd university-dashboard-backend
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a local `.env` file and configure the environment variables required by the application.

**Security:** Never commit your `.env` file, API keys, or database credentials to GitHub.

### Run the Application

Check `package.json` for the available scripts, then use the appropriate command. For example, if a `start` script exists:

```bash
npm start
```

### Run Tests

If the project has a test script configured in `package.json`, run:

```bash
npm test
```

## API Testing

The repository includes a Postman collection for testing student-related integration workflows. Import the collection into Postman and configure any required environment variables before sending requests.

## Deployment

A deployed backend is available at:

https://university-dashboard-backend-tau.vercel.app

## Future Improvements

- Expand automated test coverage.
- Improve API documentation.
- Add input validation and error handling where needed.
- Document environment configuration and deployment steps.

## Author

**Srishti Goyal**

GitHub: [Srishti-Goyal56](https://github.com/Srishti-Goyal56)
