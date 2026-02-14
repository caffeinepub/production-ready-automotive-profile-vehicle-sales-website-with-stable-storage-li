import { useState } from 'react';
import { useGetContacts, useGetCreditSimulations, useDeleteContact, useDeleteCreditSimulation } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import type { Contact, CreditSimulation } from '../../backend';
import { toast } from 'sonner';

export default function LeadsAdminPage() {
  const { data: contacts = [], isLoading: contactsLoading, error: contactsError } = useGetContacts();
  const { data: simulations = [], isLoading: simulationsLoading, error: simulationsError } = useGetCreditSimulations();
  const deleteContact = useDeleteContact();
  const deleteSimulation = useDeleteCreditSimulation();
  
  const [searchContacts, setSearchContacts] = useState('');
  const [searchSimulations, setSearchSimulations] = useState('');
  const [deleteContactItem, setDeleteContactItem] = useState<Contact & { id: bigint } | null>(null);
  const [deleteSimulationItem, setDeleteSimulationItem] = useState<CreditSimulation & { id: bigint } | null>(null);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchContacts.toLowerCase()) ||
    c.email.toLowerCase().includes(searchContacts.toLowerCase())
  );

  const filteredSimulations = simulations.filter((s) =>
    s.name.toLowerCase().includes(searchSimulations.toLowerCase()) ||
    s.email.toLowerCase().includes(searchSimulations.toLowerCase())
  );

  const handleDeleteContact = async () => {
    if (!deleteContactItem) return;
    
    try {
      await deleteContact.mutateAsync(deleteContactItem.id);
      toast.success('Contact deleted successfully');
      setDeleteContactItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleDeleteSimulation = async () => {
    if (!deleteSimulationItem) return;
    
    try {
      await deleteSimulation.mutateAsync(deleteSimulationItem.id);
      toast.success('Credit simulation deleted successfully');
      setDeleteSimulationItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete credit simulation');
    }
  };

  if (contactsError || simulationsError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading leads: {contactsError instanceof Error ? contactsError.message : simulationsError instanceof Error ? simulationsError.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-2">Manage contact forms and credit simulation requests</p>
        </div>

        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts">Contact Forms ({contacts.length})</TabsTrigger>
            <TabsTrigger value="simulations">Credit Simulations ({simulations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchContacts}
                onChange={(e) => setSearchContacts(e.target.value)}
                className="pl-10"
              />
            </div>

            {contactsLoading ? (
              <div className="text-center py-8">Loading contacts...</div>
            ) : (
              <div className="grid gap-4">
                {filteredContacts.map((contact, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{contact.date}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteContactItem({ ...contact, id: BigInt(index) })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-sm">{contact.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="text-sm">{contact.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Address</p>
                          <p className="text-sm">{contact.address}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Unit</p>
                          <p className="text-sm">{contact.unit}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Message</p>
                        <p className="text-sm">{contact.message}</p>
                      </div>
                      {contact.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Notes</p>
                          <p className="text-sm">{contact.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No contacts found</div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="simulations" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search simulations..."
                value={searchSimulations}
                onChange={(e) => setSearchSimulations(e.target.value)}
                className="pl-10"
              />
            </div>

            {simulationsLoading ? (
              <div className="text-center py-8">Loading simulations...</div>
            ) : (
              <div className="grid gap-4">
                {filteredSimulations.map((simulation, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{simulation.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{simulation.date}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteSimulationItem({ ...simulation, id: BigInt(index) })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-sm">{simulation.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="text-sm">{simulation.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Unit</p>
                          <p className="text-sm">{simulation.unit}</p>
                        </div>
                        {simulation.downPayment && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Down Payment</p>
                            <p className="text-sm">Rp {simulation.downPayment.toLocaleString()}</p>
                          </div>
                        )}
                        {simulation.tenor && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Tenor</p>
                            <p className="text-sm">{simulation.tenor} months</p>
                          </div>
                        )}
                      </div>
                      {simulation.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Notes</p>
                          <p className="text-sm">{simulation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filteredSimulations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No simulations found</div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDeleteDialog
        open={!!deleteContactItem}
        onOpenChange={(open) => !open && setDeleteContactItem(null)}
        onConfirm={handleDeleteContact}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        isDeleting={deleteContact.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteSimulationItem}
        onOpenChange={(open) => !open && setDeleteSimulationItem(null)}
        onConfirm={handleDeleteSimulation}
        title="Delete Credit Simulation"
        description="Are you sure you want to delete this credit simulation? This action cannot be undone."
        isDeleting={deleteSimulation.isPending}
      />
    </>
  );
}
