# 🍽️ Restaurant Web App (TypeScript + Next.js 14 + PostgreSQL)

This is a full-stack restaurant ordering and admin panel built with **Next.js 14**, **TypeScript**, and **PostgreSQL** running in Docker.

## ✨ Features

- 🔐 Admin login (localStorage-based)
- 📦 Manage orders and menu items
- 🍔 Place orders from the menu
- 🧾 View order history (with timestamp and totals)
- 🐘 PostgreSQL database in Docker
- ⚙️ Clean App Router structure using Next.js 14

## 🧰 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) via Docker
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/restaurant-ts-app.git
cd restaurant-ts-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL via Docker

```bash
docker compose up -d
```

### 4. Seed the database (optional but recommended)

You can use the provided `init.sql` to create tables and insert demo data:

```bash
docker exec -i restaurant-ts-app-db-1 psql -U myuser -d restaurantdb < init.sql

```

### 5. Start the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin

- Email: `riza@example.com`
- Password: `rizafp12`

## 📁 Folder Structure

```
app/
  login/        → Admin login UI
  menu/         → Menu & order page (customer-facing)
  orders/       → Admin dashboard (order + product control)
  api/          → API routes (login, orders, products)
lib/
  db.ts         → PostgreSQL database connection
```
