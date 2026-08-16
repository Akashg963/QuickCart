QuickCart

A modern full-stack e-commerce platform built with Next.js, MongoDB, Mongoose, Clerk, and Cloudinary. QuickCart provides a complete shopping experience with product browsing, authentication, cart management, address management, order placement, and a seller dashboard for managing products and orders.

✨ Features

Customer Features

User authentication with Clerk

Browse products and product details

Add products to cart and update quantities

Manage shipping addresses

Select a saved address during checkout

Place Cash on Delivery (COD) orders

View order history

Order success page

Responsive UI for desktop and mobile

Seller Features

Seller authentication and authorization

Seller dashboard

Add new products

Upload multiple product images

Cloudinary image storage

View seller product list

View orders

Application Features

MongoDB-backed product, user, address, and order data

Protected API routes using Clerk authentication

Next.js App Router API endpoints

Toast notifications

Tailwind CSS responsive styling

Next.js image optimization

Environment-based configuration

Inngest integration for application workflows

🛠️ Tech Stack

Technology

Purpose

Next.js 16

Full-stack React framework and API routes

React 19

User interface

Tailwind CSS

Styling and responsive design

Clerk

Authentication and user management

MongoDB Atlas

Database

Mongoose 8

MongoDB ODM

Cloudinary

Product image storage and delivery

Axios

Client-side API requests

React Hot Toast

Notifications

Inngest

Background/event-driven workflows

JavaScript

Application development

📁 Project Structure

QuickCart/
├── app/
│   ├── api/
│   │   ├── cart/
│   │   ├── inngest/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── add-address/
│   ├── all-products/
│   ├── my-orders/
│   ├── order-success/
│   ├── product/
│   ├── seller/
│   ├── layout.js
│   └── page.jsx
│
├── assets/
│   └── assets.js
├── components/
├── config/
│   └── db.js
├── context/
│   └── AppContext.jsx
├── lib/
│   └── authSeller.js
├── models/
│   ├── Address.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── public/
├── proxy.js
├── jsconfig.json
├── package.json
└── README.md

🚀 Getting Started

Prerequisites

Install the following before running the project:

Node.js 22.x recommended

npm

MongoDB Atlas account

Clerk account

Cloudinary account

Inngest account if you use the project's Inngest workflows

1. Clone the repository

git clone https://github.com/Akashg963/QuickCart.git
cd QuickCart

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file in the project root.

Use the variable names required by the project, for example:

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quickcart?retryWrites=true&w=majority

NEXT_PUBLIC_CURRENCY=$

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

Keep real credentials private. Never commit secrets to GitHub.

4. Start the development server

npm run dev

Open:

http://localhost:3000

5. Configure sellers

Seller access is controlled through Clerk metadata. A seller user can be identified using public metadata such as:

{
  "role": "seller"
}

🔐 Authentication

QuickCart uses Clerk for authentication.

Client-side authentication uses Clerk hooks such as:

import { useAuth, useUser } from "@clerk/nextjs";

Server-side App Router APIs use:

import { auth } from "@clerk/nextjs/server";

Protected routes validate the authenticated Clerk userId before accessing user-specific data.

🗄️ Database Models

QuickCart uses MongoDB Atlas with Mongoose.

User

Stores the Clerk user ID, profile information, and cart data.

Product

Stores seller ID, product name, description, pricing, category, image URLs, and creation date.

Address

Stores the user ID, name, phone, address, city, state, and PIN code.

Order

Stores the user ID, ordered items, quantities, total amount, shipping address, and order date.

🖼️ Cloudinary

Product images are uploaded to Cloudinary, and the resulting image URLs are stored with the product data.

Required environment variables:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

🔗 Main API Endpoints

User

GET    /api/user/data
POST   /api/user/add-address
GET    /api/user/get-address
DELETE /api/user/get-address

Products

GET  /api/product/list
POST /api/product/add
GET  /api/product/seller-list

Cart

GET  /api/cart/get
POST /api/cart/update

Orders

POST /api/order/create
GET  /api/order/list
GET  /api/order/seller-order

Inngest

/api/inngest

Some endpoints require an authenticated Clerk session and seller authorization.

🛒 Application Flow

Customer
  │
  ├── Sign in / Sign up with Clerk
  ├── Browse Products
  ├── View Product Details
  ├── Add to Cart
  ├── Manage Shipping Address
  ├── Checkout
  ├── Place COD Order
  └── View Orders

Seller
  │
  ├── Sign in
  ├── Seller Dashboard
  ├── Add Product
  ├── Upload Product Images
  ├── Manage Products
  └── View Orders

📦 Scripts

npm run dev

Starts the development server.

npm run build

Creates a production build.

npm start

Starts the production server after a successful build.

☁️ Deploying to Vercel

Push the project to GitHub.

Import the repository into Vercel.

Use the main branch.

Add the required environment variables in Vercel → Project → Settings → Environment Variables.

Deploy the application.

Verify Clerk, MongoDB Atlas, Cloudinary, and Inngest configuration in the deployed environment.

🔒 Security Notes

Never commit .env files containing real secrets.

Authenticate protected API routes on the server.

Do not trust client-provided user IDs for authorization.

Restrict seller-only APIs using seller authorization checks.

Keep database, Clerk secret, Cloudinary secret, and Inngest secret values server-side.

🧪 Troubleshooting

MongoDB connection problems

Verify the MONGODB_URI, MongoDB Atlas network access, database credentials, and DNS/network connectivity.

Clerk authentication problems

Verify:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

Make sure the application is wrapped in ClerkProvider.

API 404 errors

Check that an App Router API uses the structure:

app/api/<resource>/<action>/route.js

and exports a named HTTP method such as:

export async function GET() {}

API 405 errors

A 405 means the requested HTTP method is not exported by the route. For example, a route exposing GET must be called with axios.get().

Stale Next.js build/cache

When moving or renaming routes, stop the dev server and remove .next before restarting:

cmd /c rmdir /s /q .next
npm run dev

📸 Screenshots

For a portfolio repository, consider adding screenshots of:

Home page

Product listing

Product details

Cart and checkout

Add address

Order success

My orders

Seller dashboard

Add product

Seller product list

Seller orders

Example:

![Home Page](./screenshots/home.png)

🔮 Future Improvements

Online payment gateway integration

Product reviews and ratings

Advanced search and filtering

Persistent wishlist

Inventory and stock management

Seller analytics

Order status tracking

Email notifications

Coupon and discount management

Pagination and infinite scrolling

Admin dashboard

👨‍💻 Author

Akash Kumar Gupta

GitHub: https://github.com/Akashg963

LinkedIn: https://www.linkedin.com/in/akash-kumar-gupta-5049372a3/

📄 License

This project is intended for educational, portfolio, and demonstration purposes.
