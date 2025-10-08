import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { AdminRegistration } from './subpages/admin.registration.page';
import { AdminList } from './subpages/admin.list.page';

export const AccountPage = () => {
  return (
    <div className="min-h-screen bg-background p-2 md:p2">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Admin Management System
          </h1>
          <p className="text-muted-foreground">
            Manage healthcare staff registration and administration
          </p>
        </div>

        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="admin-list">Admin List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registration" className="mt-6">
            <AdminRegistration />
          </TabsContent>
          
          <TabsContent value="admin-list" className="mt-6">
            <AdminList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};