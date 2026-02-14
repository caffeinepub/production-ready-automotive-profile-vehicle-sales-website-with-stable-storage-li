import { ReactNode, useEffect } from 'react';
import Navbar from '../navigation/Navbar';
import Footer from './Footer';
import HeroSection from '../sections/HeroSection';
import BottomCTASection from '../sections/BottomCTASection';
import BottomCtaBar from '../navigation/BottomCtaBar';
import { useVisitorTracking } from '../../hooks/useVisitorTracking';

interface PublicLayoutProps {
  children: ReactNode;
  hideHero?: boolean;
}

export default function PublicLayout({ children, hideHero = false }: PublicLayoutProps) {
  useVisitorTracking();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {!hideHero && <HeroSection />}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomCTASection />
      <Footer />
      <BottomCtaBar />
    </div>
  );
}
