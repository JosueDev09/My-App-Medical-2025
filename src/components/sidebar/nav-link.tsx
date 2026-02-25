'use client';

import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}

export default function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link href={href} className="block">
      {children}
    </Link>
  );
}
