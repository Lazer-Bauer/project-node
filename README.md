# User and Card Management API

# This API provides endpoints for managing users and cards.

### if you have any questions please contact me 0585979532 or 0583292435 or email me to :lazerbauer@gmail.com

### This app is exactly like the requirements of the assignments, where the assignment wasn't clear I stated it in that action the rule

# the core in this project allows request from any address this what the lecture Danial Tzadok said to do

# ENVIRONMENTS

In .env there is ENVIRONMENT if you set to development then it will be connected locally if you set it PRODUCTION it will connect to ATLAS , please note the address in atlas in .env is only example.

### Initial data

if there is no collection of users or cards it will automtacliy generate 3 users regular,business,and admin and 3 cards when you open the app.
Please note: If there is one user or card it will not generate anything.

### Example.http

you will find it easy to do all the request from there. please not that in order to change anything ( ie PUT PATCH besides in cards which is like) you will need to provide the body like required in the assignment .

## Users

## Endpoints

### POST /api/users/

Creates a new user.
Request body must include like the requirements in the assignment to create a card.

### GET /api/users/

Retrieves all users.
Requires the user to be an admin.
Requires a valid JWT token in the request headers.

### GET /api/users/:id

Retrieves a single user by ID.
Requires the user to be an admin or the owner of the user record.
Requires a valid JWT token in the request headers.

### PUT /api/users/:id

Updates a user by ID.
Requires the user to be the owner of the user record.

### Non-admin users cannot update isAdmin, isBusiness, or password.

Requires a valid JWT token in the request headers.

### PATCH /api/users/:id

Updates the isBusiness property of a user by ID.
Requires the user to be the owner of the user record.
Requires a valid JWT token in the request headers.

### DELETE /api/users/:id

Deletes a user by ID.
Requires the user to be an admin or the owner of the user record.
Requires a valid JWT token in the request headers.
Authorization

The API uses JWT tokens for authentication and authorization.
Only admins can access certain endpoints like retrieving all users.
Users can only access their own data, except for admins who have broader access.

## Cards

## Endpoints

### GET /api/cards/

Retrieves all cards.
no restrictions.

### GET /api/cards/my-cards

Retrieves all cards belonging to the authenticated user.
Requires a valid JWT token in the request headers.

### GET /api/cards/:id

Retrieves a single card by ID.
no restrictions.

### POST /api/cards

Creates a new card.
Requires the user to be a business user.
Requires a valid JWT token in the request headers.
Request body must include like the requirements in the assignment to create a card.

### PUT /api/cards/:id

Updates a card by ID.
Requires the user to be the owner of the card record.
Requires a valid JWT token in the request headers.

### PATCH /api/cards/:id

Toggles the like status of a card by ID for the authenticated user.
Requires a valid JWT token in the request headers.

### DELETE /api/cards/:id

Deletes a card by ID.
Requires the user to be an admin or the owner of the card record.
Requires a valid JWT token in the request headers.

## Authorization

Business users can create cards.
Card owners can update and delete their cards.
Admins have broader access to all cards.
Error Handling
The API returns appropriate error messages and status codes for different scenarios, such as invalid requests or unauthorized access.

## Technologies Used

Node.js
Express
MongoDB
Mongoose
JWT for authentication

### This API provides robust user and card management functionality, ensuring secure and controlled access to resources.
