// src/components/MobileLayout.js

export default function MobileLayout({ children }) {
  return (
    // Latar belakang browser (desktop)
    <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center p-4">
      
      {/* Bingkai Ponsel Virtual */}
      <div className="w-full max-w-sm h-[80vh] max-h-[736px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* 'Notch' atau kamera depan untuk estetika */}
        <div className="w-full bg-black p-2 flex justify-center">
            <div className="w-24 h-4 bg-gray-900 rounded-b-xl"></div>
        </div>

        {/* Konten Aplikasi (layar) */}
        <div className="w-full h-full overflow-y-auto">
          {children} 
        </div>

      </div>
    </div>
  );
}