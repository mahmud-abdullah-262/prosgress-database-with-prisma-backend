# API Documentation

Base URL: `http://localhost:5000`

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Categories](#categories)
- [Products](#products)
- [Reviews](#reviews)
- [Orders](#orders)

---

## Authentication

Authentication is handled via [Better Auth](https://better-auth.com/). The API exposes an auth endpoint at `/api/auth/*` which handles sign-up, sign-in, session management, and more. Protected routes require a valid session cookie.

---

## Users

### Register User

Creates a new user account.

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | User's full name |
| `email` | `string` | Yes | User's email address |
| `password` | `string` | Yes | User's password |
| `role` | `string` | No | User role (`USER` or `ADMIN`), defaults to `USER` |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Login User

Authenticates a user and creates a session.

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | User's email address |
| `password` | `string` | Yes | User's password |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Get My Profile

Returns the profile of the authenticated user.

- **URL:** `/api/users/me`
- **Method:** `GET`
- **Auth Required:** Yes

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Users

Returns a paginated list of all users.

- **URL:** `/api/users`
- **Method:** `GET`
- **Auth Required:** Yes

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | `number` | No | Page number (default: `1`) |
| `limit` | `number` | No | Items per page (default: `10`) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "USER",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Categories

### Create Category

Creates a new product category.

- **URL:** `/api/categories`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Category name (must be unique) |
| `description` | `string` | No | Category description |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Categories

Returns all non-deleted categories with product counts.

- **URL:** `/api/categories`
- **Method:** `GET`
- **Auth Required:** No

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "isDeleted": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "products": 5
      }
    }
  ]
}
```

---

### Get Category by ID

Returns a single category by its ID, including its non-deleted products.

- **URL:** `/api/categories/:id`
- **Method:** `GET`
- **Auth Required:** No

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "products": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "price": 99.99,
        "stock": 10,
        "categoryId": "string",
        "isDeleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Update Category

Updates a category by ID.

- **URL:** `/api/categories/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | No | Category name (must be unique) |
| `description` | `string` | No | Category description |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Delete Category

Soft-deletes a category by ID.

- **URL:** `/api/categories/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

## Products

### Create Product

Creates a new product.

- **URL:** `/api/products`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Product title |
| `description` | `string` | No | Product description |
| `price` | `number` | Yes | Product price |
| `stock` | `number` | Yes | Product stock quantity |
| `categoryId` | `string` | Yes | ID of the category this product belongs to |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": 99.99,
    "stock": 10,
    "categoryId": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  }
}
```

---

### Get Products

Returns a paginated list of products with optional filters.

- **URL:** `/api/products`
- **Method:** `GET`
- **Auth Required:** No

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | `number` | No | Page number (default: `1`) |
| `limit` | `number` | No | Items per page (default: `10`) |
| `categoryId` | `string` | No | Filter by category ID |
| `minPrice` | `number` | No | Minimum price filter |
| `maxPrice` | `number` | No | Maximum price filter |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "price": 99.99,
        "stock": 10,
        "categoryId": "string",
        "isDeleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "category": {
          "id": "string",
          "name": "string",
          "description": "string"
        },
        "reviews": [
          {
            "rating": 5
          }
        ]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### Get Product by ID

Returns a single product by its ID, including category and non-deleted reviews with user info.

- **URL:** `/api/products/:id`
- **Method:** `GET`
- **Auth Required:** No

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": 99.99,
    "stock": 10,
    "categoryId": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "string",
      "name": "string",
      "description": "string"
    },
    "reviews": [
      {
        "id": "string",
        "rating": 5,
        "comment": "string",
        "userId": "string",
        "productId": "string",
        "isDeleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
}
```

---

### Update Product

Updates a product by ID.

- **URL:** `/api/products/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | No | Product title |
| `description` | `string` | No | Product description |
| `price` | `number` | No | Product price |
| `stock` | `number` | No | Product stock quantity |
| `categoryId` | `string` | No | ID of the category this product belongs to |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": 99.99,
    "stock": 10,
    "categoryId": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  }
}
```

---

### Delete Product

Soft-deletes a product by ID.

- **URL:** `/api/products/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## Reviews

