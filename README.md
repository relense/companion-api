# Deskbird challeng

This node express app was created to showcase how admins and users can manage their bookings in an app.

## Table of Contents

- [Installation](#installation)
- [Starting the App](#starting-the-app)
- [Postman Collection](#postman-collection)
- [Important Commands](#important-commands)

## Installation

To be able to install the app please do the following commands

1. Clone the repo:
   ```
   git clone https://github.com/relense/deskbird
   ```

2. Navigate to the project directory:
   ```
   cd deskbird
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Install PostgreSQL:
    ```
    brew install postgresql
    ```

5. Run PostgresSQL service:
    ```
    brew services start postgresql
    ```

6. Access Postgres console:
    ```
    psql postgres
    ```

7. Inside postgres console create a table called deskbird or any name you desire:
    ```
    CREATE DATABASE deskbird;
    ```

    Don't forget the ```;```

8. Create a .env file:
    ```
    touch .env
    ```

9. Pass the data from .env.localhost to the .env file and update:

    ```
    PORT=3000
    DATABASE_URL="postgresql://username:password@localhost:5432/databaseName"
    ```

10. Run migrations:
    ```
    npx prisma migrate dev
    ```

11. Run prisma generate:
    ```
    npx prisma generate
    ```

12. Run Prisma seed file:
    ```
    npx prisma db seed
    ```
    
## Starting the App

To the able to run the app please run the following command

1. Start App command:
    ```
    npm run dev
    ```

## Postman Collection

In the root of the project there is a folder called postman.
This folder has a json file that can be imported to postman.
This will make it easier to test the endpoints.

## Important Commands

To view the database data and tables run the following command:
    ```
    npx prisma studio
    ```
