'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Orders.module.css';

/** --------------------------------------
 * Types
 * ----------------------------------- */
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[] | string; // TEXT column may come back as string
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

/** Parse items column (TEXT → JSON) safely */
const parseItems = (items: OrderItem[] | string): OrderItem[] =>
  typeof items === 'string' ? (JSON.parse(items) as OrderItem[]) : items;

/**
 * 👨‍💼 Admin Orders Page – Client Component
 */
export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  /** 🔐 Redirect to login if not logged in */
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('isLoggedIn')) {
      localStorage.setItem('redirectAfterLogin', '/orders');
      router.push('/login');
    }
  }, [router]);

  /** 🚀 Fetch initial data */
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data: Order[]) => setOrders(data));

    refreshProducts();
  }, []);

  /** Refresh product list */
  const refreshProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  };

  /** Clear all orders */
  const clearOrders = async () => {
    if (confirm('Are you sure you want to delete all orders?')) {
      await fetch('/api/orders', { method: 'DELETE' });
      setOrders([]);
    }
  };

  /** Add new menu item */
  const addItem = async () => {
    if (!name || !price) {
      alert('Please fill out both fields.');
      return;
    }
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseFloat(price) }),
    });

    setName('');
    setPrice('');
    refreshProducts();
  };

  /** Delete a menu item */
  const deleteItem = async (id: number) => {
    if (confirm('Delete this item?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      refreshProducts();
    }
  };

  /** Logout handler */
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('redirectAfterLogin');
    router.push('/login');
  };

  const totalForOrder = (items: OrderItem[] | string) =>
    parseItems(items)
      .reduce((sum, it) => sum + it.price * it.quantity, 0)
      .toFixed(2);

  return (
    <div className={styles.container}>
      <button onClick={handleLogout} className={styles.logoutButton}>
        🚪 Logout
      </button>
      <h1 className={styles.title}>👨‍💼 Admin Panel – Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <div className={styles.orderId}>Order #{order.id}</div>
              <div className={styles.timestamp}>Placed at {order.created_at}</div>
              <p>Items:</p>
              <ul>
                {parseItems(order.items).map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.quantity} — ${
                      (item.price * item.quantity).toFixed(2)
                    }
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> ${totalForOrder(order.items)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {orders.length > 0 && (
        <button onClick={clearOrders} className={styles.clearButton}>
          🗑️ Delete All Orders
        </button>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h2>📋 Edit Menu Items</h2>

      <div className={styles.addForm}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          step="0.01"
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <ul>
        {products.map((prod) => (
          <li key={prod.id}>
            {prod.name} – $
            <input
              type="number"
              value={prod.price}
              onChange={(e) => {
                const newPrice = parseFloat(e.target.value);
                setProducts((prev) =>
                  prev.map((p) =>
                    p.id === prod.id ? { ...p, price: newPrice } : p
                  )
                );
              }}
              style={{ width: '80px', marginLeft: '8px', marginRight: '8px' }}
            />
            <button
              onClick={() => deleteItem(prod.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
