import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface CrudTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  getItemKey: (item: T) => string | number;
  showPublished?: boolean;
}

export default function CrudTable<T extends { published?: boolean }>({
  data,
  columns,
  onEdit,
  onDelete,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  getItemKey,
  showPublished = false
}: CrudTableProps<T>) {
  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="admin-search-input pl-10"
          />
        </div>
      )}
      
      <div className="admin-table-container">
        <Table>
          <TableHeader className="admin-table-header">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {showPublished && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (showPublished ? 2 : 1)} className="admin-empty-state">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={getItemKey(item)} className="admin-table-row">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="admin-table-cell">
                      {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                    </TableCell>
                  ))}
                  {showPublished && (
                    <TableCell className="admin-table-cell">
                      <span className={item.published ? 'admin-badge-published' : 'admin-badge-draft'}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="admin-table-cell text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="admin-action-btn"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="admin-action-btn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
