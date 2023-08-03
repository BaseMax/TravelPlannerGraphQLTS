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

- `getUser`: Get user details by user ID or username.
- `getTrip`: Get trip details by trip ID.
- `getTripsByUser`: Get all trips associated with a specific user.
- `searchPointsOfInterest`: Search for points of interest at a specific destination.
- `getCollaborators`: Get a list of users who are collaborators on a specific trip.
- `getSharedTrips`: Get all trips that have been shared with the currently logged-in user.
- `getCollaboratorTrips`: Get all trips where the current user is a collaborator.
- `getActivitiesByTrip`: Get all activities within a specific trip.
- `getActivity`: Get activity details by activity ID.
- `getPOIDetails`: Get details of a specific Point of Interest (POI).
- `searchTrips`: Search for trips based on destination, date range, or other criteria.
- `getRecommendedTrips`: Get a list of recommended trips based on the user's preferences or past trips.
- `getUserNotifications`: Get notifications related to the user, such as trip updates, collaboration invitations, etc.
- `getCollaboratorStatus`: Get the status (e.g., accepted, pending) of a collaborator on a specific trip.
- `getPopularDestinations`: Get a list of popular destinations based on the number of trips created.
- `getTripActivitiesByDate`: Get activities of a trip for a specific date or date range.
- `getTripsByDateRange`: Get trips that fall within a specified date range.
- `getUserStats`: Get statistics related to the user's trips, such as the number of trips, activities, etc.
- `getTripsByDestination`: Get all trips with a specific destination.
- `getTripsByDate`: Get all trips that occur on a particular date.
- `getTripsByCollaborator`: Get all trips where a specific user is a collaborator.
- `getTripsByTag`: Get all trips that are associated with a specific tag (e.g., "Adventure," "Beach Vacation," "Hiking").
- `getActivitiesByDate`: Get all activities across all trips for a specific date.
- `getUpcomingTrips`: Get all trips that are scheduled for the future.

### Mutations:

- `signup`: Create a new user account with username, email, and password.
- `login`: Log in the user and return a JWT token for authentication.
- `createTrip`: Create a new trip with destination, dates, and other details.
- `addActivity`: Add an activity to a trip's itinerary.
- `removeActivity`: Remove an activity from a trip's itinerary.
- `reorderActivity`: Reorder activities within a trip's itinerary.
- `shareTrip`: Share a trip with another registered user.
- `unshareTrip`: Remove a user from the list of collaborators on a trip.
- `updateUser`: Update user details, such as name, email, or profile picture.
- `updateTrip`: Update trip details, such as destination, dates, or other information.
- `updateActivity`: Update activity details, such as activity name, description, or time.
- `createPOI`: Add a new Point of Interest (POI) to the database.
- `deletePOI`: Remove a Point of Interest (POI) from the database.
- `addCollaborator`: Invite a user to collaborate on a trip by adding them to the list of collaborators.
- `removeCollaborator`: Remove a collaborator from a trip.
- `deleteUser`: Delete the user account along with all associated data (trips, activities, etc.).
- `deleteTrip`: Delete a trip along with its itinerary and associated data.
- `deleteActivity`: Delete an activity from the database.
- `acceptCollaborationInvite`: Accept a collaboration invitation for a trip.
- `declineCollaborationInvite`: Decline a collaboration invitation for a trip.
- `markNotificationAsRead`: Mark a notification as read once the user has viewed it.
- `createTag`: Add a new tag to the system to be associated with trips.
- `addTagToTrip`: Associate a tag with a specific trip.
- `removeTagFromTrip`: Remove a tag association from a trip.
- `addCollaboratorNote`: Allow collaborators to add notes or comments to a specific trip.
- `editCollaboratorNote`: Allow collaborators to edit their notes or comments on a trip.
- `deleteCollaboratorNote`: Allow collaborators to delete their notes or comments on a trip.

### Subscriptions (Real-time Updates):

- `tripUpdated`: Subscribe to real-time updates when a trip is modified (e.g., itinerary changes, new collaborators).
- `activityAdded`: Subscribe to real-time updates when an activity is added to a trip's itinerary.
- `activityRemoved`: Subscribe to real-time updates when an activity is removed from a trip's itinerary.
- `collaboratorAdded`: Subscribe to real-time updates when a new collaborator is added to a trip.
- `collaboratorRemoved`: Subscribe to real-time updates when a collaborator is removed from a trip.
- `tripDeleted`: Subscribe to real-time updates when a trip is deleted.
- `activityUpdated`: Subscribe to real-time updates when an activity is modified (e.g., details changed, time updated).
- `collaborationInviteReceived`: Subscribe to real-time updates when the user receives a collaboration invitation.
- `newPOICreated`: Subscribe to real-time updates when a new Point of Interest (POI) is added to the database.
- `tripDeleted`: Subscribe to real-time updates when a trip is deleted, notifying collaborators.
- `collaboratorNoteAdded`: Subscribe to real-time updates when a collaborator adds a note to a trip.
- `collaboratorNoteEdited`: Subscribe to real-time updates when a collaborator edits their note on a trip.
- `collaboratorNoteDeleted`: Subscribe to real-time updates when a collaborator deletes their note on a trip.

