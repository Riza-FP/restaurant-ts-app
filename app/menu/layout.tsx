import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Menu',
};

interface Props {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: Props) {
  return <>{children}</>;
}

