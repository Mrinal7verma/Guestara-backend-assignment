# Guestara Backend Assignment

## Project Overview

This is a Node.js & Express backend for a Menu Management System. It handles complex menu hierarchies, tax inheritance, and dynamic pricing rules.

## Features Implemented

1.  **Menu Hierarchy:** Categories → SubCategories → Items.
2.  **Tax Inheritance:** Items inherit tax rates from parents if not defined.
3.  **Pricing Engine:** Supports Static, Discount (Percentage/Flat), and dynamic pricing.
4.  **Availability:** Checks if items are bookable based on Day and Time slots.
5.  **Search:** API to search items by name.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPO_LINK>
    cd guestara-backend-assignment
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root and add:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    ```
4.  **Run the Server:**
    ```bash
    npm start
    ```

## API Endpoints Checklist

| Method   | Endpoint                      | Description                           |
| :------- | :---------------------------- | :------------------------------------ |
| **POST** | `/api/categories`             | Create Category                       |
| **GET**  | `/api/categories`             | Get All Categories                    |
| **POST** | `/api/subcategories`          | Create SubCategory                    |
| **GET**  | `/api/subcategories`          | Get All SubCategories                 |
| **POST** | `/api/items`                  | Create Item                           |
| **GET**  | `/api/items`                  | Get All Items                         |
| **GET**  | `/api/items/:id/price`        | **Calculate Price (Tax & Discounts)** |
| **POST** | `/api/items/:id/availability` | **Check Availability (Day & Time)**   |

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
