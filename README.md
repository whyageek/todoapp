To-Do App with Keycloak Authentication and Stripe Integration
_____________________________________________________________
Overview
This is a full-stack To-Do application built using Flask for the backend and React for the frontend. The app integrates Keycloak for authentication and Stripe for payment processing, enabling users to manage their to-dos and upgrade to a Pro version to upload images.
_____________________________________________________________
Features
1.	Authentication:

o	Login and logout functionality with Keycloak.

o	Only authenticated users can access the application.

2.	To-Do Management:

o	Create, edit, delete, and list to-dos.

o	Each to-do has a title, description, and time.

o	Pro users can upload images to their to-dos.

3.	Pro License:

o	Option to upgrade to Pro using Stripe payment (in testing mode).

4.	GraphQL API:

o	All backend operations are handled through secure GraphQL endpoints.

Installation

Prerequisites

1.	Python 3.11+

2.	Node.js 16+

3.	Keycloak server set up

4.	Stripe account (in testing mode)
________________________________________
Keycloak Configuration

1.	Access the Keycloak Admin Console:

o	URL: http://localhost:8080

o	Admin Username: admin

o	Admin Password: Crazy

2.	Create a new realm:

o	Realm Name: todo-realm

3.	Create a new client:

o	Client ID: todo-client

o	Access Type: confidential

4.	Create roles:

o	default-roles-todo-realm

o	pro

5.	Create users:

o	User: test-user

o	Password: testuser

6.	Assign roles:

o	test-user: Assign the default-roles-todo-realm role.
________________________________________
Stripe Configuration

1.	Log in to your Stripe Dashboard.

2.	Get your Publishable Key and Secret Key (for testing mode).

3.	Update the STRIPE_API_KEY in config.py with the secret key.
________________________________________
Testing

1.	Access the app in the browser:

o	Backend: http://127.0.0.1:5000/graphql

o	Frontend: http://localhost:3000

2.	Test user login, to-do operations, and Stripe Pro upgrades.
________________________________________
Troubleshooting

1.	Ensure the Keycloak server is running.

2.	Check the logs for any errors in the backend (flask run) or frontend (npm start).

3.	Verify your database is correctly migrated and configured.
________________________________________
Contributing

Feel free to fork the repository and make pull requests to improve the app.


