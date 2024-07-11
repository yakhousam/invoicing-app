# Full-Stack Application

This project is a full-stack application featuring a React frontend and an Express backend. It leverages Docker for easy setup and deployment.

## Overview

This application is designed to streamline the invoicing process for freelancers and small businesses. It allows users to create, manage, and download invoices as PDFs efficiently. Key features include user authentication, invoice creation and tracking, client management, and data visualization through interactive charts. The target users are freelancers, small business owners, and anyone needing a simple yet powerful invoicing solution.

## Prerequisites

Before you begin, ensure you have installed:

- Docker
- Docker Compose
- Node.js (for local development)
- MongoDB (for local development)

## Getting Started

To get the application running, follow these steps:

### Using Docker

1. Clone the repository:

```sh
git clone https://github.com/yakhousam/invoicing-app.git
cd invoicing-app
```

2. Build and run the application using Docker Compose:

```sh
docker-compose up --build
```

This command builds the application for both the client and server and starts the services as defined in the docker-compose.yml file.

## Running Locally

For local development, you need to run both the client and server separately.

### Server

Navigate to the server directory:

```sh
cd server
```

Install dependencies:

```sh
npm install
```

Run the server:

```sh
npm run dev
```

### Client

Navigate to the client directory:

```sh
cd client
```

Install dependencies:

```sh
npm install
```

Run the client:

```sh
npm run dev
```

The client will be available at http://localhost:5173, and the server will run on http://localhost:3005 (or another port if configured differently).

## Testing

To run tests for the server, navigate to the server directory and use the following command:

```sh
npm test
```

To run tests for the client, navigate to the client directory and use the following command:

```sh
npm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
