'use client';

interface NavbarProps {
  userData?: {
    nombre: string;
    rfc?: string;
    email?: string;
  } | null;
  userType?: 'osc' | 'donor';
  subtitle?: string;
  onLogout?: () => void;
  showAuth?: boolean;
}

export default function Navbar({ 
  userData, 
  userType = 'osc',
  onLogout, 
  showAuth = true 
}: NavbarProps) {
  const getSecondaryInfo = () => {
    if (!userData) return null;
    
    if (userType === 'osc' && userData.rfc) {
      return <p className="text-xs text-gray-500">{userData.rfc}</p>;
    }
    
    if (userType === 'donor' && userData.email) {
      return <p className="text-xs text-gray-500">{userData.email}</p>;
    }
    
    return null;
  };

  const getDefaultName = () => {
    return userType === 'osc' ? 'Organización' : 'Usuario';
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-3xl font-bold">
              <span className="text-[#4A6B6D]">Apple</span>
              <span className="text-[#8BC34A]">seed</span>
            </span>
          </div>
          
          {showAuth && (
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {userData?.nombre || getDefaultName()}
                </p>
                {getSecondaryInfo()}
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
