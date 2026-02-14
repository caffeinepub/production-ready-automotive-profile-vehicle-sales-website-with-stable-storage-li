import { useState } from 'react';
import { useGetContacts, useGetCreditSimulations, useDeleteContact, useDeleteCreditSimulation } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import AdminPageHeader from '../components/AdminPageHeader';
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
        <AdminPageHeader
          title="Leads Management"
          subtitle="Manage contact forms and credit simulation requests"
        />

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
                className="admin-search-input pl-10"
              />
            </div>

            {contactsLoading ? (
              <div className="text-center py-8">Loading contacts...</div>
            ) : (
              <div className="grid gap-4">
                {filteredContacts.map((contact, index) => (
                  <Card key={index} className="admin-stat-card">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{contact.email}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteContactItem({ ...contact, id: BigInt(index) })}
                        className="admin-action-btn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Phone:</span> {contact.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">Unit:</span> {contact.unit}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Address:</span> {contact.address}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Message:</span> {contact.message}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {contact.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="admin-empty-state">No contacts found</div>
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
                className="admin-search-input pl-10"
              />
            </div>

            {simulationsLoading ? (
              <div className="text-center py-8">Loading simulations...</div>
            ) : (
              <div className="grid gap-4">
                {filteredSimulations.map((simulation, index) => (
                  <Card key={index} className="admin-stat-card">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{simulation.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{simulation.email}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteSimulationItem({ ...simulation, id: BigInt(index) })}
                        className="admin-action-btn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Phone:</span> {simulation.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">Unit:</span> {simulation.unit}
                        </div>
                        {simulation.downPayment && (
                          <div>
                            <span className="font-medium">Down Payment:</span> Rp {simulation.downPayment.toLocaleString()}
                          </div>
                        )}
                        {simulation.tenor && (
                          <div>
                            <span className="font-medium">Tenor:</span> {Number(simulation.tenor)} months
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="font-medium">Address:</span> {simulation.address}
                        </div>
                        {simulation.notes && (
                          <div className="col-span-2">
                            <span className="font-medium">Notes:</span> {simulation.notes}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Date:</span> {simulation.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSimulations.length === 0 && (
                  <div className="admin-empty-state">No simulations found</div>
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
