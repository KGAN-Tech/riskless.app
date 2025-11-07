import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Phone, Download, Search } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";

interface Hotline {
  name: string;
  number: string;
  available: boolean;
}

interface EmergencyHotlinesListProps {
  emergencyHotlines: Hotline[];
  onSaveAll?: () => void;
}

const ITEMS_PER_PAGE = 10;

const EmergencyHotlinesList = ({
  emergencyHotlines,
  onSaveAll,
}: EmergencyHotlinesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleHotlines, setVisibleHotlines] = useState<Hotline[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ✅ Memoize filtered list to prevent re-renders
  const filteredHotlines = useMemo(
    () =>
      emergencyHotlines.filter((hotline) =>
        hotline.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [emergencyHotlines, searchTerm]
  );

  // ✅ Calculate current slice safely
  const currentItems = useMemo(
    () => filteredHotlines.slice(0, page * ITEMS_PER_PAGE),
    [filteredHotlines, page]
  );

  // ✅ Effect: update visible hotlines when data changes
  useEffect(() => {
    setVisibleHotlines(currentItems);
  }, [currentItems]);

  // ✅ Stable observer callback (doesn’t depend on arrays)
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  // ✅ Setup observer ONCE
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [handleObserver]);

  // ✅ Stop increasing page if already loaded all
  useEffect(() => {
    if (page * ITEMS_PER_PAGE >= filteredHotlines.length) {
      // Stop observing once all loaded
      if (loaderRef.current) {
        const observer = new IntersectionObserver(() => {});
        observer.unobserve(loaderRef.current);
      }
    }
  }, [page, filteredHotlines.length]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-medium">
          <Phone className="w-4 h-4 text-primary" />
          Emergency Hotlines
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveAll}
          className="text-primary hover:bg-green-50 rounded-full text-xs h-7 px-2"
        >
          <Download className="w-3 h-3 mr-1" />
          Save All
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search hotline..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="w-full pl-9 pr-3 py-2 text-xs border rounded-full focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>

      {/* List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {visibleHotlines.map((hotline, index) => (
          <Card
            key={index}
            className="p-3 rounded-xl border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground font-medium">
                    {hotline.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {hotline.number}
                  </p>
                </div>
              </div>
              <Badge
                className={`text-[9px] rounded-full border-0 ${
                  hotline.available
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {hotline.available ? "Available" : "Offline"}
              </Badge>
            </div>
          </Card>
        ))}

        {/* Infinite Scroll Loader */}
        <div
          ref={loaderRef}
          className="h-6 flex justify-center items-center text-[11px] text-muted-foreground"
        >
          {visibleHotlines.length < filteredHotlines.length
            ? "Loading more..."
            : "No more results"}
        </div>
      </div>
    </div>
  );
};

export default EmergencyHotlinesList;
