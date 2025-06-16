# 🛍️ Product API – Week 2 Express.js Assignment

This is a fully functional RESTful API built using **Express.js**. It allows users to perform operations on a list of products such as creating, retrieving, updating, deleting, filtering by category, paginating results, and getting statistics. It also includes basic API key authentication.

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js v14 or higher
* npm (Node package manager)
* Git (if cloning from a repository)

### 🛠️ Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/alfredndivo/week-2-express-js-assignment-alfredndivo.git
   cd week-2-express-js-assignment-alfredndivo
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create Environment File**

   * Create a `.env` file in the root directory.
   * Add the following:

     ```env
     PORT=3000
     API_KEY=secret123
     ```

4. **Start the Server**

   ```bash
   npm start
   ```

   The server will run at: `http://localhost:3000`

---

## 🔐 API Key Authentication

Every endpoint (except `/`) requires the following header:

```
x-api-key: secret123
```

---

## 📚 API Documentation

### ✅ Root Route

**GET /**
Returns a welcome message.

```json
{
  "message": "Welcome to the Product API! Go to /api/products to see all products."
}
```

---

### ➕ Add a Product

**POST /api/products**

**Headers:**

```
x-api-key: secret123
```

**Body:**

```json
{
  "name": "Laptop",
  "description": "Powerful laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

**Response:**

```json
{
  "id": "generated-uuid",
  "name": "Laptop",
  ...
}
```

---

### 📄 Get All Products

**GET /api/products**

**Query Parameters:**

* `category` – filter products by category
* `page` – page number (default: 1)
* `limit` – items per page (default: 5)

**Example:**
`GET /api/products?category=electronics&page=1&limit=2`

**Response:**

```json
{
  "page": 1,
  "limit": 2,
  "totalResults": 2,
  "products": [ ... ]
}
```

---

### 🔍 Get Product by ID

**GET /api/products/\:id**

**Response:**

```json
{
  "id": "1",
  "name": "Laptop",
  ...
}
```

**If not found:**

```json
{
  "message": "Product not found"
}
```

---

### ✏️ Update a Product

**PUT /api/products/\:id**

**Body:** Same as POST

**Response:**

```json
{
  "id": "1",
  "name": "Updated Laptop",
  ...
}
```

---

### ❌ Delete a Product

**DELETE /api/products/\:id**

**Response:**

```json
{
  "message": "Product deleted",
  "product": {
    "id": "1",
    ...
  }
}
```

---

### 📊 Product Statistics

**GET /api/products/stats**

Returns count of products per category.

**Response:**

```json
{
  "electronics": 2,
  "clothing": 1
}
```

---

## ❗ Error Handling

| Status Code | Message                        |
| ----------- | ------------------------------ |
| 400         | Validation error               |
| 401         | Unauthorized / Missing API key |
| 404         | Product not found              |
| 500         | Internal server error          |

---

## 📁 .env.example

```env
PORT=3000
API_KEY=secret123
```

---

## 📤 Deployment / Commit

To push changes to GitHub:

```bash
git add .
git commit -m "Complete Week 2 assignment"
git push origin main
```

---

## 👨‍💻 Author

**Alfred Ndivo**
GitHub: [https://github.com/alfredndivo](https://github.com/alfredndivo)
