
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  item: InventoryItem | null;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);


const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setQuantity(item.quantity);
      setPrice(item.price);
    } else {
      setName('');
      setDescription('');
      setQuantity(1);
      setPrice(0);
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity < 0 || price < 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }
    const savedItem = {
        ...(item || {}),
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
    };
    onSave(savedItem);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg m-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            {item ? 'Editar Item do Estoque' : 'Novo Item no Estoque'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-muted-foreground hover:bg-secondary">
             <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nome do Item</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
                required
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
                    required
                    min="0"
                  />
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-border bg-secondary/50 rounded-b-lg gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md border border-border hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
