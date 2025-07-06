'use client';

import { useEffect, useState } from 'react';
import styles from './Menu.module.css';

/** --------------------------------------
 * Types
 * ----------------------------------- */
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

/**
 * 🍽️ MenuPage – Client Component (converted from JS → TSX)
 */
export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch menu items once on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  /** Add or increment item in the cart */
  const addToCart = (item: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  /** Remove item completely from cart */
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /** Send order to API */
  const placeOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    if (res.ok) {
      alert('Order placed!');
      setCart([]);
    } else {
      alert('Order failed!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🍽️ Restaurant Menu</h1>

      <table className={styles.menuTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>${Number(prod.price).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => addToCart(prod)}
                  className={styles.addButton}
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2 className={styles.subheading}>🛒 Your Order</h2>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul className={styles.cartList}>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} — $
              {(item.price * item.quantity).toFixed(2)}
              <button
                onClick={() => removeFromCart(item.id)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total: ${total.toFixed(2)}</h3>

      {cart.length > 0 && (
        <button onClick={placeOrder} className={styles.orderButton}>
          Place Order
        </button>
      )}
    </div>
  );
}
