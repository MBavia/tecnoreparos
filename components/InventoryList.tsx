
import React from 'react';
import { InventoryItem } from '../types';

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (itemId: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return <div className="text-center py-10 bg-card rounded-lg border border-border"><p className="text-muted-foreground">Nenhum item no estoque.</p></div>;
  }
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-muted-foreground">
        <thead className="text-xs uppercase bg-secondary">
          <tr>
            <th scope="col" className="px-6 py-3">Nome do Item</th>
            <th scope="col" className="px-6 py-3 hidden md:table-cell">Descrição</th>
            <th scope="col" className="px-6 py-3">Quantidade</th>
            <th scope="col" className="px-6 py-3">Preço (R$)</th>
            <th scope="col" className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 hidden md:table-cell max-w-sm truncate">{item.description}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4">{item.price.toFixed(2).replace('.', ',')}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(item)} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Editar">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2 rounded-md hover:bg-accent text-red-500 hover:text-red-600 transition-colors" aria-label="Excluir">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
