# 📜 API Documentation - Car Parking System

## 🚀 Overview
This document provides an overview of all API endpoints in the **Car Parking System**. The system allows users to **create parking lots, park vehicles, retrieve vehicle information, and manage parking slots.**

---
## 📖 Table of Contents
- [📌 Base URL](#-base-url)
- [📂 API Endpoints](#-api-endpoints)
  - [1️⃣ Create a Parking Lot](#1️⃣-create-a-parking-lot)
  - [2️⃣ Get All Parking Lots](#2️⃣-get-all-parking-lots)
  - [3️⃣ Expand a Parking Lot](#3️⃣-expand-a-parking-lot)
  - [4️⃣ Shrink a Parking Lot](#4️⃣-shrink-a-parking-lot)
  - [5️⃣ Delete a Parking Lot](#5️⃣-delete-a-parking-lot)
  - [6️⃣ Park a Car](#6️⃣-park-a-car)
  - [7️⃣ Get Occupied Slots](#7️⃣-get-occupied-slots)
  - [8️⃣ Clear an Occupied Slot](#8️⃣-clear-an-occupied-slot)
  - [9️⃣ Get Slot Numbers by Vehicle Color](#9️⃣-get-slot-numbers-by-vehicle-color)
  - [🔟 Get Registration Numbers by Vehicle Color](#🔟-get-registration-numbers-by-vehicle-color)
  - [🔢 Get Slot Number by Registration Number](#🔢-get-slot-number-by-registration-number)
- [📌 Notes](#-notes)
- [🛠️ Contributing](#️-contributing)

---
## 📌 Base URL
```
http://localhost:3000/parking_lot/
```

---
## **📂 API Endpoints**

### **1️⃣ Create a Parking Lot**
**Endpoint:**
```http
POST /parking_lot/
```
**Description:** Creates a new parking lot with a given size.

**Request Body:**
```json
{
  "id": "PL1",
  "size": 5
}
```
**Response:**
```json
{
  "message": "Parking lot PL1 created with 5 slots"
}
```
---

### **4️⃣ Shrink a Parking Lot**
**Endpoint:**
```http
PATCH /parking_lot/{lotId}/shrink
```
**Description:** Reduces the number of available parking slots in an existing parking lot.

**Request Body:**
```json
{
  "size": 2
}
```
**Response:**
```json
{
  "total_slot": 3
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Reduction size must be at least 1."
}
```

### **5️⃣ Delete a Parking Lot**
**Endpoint:**
```http
DELETE /parking_lot/{lotId}
```
**Description:** Deletes a parking lot by ID.

**Response:**
```json
{
  "message": "Parking lot PL1 deleted successfully."
}
```

**Error Response (Invalid ID):**
```json
{
  "statusCode": 404,
  "message": "Parking lot with ID \"PL1\" not found.",
  "error": "Not Found"
}
```
---
**Endpoint:**
```http
PATCH /parking_lot/{lotId}/shrink
```
**Request Body:**
```json
{
  "size": 2
}
```
**Response:**
```json
{
  "total_slot": 3
}
```
---

### **6️⃣ Park a Car**
**Endpoint:**
```http
POST /parking_lot/{lotId}/park
```
**Request Body:**
```json
{
  "regNo": "UP-14-DC-1987",
  "color": "Black"
}
```
**Response:**
```json
{
  "allocated_slot_number": 1
}
```
---

## 📌 Notes
- **Validation:** Requests with missing or invalid parameters will return a `400 Bad Request` response.
- **Error Handling:**
  ```json
  {
    "statusCode": 400,
    "message": "Parking lot ID is required."
  }
  ```
- **Swagger Documentation:** Available at
  ```
  http://localhost:3000/api
  ```

---

## 🛠️ Contributing
To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit changes: `git commit -m "feat: added new API feature"`.
4. Push to branch: `git push origin feature-branch`.
5. Open a **Pull Request**.

---
📌 **Built with ❤️ using NestJS** 🚀