Sure, here are more examples for the remaining queries, mutations, and subscriptions:

## GraphQL Examples

### **getCollaboratorTrips**: Get all trips where the current user is a collaborator.

```graphql
query {
  getCollaboratorTrips {
    id
    destination
    dates
  }
}
```

### **getActivitiesByTrip**: Get all activities within a specific trip.

```graphql
query {
  getActivitiesByTrip(tripId: "456") {
    id
    name
    time
  }
}
```

### **getActivity**: Get activity details by activity ID.

```graphql
query {
  getActivity(activityId: "789") {
    id
    name
    time
  }
}
```

### **getPOIDetails**: Get details of a specific Point of Interest (POI).

```graphql
query {
  getPOIDetails(poiId: "poi123") {
    id
    name
    description
    location
  }
}
```

### **searchTrips**: Search for trips based on destination, date range, or other criteria.

```graphql
query {
  searchTrips(destination: "Italy", fromDate: "2023-09-01", toDate: "2023-09-30") {
    id
    destination
    dates
  }
}
```

### **getRecommendedTrips**: Get a list of recommended trips based on the user's preferences or past trips.

```graphql
query {
  getRecommendedTrips {
    id
    destination
    dates
  }
}
```

### **getUserNotifications**: Get notifications related to the user, such as trip updates, collaboration invitations, etc.

```graphql
query {
  getUserNotifications {
    id
    message
    type
    createdAt
  }
}
```

### **getCollaboratorStatus**: Get the status (e.g., accepted, pending) of a collaborator on a specific trip.

```graphql
query {
  getCollaboratorStatus(tripId: "456", collaboratorId: "user123") {
    status
    updatedAt
  }
}
```

### getCollaboratorTrips: Get all trips where the current user is a collaborator.

```graphql
query {
  getCollaboratorTrips {
    id
    destination
    dates
  }
}
```

### getActivitiesByTrip: Get all activities within a specific trip.

```graphql
query {
  getActivitiesByTrip(tripId: "456") {
    id
    name
    time
  }
}
```

### getActivity: Get activity details by activity ID.

```graphql
query {
  getActivity(activityId: "789") {
    id
    name
    time
  }
}
```

### getPOIDetails: Get details of a specific Point of Interest (POI).

```graphql
query {
  getPOIDetails(poiId: "poi123") {
    id
    name
    description
    location
  }
}
```

### searchTrips: Search for trips based on destination, date range, or other criteria.

```graphql
query {
  searchTrips(destination: "Italy", fromDate: "2023-09-01", toDate: "2023-09-30") {
    id
    destination
    dates
  }
}
```

### getRecommendedTrips: Get a list of recommended trips based on the user's preferences or past trips.

```graphql
query {
  getRecommendedTrips {
    id
    destination
    dates
  }
}
```

### getUserNotifications: Get notifications related to the user, such as trip updates, collaboration invitations, etc.

```graphql
query {
  getUserNotifications {
    id
    message
    type
    createdAt
  }
}
```

### getCollaboratorStatus: Get the status (e.g., accepted, pending) of a collaborator on a specific trip.

```graphql
query {
  getCollaboratorStatus(tripId: "456", collaboratorId: "user123") {
    status
    updatedAt
  }
}
```

### getPopularDestinations: Get a list of popular destinations based on the number of trips created.

```graphql
query {
  getPopularDestinations {
    destination
    tripsCount
  }
}
```

### getTripActivitiesByDate: Get activities of a trip for a specific date or date range.

```graphql
query {
  getTripActivitiesByDate(tripId: "456", date: "2023-09-03") {
    id
    name
    time
  }
}
```

### getTripsByDateRange: Get trips that fall within a specified date range.

```graphql
query {
  getTripsByDateRange(fromDate: "2023-09-01", toDate: "2023-09-30") {
    id
    destination
    dates
  }
}
```

### getUserStats: Get statistics related to the user's trips, such as the number of trips, activities, etc.

```graphql
query {
  getUserStats(userId: "user123") {
    totalTrips
    totalActivities
  }
}
```

### acceptCollaborationInvite: Accept a collaboration invitation for a trip.

```graphql
mutation {
  acceptCollaborationInvite(tripId: "456") {
    id
    status
  }
}
```

