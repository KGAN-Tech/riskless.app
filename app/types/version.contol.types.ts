type Version = {
  id: string;
  appId?: string;
  app?: { name: string };
  createdById?: string;
  createdBy?: { userName: string; email: string };
  title: string;
  description: string;
  version: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
