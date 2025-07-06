import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel – Orders',
};

interface Props {
  children: React.ReactNode;
}

export default function OrdersLayout({ children }: Props) {
  return <>{children}</>;
}
