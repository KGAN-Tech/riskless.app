export interface Library {
  id: string;
  code: string;
  description: string;
  status: string;
  type: string;
  category: string;
}

export interface LibraryFilterState {
  status: string[];
  type: string[];
  category: string[];
}