'use client';
import Logo from '@/components/Logo';
import SearchOverlay from '@/components/SearchOverlay';

export default function Page(){
  return (
    <div className="center">
      <Logo/>
      <SearchOverlay/>
    </div>
  );
}
