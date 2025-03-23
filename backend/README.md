# 🚗 Car Parking System (NestJS)

## 📌 Overview
The **Car Parking System** is a backend service built using **NestJS** that manages multiple parking lots, allowing users to **park, retrieve, and manage vehicles efficiently**.

## 📖 Table of Contents
- [📌 Overview](#-overview)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
  - [1️⃣ Clone the Repository](#1️⃣-clone-the-repository)
  - [2️⃣ Install Dependencies](#2️⃣-install-dependencies)
  - [3️⃣ Environment Variables](#3️⃣-environment-variables)
- [▶️ Running the Project](#️-running-the-project)
  - [1️⃣ Start the Server in Development Mode](#1️⃣-start-the-server-in-development-mode)
  - [2️⃣ Start the Server in Production Mode](#2️⃣-start-the-server-in-production-mode)
- [🧪 Running Tests](#-running-tests)
  - [Run All Tests](#run-all-tests)
  - [Run Tests with Coverage Report](#run-tests-with-coverage-report)
  - [Run a Specific Test File](#run-a-specific-test-file)
- [🐳 Running with Docker (Optional)](#-running-with-docker-optional)
- [📜 API Documentation](#-api-documentation)
- [🔗 Contributing](#-contributing)
- [🎯 License](#-license)

## ⚙️ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerization)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/amanbarar/car-parking-system.git
cd car-parking-system/backend
```

### 2️⃣ Install Dependencies
Using npm:
```sh
npm install
```
Using yarn:
```sh
yarn install
```

### 3️⃣ Environment Variables
Create a `.env` file in the **backend** directory and add the necessary configurations. This is an optional step at the moment.

Example:
```ini
PORT=3000
NODE_ENV=development
```

## ▶️ Running the Project

### **1️⃣ Start the Server in Development Mode**
```sh
npm run start:dev
```
This will start the **NestJS backend server** with hot-reloading enabled.

### **2️⃣ Start the Server in Production Mode**
```sh
npm run build
npm run start:prod
```
This will build the project and run it in production mode.

## 🧪 Running Tests
The project includes **unit tests** for controllers, services, and entities.

### **Run All Tests**
```sh
npm run test
```

### **Run Tests with Coverage Report**
```sh
npm run test:cov
```
This will generate a **coverage report** showing test coverage percentages.

### **Run a Specific Test File**
For example, to run only controller tests:
```sh
npm run test test/parking/parking.controller.spec.ts
```

## 🐳 Running with Docker (Optional)
Build and run the application using Docker:
```sh
docker build -t car-parking-system .
docker run -p 3000:3000 car-parking-system
```

## 📜 API Documentation
This project uses **Swagger** for API documentation.
After starting the server, open:
```
http://localhost:3000/api-docs
```
If you want to check detailed API information, refer to the API_README.md file. 
👉 [**LINK FOR API README FILE**](backend/API_README.md)

## 🔗 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'feat: added new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a **Pull Request**

## 🎯 License
This project is licensed under the **MIT License**.

---
Made with ❤️ using **NestJS** 🚀

