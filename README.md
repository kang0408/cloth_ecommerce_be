## CLOTHES MANAGEMENT BACKEND

### 📌 Project Overview

The **Clothes Management** backend is a Node.js-based application designed to manage clothing. It provides a RESTful API for handling authentication, product management, and order tracking.

### 🚀 Features

- User authentication with **bcrypt**
- Secure API with **Helmet** and **CORS**
- Database management using **MongoDB & Mongoose**
- Data validation with **Joi**
- Logging and request monitoring with **Morgan**
- Performance optimization using **Compression**

### 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: Helmet, CORS, Bcrypt
- **Validation**: Joi
- **Logging**: Morgan
- **Environment Management**: Dotenv

### 📂 Project Structure

```
cloth-management/
│── src/
│   ├── configs/       # Configuration files (e.g., database, environment variables)
│   ├── controllers/   # API route controllers
│   ├── models/        # Mongoose models (schemas)
│   ├── routes/        # API routes
│   ├── middlewares/   # Custom middleware functions
│   ├── utils/         # Utility functions
│   ├── helpers/       # Helpers
│   ├── validation/    # Data validation logic
│   ├── app.js         # Express app initialization
│   ├── server.js      # Server entry point (listens on a port)
│── .env               # Environment variables
│── .gitignore         # Git ignore file
│── package.json       # Project dependencies and scripts
│── README.md          # Project documentation

```

### ⚡ Getting Started

#### 1️⃣ Clone the Repository

```sh
git clone https://github.com/kang0408/cloth-management.git
cd cloth-management
```

#### 2️⃣ Install Dependencies

```sh
npm install
```

#### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and configure:

```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

EMAIL_USER=your-email
EMAIL_PASS=your-email-pass

CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### 4️⃣ Run the Project

###### Development Mode (with auto-restart)

```sh
npm run dev
```

###### Production Mode

```sh
npm start
```

### 🔥 API Endpoints

_(More endpoints will be documented soon)_

### ✅ To-Do List

- [ ] Complete CRUD for **Clothes**
- [ ] Complete CRUD for **Categories**

### 🏆 Contributions

Contributions are welcome! Feel free to fork the repo and submit a pull request.
