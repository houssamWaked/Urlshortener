
```markdown
# URL Shortener

A simple URL shortener service that allows users to create short URLs and redirect to the original URL.

## Features

- Create custom short URLs with a unique code.
- Automatically generate random short URLs.
- Retrieve URL statistics like the number of times a short URL was accessed.
- Redirect from short URLs to original URLs.
- User authentication and password hashing with bcrypt.
- Expiration handling for URLs.

## Dependencies

The following dependencies are required to run this project:

- bcrypt: Library for password hashing.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- dotenv: Loads environment variables from a `.env` file.
- express: Web framework for Node.js.
- express-validator: Middleware for validation of incoming request data.
- mariadb: MariaDB client for Node.js.
- mysql2: MySQL client for Node.js.
- sequelize: Promise-based ORM for Node.js, supports various databases like MySQL, MariaDB.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/houssamWaked/Urlshortener.git
   cd Urlshortener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the necessary environment variables (such as database connection credentials):

   Example `.env` file:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=urlshortener
   PORT=5000
   ```

## Running the Application

1. Start the development server with `nodemon` for auto-reloading:

   ```bash
   npm run dev
   ```

2. Or start the application in production mode:

   ```bash
   npm start
   ```

   The app will be running at `http://localhost:5000`.

## API Endpoints

### Create a URL

- POST `/api/urls`  
  Creates a new URL entry with a custom short code.

  - Body:
    ```json
    {
      "long_url": "https://www.example.com",
      "short_code": "example"
    }
    ```

### Create a Random URL

- POST `/api/urls/random`  
  Creates a new URL entry with a randomly generated short code.

  - Body:
    ```json
    {
      "long_url": "https://www.example.com"
    }
    ```

### Redirect to Original URL

- GET `/api/urls/:short_code`  
  Redirects to the original URL associated with the given short code.

### Get URL Count by Short Code

- GET `/api/urls/:short_code/count`  
  Retrieves the number of times the short URL has been accessed.

### Expire Inactive URLs

- PUT `/api/urls`  
  Marks expired URLs as inactive.

## License

This project is licensed under the ISC License.

## Author

Created by [Houssam Waked](https://github.com/houssamWaked).
```

### Explanation of Sections:

- Features: A brief description of the core functionalities of your project.
- **Dependencies: Lists all dependencies required to run the project.
- **Installation: Step-by-step instructions for setting up the project locally.
- Running the Application: Explains how to start the development or production server.
- API Endpoints: Lists and describes the available API routes with expected request/response formats.
- License: Includes licensing information (ISC license in your case).
- Author: Information about the author with a link to the GitHub profile.

This structure provides all the necessary information for someone to understand.
