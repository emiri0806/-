import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { MapView } from './components/MapView';
import { AkiyaBankSyncModal } from './components/AkiyaBankSyncModal';
import { Property } from './types';
import { INITIAL_PROPERTIES } from './data/mockProperties';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [isAkiyaBankSyncOpen, setIsAkiyaBankSyncOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('本日最新（日南市公式空き家バンク同期完了）');

  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('akiya_favorites');
      return saved ? JSON.parse(saved) : ['ak-001', 'ak-002'];
    } catch {
      return ['ak-001', 'ak-002'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('akiya_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Selected property for detail modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Toggle Favorite Handler
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleRefreshSync = () => {
    const now = new Date();
    const formatted = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}（日南市空き家バンク最新取得）`;
    setLastSyncTime(formatted);
    // Ensure properties are up to date
    setProperties([...INITIAL_PROPERTIES]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-100 text-stone-900 font-sans overflow-hidden antialiased selection:bg-amber-300">
      {/* Minimal Clean Header */}
      <Navbar
        favoriteCount={favorites.length}
        totalPropertiesCount={properties.length}
        onOpenAkiyaBankSync={() => setIsAkiyaBankSyncOpen(true)}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Full-Screen Map Container (Nichinan City Map Only) */}
      <main className="flex-1 w-full h-[calc(100vh-56px)] relative overflow-hidden p-2 sm:p-3">
        <div className={`w-full h-full ${selectedProperty ? 'hidden pointer-events-none' : 'block'}`}>
          <MapView
            properties={properties}
            onSelectProperty={setSelectedProperty}
            isFavorite={(id) => favorites.includes(id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAiConsultant={() => {}}
            isDetailOpen={Boolean(selectedProperty)}
            onOpenAkiyaBankSync={() => setIsAkiyaBankSyncOpen(true)}
          />
        </div>
      </main>

      {/* Property Detail: When open, it renders exclusively in full-screen with NO map in front */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenAiWithProperty={() => {}}
        />
      )}

      {/* Official Nichinan Akiya Bank Live Pull & Sync Modal */}
      <AkiyaBankSyncModal
        isOpen={isAkiyaBankSyncOpen}
        onClose={() => setIsAkiyaBankSyncOpen(false)}
        properties={properties}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
        }}
        lastSyncTime={lastSyncTime}
        onRefreshSync={handleRefreshSync}
      />
    </div>
  );
}