### Create Review

Creates a new review for a product.

- **URL:** `/api/reviews`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating` | `number` | Yes | Review rating |
| `comment` | `string` | No | Review comment |
| `productId` | `string` | Yes | ID of the product being reviewed |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "string",
    "rating": 5,
    "comment": "string",
    "userId": "string",
    "productId": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "product": {
      "id": "string",
      "title": "string"
    }
  }
}
```

---

### Get Product Reviews

Returns all non-deleted reviews for a specific product.

- **URL:** `/api/reviews/product/:productId`
- **Method:** `GET`
- **Auth Required:** No

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "rating": 5,
      "comment": "string",
      "userId": "string",
      "productId": "string",
      "isDeleted": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

---

### Update Review

Updates a review by ID. Only the review author can update it.

- **URL:** `/api/reviews/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating` | `number` | No | Updated review rating |
| `comment` | `string` | No | Updated review comment |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": "string",
    "rating": 5,
    "comment": "string",
    "userId": "string",
    "productId": "string",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

### Delete Review

Soft-deletes a review by ID. Only the review author can delete it.

- **URL:** `/api/reviews/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

---

## Orders

### Create Order

Creates a new order with items.

- **URL:** `/api/orders`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | `array` | Yes | Array of order items |
| `items[].productId` | `string` | Yes | ID of the product |
| `items[].quantity` | `number` | Yes | Quantity ordered |
| `items[].price` | `number` | Yes | Price per unit at time of order |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "totalAmount": 199.98,
    "status": "PENDING",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "orderItems": [
      {
        "id": "string",
        "orderId": "string",
        "productId": "string",
        "quantity": 2,
        "price": 99.99,
        "product": {
          "id": "string",
          "title": "string",
          "description": "string",
          "price": 99.99,
          "stock": 10,
          "categoryId": "string",
          "isDeleted": false,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ],
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

### Get My Orders

Returns a paginated list of orders for the authenticated user.

- **URL:** `/api/orders`
- **Method:** `GET`
- **Auth Required:** Yes

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | `number` | No | Page number (default: `1`) |
| `limit` | `number` | No | Items per page (default: `10`) |
| `status` | `string` | No | Filter by order status (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "string",
        "userId": "string",
        "totalAmount": 199.98,
        "status": "PENDING",
        "isDeleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "orderItems": [ /* ... */ ],
        "user": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Get Order by ID

Returns a single order by its ID. Only the order owner can access it.

- **URL:** `/api/orders/:id`
- **Method:** `GET`
- **Auth Required:** Yes

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "totalAmount": 199.98,
    "status": "PENDING",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "orderItems": [
      {
        "id": "string",
        "orderId": "string",
        "productId": "string",
        "quantity": 2,
        "price": 99.99,
        "product": {
          "id": "string",
          "title": "string",
          "description": "string",
          "price": 99.99,
          "stock": 10,
          "categoryId": "string",
          "isDeleted": false,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ],
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

### Update Order Status

Updates the status of an order by ID.

- **URL:** `/api/orders/:id/status`
- **Method:** `PATCH`
- **Auth Required:** Yes

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `string` | Yes | New order status (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "totalAmount": 199.98,
    "status": "PROCESSING",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "orderItems": [ /* ... */ ],
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

**`400 Bad Request`**

```json
{
  "success": false,
  "message": "Bad Request",
  "error": "Validation error details"
}
```

**`401 Unauthorized`**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**`403 Forbidden`**

```json
{
  "success": false,
  "message": "Forbidden: Admin access required"
}
```

**`404 Not Found`**

```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Error details (development only)"
}
```

**`409 Conflict`**

```json
{
  "success": false,
  "message": "Resource already exists"
}
```

**`500 Internal Server Error`**

```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Error details (development only)"
}
```
