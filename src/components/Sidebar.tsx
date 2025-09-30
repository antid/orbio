import { Users, Briefcase, BarChart3, Settings, Building, ChevronLeft, LogOut } from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onNavigateToPositions?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ currentSection, onSectionChange, onNavigateToPositions, collapsed = false, onToggle, isMobile = false }: SidebarProps) {
  const menuItems = [
    { id: 'positions', label: 'Posiciones', icon: Briefcase },
    { id: 'candidates', label: 'Candidatos', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  // On mobile when collapsed, show only the floating trigger
  if (isMobile && collapsed) {
    return (
      <div 
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-200 hover:shadow-xl transition-shadow"
        onClick={onToggle}
      >
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      isMobile 
        ? 'w-64 h-screen fixed left-0 top-0 z-50' 
        : `${collapsed ? 'w-16' : 'w-64'} transition-all duration-200 fixed left-0 top-0 z-10`
    } bg-white border-r border-gray-200 h-screen flex flex-col`}>
      {/* Logo */}
      <div 
        className={`${collapsed ? 'p-4' : 'p-6'} border-b border-gray-200 group hover:bg-gray-50 cursor-pointer transition-colors relative`}
        onClick={onToggle}
      >
        {!collapsed && (
          <ChevronLeft 
            size={16} 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        )}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 group-hover:translate-x-5'} transition-transform`}>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          {!collapsed && <span className="font-semibold text-gray-900">Orbio</span>}
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" title="Honest Greens">
              <span className="text-green-800 font-medium text-sm">hg</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-medium text-sm">hg</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Honest Greens</div>
              <div className="text-gray-500">(Crew)</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'positions' && onNavigateToPositions ? onNavigateToPositions() : onSectionChange(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-lg text-left transition-colors ${
                currentSection === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={16} />
              {!collapsed && item.label}
            </button>
          ))}
        </div>

        {!collapsed && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Organización
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Users size={16} />
                Miembros
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Building size={16} />
                Integraciones
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center" title="Alex Florensa">
              <span className="text-orange-800 font-medium text-xs">AF</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-800 font-medium text-xs">AF</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Alex Florensa</div>
                <div className="text-xs text-gray-500">alex@orbio.work</div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <LogOut size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              ADMINISTRADOR
            </div>
          </>
        )}
      </div>
    </div>
  );
}