### declineCollaborationInvite: Decline a collaboration invitation for a trip.

```graphql
mutation {
  declineCollaborationInvite(tripId: "456") {
    id
    status
  }
}
```

### createTag: Add a new tag to the system to be associated with trips.

```graphql
mutation {
  createTag(tagName: "Beach Vacation") {
    id
    name
  }
}
```

### addTagToTrip: Associate a tag with a specific trip.

```graphql
mutation {
  addTagToTrip(tripId: "456", tagId: "tag123") {
    id
    destination
    tags {
      id
      name
    }
  }
}
```

### removeTagFromTrip: Remove a tag association from a trip.

```graphql
mutation {
  removeTagFromTrip(tripId: "456", tagId: "tag123") {
    id
    destination
    tags {
      id
      name
    }
  }
}
```

### tripUpdated: Subscribe to real-time updates when a trip is modified (e.g., itinerary changes, new collaborators).

```graphql
subscription {
  tripUpdated(tripId: "456") {
    id
    destination
    dates
    collaborators {
      id
      username
    }
  }
}
```

### activityAdded: Subscribe to real-time updates when an activity is added to a trip's itinerary.

```graphql
subscription {
  activityAdded(tripId: "456") {
    id
    name
    time
  }
}
```

### activityRemoved: Subscribe to real-time updates when an activity is removed from a trip's itinerary.

```graphql
subscription {
  activityRemoved(tripId: "456") {
    id
    name
  }
}
```

### collaboratorAdded: Subscribe to real-time updates when a new collaborator is added to a trip.

```graphql
subscription {
  collaboratorAdded(tripId: "456") {
    id
    username
    email
  }
}
```

### collaboratorRemoved: Subscribe to real-time updates when a collaborator is removed from a trip.

```graphql
subscription {
  collaboratorRemoved(tripId: "456") {
    id
    username
  }
}
```

### collaborationInviteReceived: Subscribe to real-time updates when the user receives a collaboration invitation.

```graphql
subscription {
  collaborationInviteReceived {
    id
    inviter {
      id
      username
    }
    trip {
      id
      destination
    }
  }
}
```

### getTripsByDestination: Get all trips with a specific destination.

```graphql
query {
  getTripsByDestination(destination: "London") {
    id
    destination
    dates
  }
}
```

### getTripsByDate: Get all trips that occur on a particular date.

```graphql
query {
  getTripsByDate(date: "2023-09-15") {
    id
    destination
    dates
  }
}
```

### getTripsByCollaborator: Get all trips where a specific user is a collaborator.

```graphql
query {
  getTripsByCollaborator(collaboratorId: "user123") {
    id
    destination
    dates
  }
}
```

### getTripsByTag: Get all trips that are associated with a specific tag.

```graphql
query {
  getTripsByTag(tagName: "Adventure") {
    id
    destination
    dates
  }
}
```

### getActivitiesByDate: Get all activities across all trips for a specific date.

```graphql
query {
  getActivitiesByDate(date: "2023-09-03") {
    id
    name
    time
  }
}
```

### getUpcomingTrips: Get all trips that are scheduled for the future.

```graphql
query {
  getUpcomingTrips {
    id
    destination
    dates
  }
}
```

### addCollaboratorNote: Allow collaborators to add notes or comments to a specific trip.

```graphql
mutation {
  addCollaboratorNote(tripId: "456", note: "Let's visit the Louvre museum!") {
    id
    notes {
      id
      content
    }
  }
}
```

### editCollaboratorNote: Allow collaborators to edit their notes or comments on a trip.

```graphql
mutation {
  editCollaboratorNote(noteId: "note123", content: "Don't forget to pack sunscreen!") {
    id
    notes {
      id
      content
    }
  }
}
```

### deleteCollaboratorNote: Allow collaborators to delete their notes or comments on a trip.

```graphql
mutation {
  deleteCollaboratorNote(noteId: "note123") {
    id
    notes {
      id
      content
    }
  }
}
```

### tripDeleted: Subscribe to real-time updates when a trip is deleted.

```graphql
subscription {
  tripDeleted(tripId: "456") {
    id
    destination
    dates
  }
}
```

### collaboratorNoteAdded: Subscribe to real-time updates when a collaborator adds a note to a trip.

```graphql
subscription {
  collaboratorNoteAdded(tripId: "456") {
    id
    notes {
      id
      content
    }
  }
}
```

### collaboratorNoteEdited: Subscribe to real-time updates when a collaborator edits their note on a trip.

```graphql
subscription {
  collaboratorNoteEdited(tripId: "456") {
    id
    notes {
      id
      content
    }
  }
}
```

### collaboratorNoteDeleted: Subscribe to real-time updates when a collaborator deletes their note on a trip.

