import { useState, useEffect } from "react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { uselocalStorage } from "@/utils/localstorage.utils";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ExternalLink,
  Monitor,
} from "lucide-react";
import Toggle from "~/app/components/atoms/toggle.v2";
import { counterService } from "~/app/services/counter.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { Link } from "react-router";

// Enums based on your Prisma schema
enum CounterStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

enum CounterType {
  INTERVIEW = "hs_interview",
  VITALS = "hs_vitals",
  HEALTH_SCREENING = "health_screening",
  CONSULTATION = "consultation",
  PHARMACY = "pharmacy",
}

enum CounterCategory {
  HEALTH_SCREENING = "health_screening",
  CONSULTATION = "consultation",
  PHARMACY = "pharmacy",
}

// ✅ Fix interface to match API
interface Counter {
  id: string;
  facilityId: string;
  userId: string;
  order: number;
  status: CounterStatus;
  isVisible: boolean;
  name: string;
  type: string[]; // <-- API returns string[], not CounterType[]
  category: CounterCategory;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CounterPage() {
  const getUserData = getUserFromLocalStorage();
  const [counters, setCounters] = useState<Counter[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Counter>>({});
  const [isCreating, setIsCreating] = useState(false);

  // ✅ Add a selected counter type (default can be e.g. CONSULTATION)
  // ✅ Add "ALL" to the filter state
  const [selectedType, setSelectedType] = useState<string>("all");

  // ✅ Fetch counters on mount
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res: any = await counterService.getAll();
        setCounters(res.data);
      } catch (err) {
        console.error("Failed to fetch counters", err);
      }
    };
    fetchCounters();
  }, []);

  const startCreate = () => {
    setDraft({
      status: CounterStatus.ACTIVE,
      isVisible: true,
      order: counters.length + 1,
      type: [],
    });
    setIsCreating(true);
    setEditingId("new");
  };

  const startEdit = (counter: Counter) => {
    setDraft({ ...counter });
    setEditingId(counter.id);
    setIsCreating(false);
  };

  const save = async () => {
    try {
      if (isCreating) {
        const newCounter = await counterService.create({
          ...draft,
          facilityId: getUserData?.user?.facilityId || "",
          userId: getUserData?.user?.id || "",
        });
        setCounters([...counters, newCounter]);
      } else if (editingId) {
        const updatedCounter = await counterService.update(editingId, draft);
        setCounters(
          counters.map((counter) =>
            counter.id === editingId
              ? { ...updatedCounter, updatedAt: new Date() }
              : counter
          )
        );
      }
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to save counter");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
    setIsCreating(false);
  };

  const remove = (id: string) => {
    setCounters(
      counters.map((counter) =>
        counter.id === id
          ? { ...counter, status: CounterStatus.DELETED }
          : counter
      )
    );
  };

  const toggleVisibility = (id: string, isVisible: boolean) => {
    setCounters(
      counters.map((counter) =>
        counter.id === id ? { ...counter, isVisible } : counter
      )
    );
  };

  const toggleStatus = (id: string, status: CounterStatus) => {
    setCounters(
      counters.map((counter) =>
        counter.id === id ? { ...counter, status } : counter
      )
    );
  };

  const openStandaloneDisplay = () => {
    window.open(
      "/queue/standalone",
      "_blank",
      "width=1920,height=1080,scrollbars=no,resizable=yes"
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="max-w-xs">
          {/* <Label>Filter by Counter Type</Label> */}
          <Select
            value={selectedType}
            onValueChange={(value: string) => setSelectedType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select counter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem> {/* ✅ new option */}
              {Object.values(CounterType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {" "}
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Counter
          </Button>
          <Button onClick={openStandaloneDisplay}>
            <Monitor className="w-4 h-4 mr-2" /> Open Counter Display
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {editingId && (isCreating || draft) && (
        <EditCard
          draft={draft}
          setDraft={setDraft}
          onSave={save}
          onCancel={cancelEdit}
          isCreating={isCreating}
        />
      )}

      {/* Counter List */}
      <div className="space-y-4">
        <h3 className="font-medium">Service Counters</h3>
        {counters.filter((c) =>
          selectedType === "all" ? true : c.type.includes(selectedType)
        ).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No counters found for this type.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {counters
              .filter((c) =>
                selectedType === "all" ? true : c.type.includes(selectedType)
              )
              .map((counter) => (
                <Card key={counter.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="bg-gray-400 rounded-full text-white px-2 w-fit flex items-center justify-center">
                        ORDER #{counter.order}
                      </h3>
                      <p className="font-medium">{counter.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {counter.category.toUpperCase()} —{" "}
                        {counter.type[0]?.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => startEdit(counter)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Link to={`/counters/${counter.id}?page=encounter`}>
                        <Button size="sm" variant="secondary">
                          <ExternalLink className="w-4 h-4 mr-2" /> Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

type EditCardProps = {
  draft: Partial<Counter>;
  setDraft: (d: Partial<Counter>) => void;
  onSave: () => void;
  onCancel: () => void;
  isCreating: boolean;
};

function EditCard({
  draft,
  setDraft,
  onSave,
  onCancel,
  isCreating,
}: EditCardProps) {
  // ✅ When category changes, auto-adjust type
  // ✅ Handle category change
  const handleCategoryChange = (value: CounterCategory) => {
    if (value === CounterCategory.CONSULTATION) {
      setDraft({ ...draft, category: value, type: [CounterType.CONSULTATION] });
    } else if (value === CounterCategory.PHARMACY) {
      setDraft({ ...draft, category: value, type: [CounterType.PHARMACY] });
    } else {
      // Health screening → require one selected type
      setDraft({ ...draft, category: value, type: [] });
    }
  };

  let availableTypes: CounterType[] = [];
  if (draft.category === CounterCategory.HEALTH_SCREENING) {
    availableTypes = [
      CounterType.INTERVIEW,
      CounterType.VITALS,
      CounterType.HEALTH_SCREENING,
    ];
  } else if (draft.category === CounterCategory.CONSULTATION) {
    availableTypes = [CounterType.CONSULTATION];
  } else if (draft.category === CounterCategory.PHARMACY) {
    availableTypes = [CounterType.PHARMACY];
  }
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">
        {isCreating ? "Create New Counter" : "Edit Counter"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Counter Name */}
        <div className="space-y-2">
          <Label>Counter Name *</Label>
          <Input
            value={draft.name ?? ""}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g., Registration Counter"
          />
        </div>

        {/* Code */}
        <div className="space-y-2">
          <Label>Counter Code *</Label>
          <Input
            value={draft.code ?? ""}
            onChange={(e) => setDraft({ ...draft, code: e.target.value })}
            placeholder="e.g., REG"
            maxLength={5}
          />
        </div>

        {/* Order */}
        <div className="space-y-2">
          <Label>Order *</Label>
          <Input
            type="number"
            value={draft.order ?? 1}
            onChange={(e) =>
              setDraft({ ...draft, order: Number(e.target.value) })
            }
            min={1}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={draft.category ?? ""}
            onValueChange={(value: CounterCategory) =>
              handleCategoryChange(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CounterCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Counter Type */}
        <div className="space-y-2 md:col-span-2">
          <Label>Counter Type *</Label>

          {draft.category === CounterCategory.HEALTH_SCREENING ? (
            <Select
              value={draft.type?.[0] ?? ""}
              onValueChange={(value: CounterType) =>
                setDraft({ ...draft, type: [value] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              {availableTypes[0]
                ? availableTypes[0].replace("_", " ").toUpperCase()
                : "Select category to assign type"}
            </p>
          )}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <Toggle
            checked={draft.isVisible ?? true}
            onChange={(checked) => setDraft({ ...draft, isVisible: checked })}
          />
          <Label>Visible</Label>
        </div>
        <div className="flex items-center gap-2">
          <Toggle
            checked={draft.status === CounterStatus.ACTIVE}
            onChange={(checked) =>
              setDraft({
                ...draft,
                status: checked ? CounterStatus.ACTIVE : CounterStatus.INACTIVE,
              })
            }
          />
          <Label>Active</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" /> {isCreating ? "Create" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
