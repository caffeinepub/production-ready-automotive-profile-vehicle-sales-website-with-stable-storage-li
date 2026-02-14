import { useGetContacts, useGetCreditSimulations } from '../../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeadsAdminPage() {
  const { data: contacts = [], isLoading: contactsLoading } = useGetContacts();
  const { data: simulations = [], isLoading: simulationsLoading } = useGetCreditSimulations();

  if (contactsLoading || simulationsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Leads Management</h1>
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="simulations">Credit Simulations ({simulations.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Contact leads list would be displayed here</p>
          </div>
        </TabsContent>
        <TabsContent value="simulations" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Credit simulation requests would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
