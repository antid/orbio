import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Search, Calendar, MapPin, Users, ChevronUp, ChevronDown, Check, ChevronsUpDown } from 'lucide-react';
import { Input } from './ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Position {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'active' | 'draft' | 'paused';
  candidates: number;
}

interface PositionsListProps {
  positions: Position[];
  onCreatePosition: () => void;
  onPositionClick: (positionId: string) => void;
}

type SortField = 'title' | 'status' | 'candidates' | 'date';
type SortDirection = 'asc' | 'desc';

export function PositionsList({ positions, onCreatePosition, onPositionClick }: PositionsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('Todas las ciudades');
  const [cityFilterOpen, setCityFilterOpen] = useState(false);

  // Get unique cities from positions plus "Todas las ciudades" option
  const availableCities = ['Todas las ciudades', ...Array.from(new Set(positions.map(p => p.location))).sort()];



  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const sortedAndFilteredPositions = positions
    .filter(position => {
      const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCityFilter === 'Todas las ciudades' || position.location === selectedCityFilter;
      return matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'candidates':
          aValue = a.candidates;
          bValue = b.candidates;
          break;
        case 'date':
          // Parse dates in DD/MM/YYYY or D/M/YYYY format
          const parseDate = (dateStr: string) => {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1; // Month is 0-indexed
              const year = parseInt(parts[2]);
              return new Date(year, month, day).getTime();
            }
            return new Date(dateStr).getTime();
          };
          aValue = parseDate(a.date);
          bValue = parseDate(b.date);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ACTIVA';
      case 'draft':
        return 'BORRADOR';
      case 'paused':
        return 'PAUSADA';
      case 'closed':
        return 'CERRADA';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Posiciones Abiertas</h1>
        </div>
        <Button
          onClick={onCreatePosition}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start md:self-auto"
        >
          <Plus size={16} />
          Añadir posición
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Buscar posiciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="min-w-[200px]">
          <Popover open={cityFilterOpen} onOpenChange={setCityFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityFilterOpen}
                className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
              >
                {selectedCityFilter}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <Command>
                <CommandInput placeholder="Filtrar por ciudad..." className="h-9" />
                <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                <CommandGroup>
                  <CommandList className="max-h-60">
                    {availableCities.map((city) => (
                      <CommandItem
                        key={city}
                        value={city}
                        onSelect={(currentValue) => {
                          setSelectedCityFilter(currentValue === selectedCityFilter ? "Todas las ciudades" : currentValue);
                          setCityFilterOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedCityFilter === city ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {city}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <button
                onClick={() => handleSort('title')}
                className="flex items-center gap-2 hover:text-gray-900 transition-colors text-left"
              >
                Posición
                {getSortIcon('title')}
              </button>
              <button
                onClick={() => handleSort('status')}
                className="flex items-center gap-2 hover:text-gray-900 transition-colors text-left"
              >
                Estado
                {getSortIcon('status')}
              </button>
              <button
                onClick={() => handleSort('date')}
                className="flex items-center gap-2 hover:text-gray-900 transition-colors text-left"
              >
                Fecha de Creación
                {getSortIcon('date')}
              </button>
              <button
                onClick={() => handleSort('candidates')}
                className="flex items-center gap-2 hover:text-gray-900 transition-colors text-left"
              >
                Candidatos
                {getSortIcon('candidates')}
              </button>
            </div>

            {sortedAndFilteredPositions.map((position) => (
              <div 
                key={position.id} 
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onPositionClick(position.id)}
              >
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 hover:text-green-600 transition-colors">{position.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {position.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Badge className={`${getStatusColor(position.status)} border-0`}>
                    {getStatusText(position.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  {position.date}
                </div>
                
                <div className="flex items-center gap-1 text-blue-600 text-sm">
                  <Users size={12} />
                  {position.candidates}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}