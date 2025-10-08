import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { MoreHorizontal, MapPin, Users, Phone, Edit, Trash2, Eye, Calendar, Activity } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

interface ClinicCardProps {
  clinic: {
    id: string;
    name: string;
    location: string;
    staff: number;
    patients: number;
    phone: string;
    status: 'active' | 'inactive' | 'maintenance';
    revenue: string;
    lastUpdated: string;
    encounters: number;
    category: string;
    provider: string;
    tagline?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onClick: (id: string) => void;
}

export function ClinicCard({ clinic, onEdit, onDelete, onView, onClick }: ClinicCardProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      maintenance: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  return (
    <Card className="group border-0 shadow-sm">
      <div 
        onClick={() => onClick(clinic.id)}
        className="relative"
      >
        {/* Header with gradient background */}
        <div className="h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 relative">
            <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge className={getStatusBadge(clinic.status)}>
              {clinic.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(clinic.id); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(clinic.id); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(clinic.id); }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader className="pb-3 relative -mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <h3 className="font-semibold leading-tight text-lg">{clinic.name}</h3>
              {clinic.tagline && (
                <p className="text-sm text-muted-foreground italic">"{clinic.tagline}"</p>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="text-sm">{clinic.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{clinic.category}</span>
                <span>{clinic.provider}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">Staff</span>
              </div>
              <p className="font-semibold text-lg text-blue-900">{clinic.staff}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Patients</span>
              </div>
              <p className="font-semibold text-lg text-green-900">{clinic.patients}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-700">Encounters</span>
              </div>
              <p className="font-semibold text-lg text-purple-900">{clinic.encounters}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700">Revenue</span>
              </div>
              <p className="font-semibold text-lg text-orange-900">{clinic.revenue}</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{clinic.phone}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last updated: {clinic.lastUpdated}</span>
              <span className="text-blue-600 group-hover:text-blue-700 transition-colors">
                Click to view details →
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}