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
  - [5️⃣ Park a Car](#5️⃣-park-a-car)
  - [6️⃣ Get Occupied Slots](#6️⃣-get-occupied-slots)
  - [7️⃣ Clear an Occupied Slot](#7️⃣-clear-an-occupied-slot)
  - [8️⃣ Get Slot Numbers by Vehicle Color](#8️⃣-get-slot-numbers-by-vehicle-color)
  - [9️⃣ Get Registration Numbers by Vehicle Color](#9️⃣-get-registration-numbers-by-vehicle-color)
  - [🔟 Get Slot Number by Registration Number](#🔟-get-slot-number-by-registration-number)
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

### **2️⃣ Get All Parking Lots**
**Endpoint:**
```http
GET /parking_lot/
```
**Response:**
```json
{
  "parkingLots": [
    {
      "lotId": "PL1",
      "totalSlots": 5
    }
  ]
}
```
---

### **3️⃣ Expand a Parking Lot**
**Endpoint:**
```http
PATCH /parking_lot/{lotId}/expand
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
  "total_slot": 7
}
```
---

### **4️⃣ Shrink a Parking Lot**
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

### **5️⃣ Park a Car**
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

### **6️⃣ Get Occupied Slots**
**Endpoint:**
```http
GET /parking_lot/{lotId}/status
```
**Response:**
```json
[
  {
    "slot": 1,
    "regNo": "UP-14-DC-1987",
    "color": "Black"
  }
]
```
---

### **7️⃣ Clear an Occupied Slot**
**Endpoint:**
```http
POST /parking_lot/{lotId}/clear
```
**Request Body:**
```json
{
  "slotNumber": 1
}
```
**Response:**
```json
{
  "freed_slot_number": 1
}
```
---

### **8️⃣ Get Slot Numbers by Vehicle Color**
**Endpoint:**
```http
GET /parking_lot/{lotId}/slot_numbers?color=Black
```
**Response:**
```json
{
  "slots": [1, 2]
}
```
---

### **9️⃣ Get Registration Numbers by Vehicle Color**
**Endpoint:**
```http
GET /parking_lot/{lotId}/registration_numbers?color=Black
```
**Response:**
```json
{
  "slots": ["UP-14-DC-1987", "DL-02-AB-5678"]
}
```
---

### **🔟 Get Slot Number by Registration Number**
**Endpoint:**
```http
GET /parking_lot/{lotId}/registration_number?regNo=UP-14-DC-1987
```
**Response:**
```json
{
  "slot": 1
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