```graphql
subscription {
  collaboratorNoteDeleted(tripId: "456") {
    id
    notes {
      id
      content
    }
  }
}
```

### getActivitiesByDateRange: Get all activities across all trips for a specific date range.

```graphql
query {
  getActivitiesByDateRange(fromDate: "2023-09-01", toDate: "2023-09-15") {
    id
    name
    time
  }
}
```

### getUserStats: Get statistics related to the user's trips, such as the number of trips, activities, etc.

```graphql
query {
  getUserStats(userId: "user123") {
    totalTrips
    totalActivities
    totalCollaborations
  }
}
```

### getTripsByDate: Get all trips that occur on a particular date.

```graphql
query {
  getTripsByDate(date: "2023-09-15") {
    id
    destination
    dates
  }
}
```

### updateUser: Update user details, such as name, email, or profile picture.

```graphql
mutation {
  updateUser(userId: "user123", name: "John Doe", email: "john.doe@example.com") {
    id
    name
    email
  }
}
```

### updateTrip: Update trip details, such as destination, dates, or other information.

```graphql
mutation {
  updateTrip(tripId: "456", destination: "Rome, Italy", dates: ["2023-10-01", "2023-10-10"]) {
    id
    destination
    dates
  }
}
```

### updateActivity: Update activity details, such as activity name, description, or time.

```graphql
mutation {
  updateActivity(activityId: "789", name: "Visit Colosseum", time: "2023-10-05T09:00:00") {
    id
    name
    time
  }
}
```

### tripUpdated: Subscribe to real-time updates when a trip is modified (e.g., itinerary changes, new collaborators).

```graphql
subscription {
  tripUpdated(tripId: "456") {
    id
    destination
    dates
    collaborators {
      id
      username
    }
    activities {
      id
      name
      time
    }
  }
}
```

### activityUpdated: Subscribe to real-time updates when an activity is modified (e.g., details changed, time updated).

```graphql
subscription {
  activityUpdated(tripId: "456") {
    id
    name
    time
  }
}
```

### newPOICreated: Subscribe to real-time updates when a new Point of Interest (POI) is added to the database.

```graphql
subscription {
  newPOICreated {
    id
    name
    description
    location
  }
}
```

### tripDeleted: Subscribe to real-time updates when a trip is deleted, notifying collaborators.

```graphql
subscription {
  tripDeleted(tripId: "456") {
    id
    destination
    dates
  }
}
```

### getUser: Get user details by user ID or username.

```graphql
query {
  getUser(userId: "user123") {
    id
    username
    email
    trips {
      id
      destination
      dates
    }
    notifications {
      id
      message
      createdAt
    }
  }
}
```

### getTripsByUser: Get all trips associated with a specific user.

```graphql
query {
  getTripsByUser(userId: "user123") {
    id
    destination
    dates
    collaborators {
      id
      username
    }
    activities {
      id
      name
      time
    }
  }
}
```

### getActivity: Get activity details by activity ID.
```graphql
query {
  getActivity(activityId: "activity456") {
    id
    name
    time
    trip {
      id
      destination
      dates
    }
  }
}
```

### createPOI: Add a new Point of Interest (POI) to the database.
```graphql
mutation {
  createPOI(
    name: "Louvre Museum",
    description: "Famous art museum in Paris",
    location: { latitude: 48.860294, longitude: 2.338629 }
  ) {
    id
    name
    description
    location
  }
}
```

### deletePOI: Remove a Point of Interest (POI) from the database.

```graphql
mutation {
  deletePOI(poiId: "poi456") {
    id
    name
  }
}
```

### addCollaborator: Invite a user to collaborate on a trip by adding them to the list of collaborators.

```graphql
mutation {
  addCollaborator(tripId: "trip456", userId: "user789") {
    id
    destination
    collaborators {
      id
      username
    }
  }
}
```

### collaboratorAdded: Subscribe to real-time updates when a new collaborator is added to a trip.
```graphql
subscription {
  collaboratorAdded(tripId: "trip456") {
    id
    destination
    collaborators {
      id
      username
    }
  }
}
```

### collaboratorRemoved: Subscribe to real-time updates when a collaborator is removed from a trip.

```graphql
subscription {
  collaboratorRemoved(tripId: "trip456") {
    id
    destination
    collaborators {
      id
      username
    }
  }
}
```

### tripDeleted: Subscribe to real-time updates when a trip is deleted.

```graphql
subscription {
  tripDeleted(tripId: "trip456") {
    id
    destination
  }
}
```

### activityUpdated: Subscribe to real-time updates when an activity is modified (e.g., details changed, time updated).

```graphql
subscription {
  activityUpdated(tripId: "trip456") {
    id
    name
    time
  }
}
```

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
