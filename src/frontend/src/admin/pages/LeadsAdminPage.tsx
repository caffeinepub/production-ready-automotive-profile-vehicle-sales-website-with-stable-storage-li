import { useState } from 'react';
import { useGetContacts, useGetCreditSimulations, useDeleteContact, useDeleteCreditSimulation } from '../hooks/useAdminCmsQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [deleteContactIndex, setDeleteContactIndex] = useState<number | null>(null);
  const [deleteSimulationIndex, setDeleteSimulationIndex] = useState<number | null>(null);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchContacts.toLowerCase()) ||
    c.email.toLowerCase().includes(searchContacts.toLowerCase())
  );

  const filteredSimulations = simulations.filter((s) =>
    s.name.toLowerCase().includes(searchSimulations.toLowerCase()) ||
    s.email.toLowerCase().includes(searchSimulations.toLowerCase())
  );

  const handleDeleteContact = async () => {
    if (deleteContactIndex === null) return;
    
    try {
      await deleteContact.mutateAsync(BigInt(deleteContactIndex));
      toast.success('Contact deleted successfully');
      setDeleteContactIndex(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete contact');
    }
  };

  const handleDeleteSimulation = async () => {
    if (deleteSimulationIndex === null) return;
    
    try {
      await deleteSimulation.mutateAsync(BigInt(deleteSimulationIndex));
      toast.success('Credit simulation deleted successfully');
      setDeleteSimulationIndex(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete credit simulation');
    }
  };

  if (contactsError || simulationsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading leads. Please check your authentication.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-8">Leads / Contact Management</h1>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList>
            <TabsTrigger value="contacts">Contact Forms ({contacts.length})</TabsTrigger>
            <TabsTrigger value="simulations">Credit Simulations ({simulations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-6">
            <div className="space-y-4">
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
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No contacts available
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContacts.map((contact, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phoneNumber}</TableCell>
                            <TableCell>{contact.unit}</TableCell>
                            <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                            <TableCell>{contact.date}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteContactIndex(idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="simulations" className="mt-6">
            <div className="space-y-4">
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
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Down Payment</TableHead>
                        <TableHead>Tenor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSimulations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                            No credit simulations available
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSimulations.map((simulation, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{simulation.name}</TableCell>
                            <TableCell>{simulation.email}</TableCell>
                            <TableCell>{simulation.phoneNumber}</TableCell>
                            <TableCell>{simulation.unit}</TableCell>
                            <TableCell>{simulation.downPayment ? `${simulation.downPayment}%` : '-'}</TableCell>
                            <TableCell>{simulation.tenor ? `${simulation.tenor} months` : '-'}</TableCell>
                            <TableCell>{simulation.date}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteSimulationIndex(idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDeleteDialog
        open={deleteContactIndex !== null}
        onOpenChange={(open) => !open && setDeleteContactIndex(null)}
        onConfirm={handleDeleteContact}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        isDeleting={deleteContact.isPending}
      />

      <ConfirmDeleteDialog
        open={deleteSimulationIndex !== null}
        onOpenChange={(open) => !open && setDeleteSimulationIndex(null)}
        onConfirm={handleDeleteSimulation}
        title="Delete Credit Simulation"
        description="Are you sure you want to delete this credit simulation? This action cannot be undone."
        isDeleting={deleteSimulation.isPending}
      />
    </>
  );
}
