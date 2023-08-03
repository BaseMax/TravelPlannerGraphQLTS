# Travel Planner App - GraphQL-based in TypeScript

The Travel Planner App is a web application that allows users to plan and organize their trips efficiently. It utilizes GraphQL as the API layer and is implemented using TypeScript for a more robust and type-safe development experience. With this app, users can create trip itineraries, search for points of interest, and share their travel plans with others.

## Features

- **User Authentication:** Users can sign up, log in, and manage their accounts.
- **Trip Creation:** Users can create new trips, specifying the destination, dates, and other details.
- **Itinerary Management:** Users can add, remove, and reorder activities within their trip itinerary.
- **Points of Interest:** Users can search for points of interest (POIs) at their destinations.
- **Collaboration:** Users can share their trip plans with other registered users.
- **Real-time Updates:** Utilize GraphQL subscriptions for real-time updates when collaborating on a trip.

## Technologies Used

- **GraphQL:** For the API layer, enabling efficient data retrieval and mutation.
- **TypeScript:** For a type-safe and more maintainable codebase.
- **Apollo Client:** For handling GraphQL queries, mutations, and subscriptions on the client-side.
- **Node.js:** For the backend server implementation.
- **Express:** As the web server framework.
- **MongoDB:** As the database for storing user accounts, trips, and other data.
- **Mongoose:** For modeling the MongoDB data and performing database operations.

## Getting Started

### Prerequisites

- Node.js and npm should be installed on your machine.

- MongoDB server should be running locally or have a connection to a remote MongoDB instance.

### Installation

- Clone the repository: `git clone https://github.com/basemax/TravelPlannerGraphQLTS.git`
- Navigate to the project directory: `cd TravelPlannerGraphQLTS`
- Install dependencies for the server:

```bash
cd server
npm install
```

**Configure the environment variables:**

Create a .env file in the server directory and provide the necessary configuration, such as MongoDB connection URL and JWT secret key.

**Seed the database (optional):**

If you want to add some sample data to the database, you can use the provided seed script:

```bash
cd server
npm run seed
```

```
npm start
```

Access the app in your browser at `http://localhost:3000`.

## GraphQL

### Queries:

- `getUser: Get user details by user ID or username.
- `getTrip: Get trip details by trip ID.
- `getTripsByUser: Get all trips associated with a specific user.
- `searchPointsOfInterest: Search for points of interest at a specific destination.
- `getCollaborators: Get a list of users who are collaborators on a specific trip.
- `getSharedTrips: Get all trips that have been shared with the currently logged-in user.

### Mutations:

- `signup`: Create a new user account with username, email, and password.
- `login`: Log in the user and return a JWT token for authentication.
- `createTrip`: Create a new trip with destination, dates, and other details.
- `addActivity`: Add an activity to a trip's itinerary.
- `removeActivity`: Remove an activity from a trip's itinerary.
- `reorderActivity`: Reorder activities within a trip's itinerary.
- `shareTrip`: Share a trip with another registered user.
- `unshareTrip`: Remove a user from the list of collaborators on a trip.

### Subscriptions (Real-time Updates):

- `tripUpdated`: Subscribe to real-time updates when a trip is modified (e.g., itinerary changes, new collaborators).
- `activityAdded`: Subscribe to real-time updates when an activity is added to a trip's itinerary.
- `activityRemoved`: Subscribe to real-time updates when an activity is removed from a trip's itinerary.

## Contributing

We welcome contributions to improve this Travel Planner App! To contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix: git checkout -b my-feature
- Make your changes, and ensure the code passes the tests (if available).
- Commit your changes: git commit -m "Add my feature"
- Push to your branch: git push origin my-feature
- Submit a pull request to the main branch of the original repository.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

Special thanks to the GraphQL and TypeScript communities for providing great tools and resources.

Copyright 2023, Max Base
