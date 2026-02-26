import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { Hero } from './sections/Hero';
import { Quests } from './sections/Quests';
import { NightGames } from './sections/NightGames';
import { Gallery } from './sections/Gallery';
import { Reviews } from './sections/Reviews';
import { Offers } from './sections/Offers';
import { Booking } from './sections/Booking';
import { Contacts } from './sections/Contacts';
import { Footer } from './sections/Footer';

export function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Film Grain Effect */}
      <div className="film-grain" />
      
      {/* Light Leak Effect */}
      <div className="light-leak" />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Quests />
        <NightGames />
        <Gallery />
        <Reviews />
        <Offers />
        <Booking />
        <Contacts />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
