import React, { useState, useEffect } from 'react';
import { ServiceOrder, OrderStatus, InventoryItem, RequiredPart, PaymentStatus } from '../types';

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
  order: ServiceOrder | null;
  inventory: InventoryItem[];
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({ isOpen, onClose, onSave, order, inventory }) => {
  const [clientName, setClientName] = useState('');
  const [equipment, setEquipment] = useState('');
  const [defect, setDefect] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.Pending);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
  const [requiredParts, setRequiredParts] = useState<RequiredPart[]>([]);

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [partQuantity, setPartQuantity] = useState<number>(1);

  useEffect(() => {
    if (order) {
      setClientName(order.clientName);
      setEquipment(order.equipment);
      setDefect(order.defect);
      setStatus(order.status);
      setPaymentStatus(order.paymentStatus);
      setRequiredParts(order.requiredParts || []);
    } else {
      setClientName('');
      setEquipment('');
      setDefect('');
      setStatus(OrderStatus.Pending);
      setPaymentStatus(PaymentStatus.Pending);
      setRequiredParts([]);
    }
    setSelectedPartId('');
    setPartQuantity(1);
  }, [order, isOpen]);

  const handleAddPart = () => {
    if (!selectedPartId || partQuantity <= 0) {
      alert("Selecione uma peça e uma quantidade válida.");
      return;
    }
    const partToAdd = inventory.find(item => item.id === Number(selectedPartId));
    if (!partToAdd) return;

    const existingPartIndex = requiredParts.findIndex(p => p.inventoryItemId === partToAdd.id);
    const currentQuantityInOrder = existingPartIndex !== -1 ? requiredParts[existingPartIndex].quantity : 0;
    
    // For editing, available stock is current stock + what was in the order originally
    const originalPartQuantity = order?.requiredParts.find(p => p.inventoryItemId === partToAdd.id)?.quantity || 0;
    const availableStock = partToAdd.quantity + originalPartQuantity;
    
    if (partQuantity > availableStock) {
        alert(`Estoque insuficiente. Disponível: ${availableStock}`);
        return;
    }

    if (existingPartIndex !== -1) {
        const updatedParts = [...requiredParts];
        updatedParts[existingPartIndex].quantity = partQuantity;
        setRequiredParts(updatedParts);
    } else {
         setRequiredParts([...requiredParts, {
            inventoryItemId: partToAdd.id,
            name: partToAdd.name,
            quantity: partQuantity,
            price: partToAdd.price,
        }]);
    }
    setSelectedPartId('');
    setPartQuantity(1);
  };

  const handleRemovePart = (partId: number) => {
    setRequiredParts(requiredParts.filter(p => p.inventoryItemId !== partId));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !equipment || !defect) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    const savedOrder = {
        ...(order || {}),
        clientName,
        equipment,
        defect,
        status,
        paymentStatus,
        requiredParts,
    };
    onSave(savedOrder);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg m-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            {order ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-muted-foreground hover:bg-secondary">
             <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nome do Cliente</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Equipamento</label>
              <input type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Defeito Reclamado</label>
              <textarea value={defect} onChange={(e) => setDefect(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none min-h-[100px]" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status do Reparo</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" >
                        {Object.values(OrderStatus).map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status do Pagamento</label>
                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" >
                        {Object.values(PaymentStatus).map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                </div>
            </div>
            <div className="border-t border-border pt-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Peças Necessárias</h3>
                {requiredParts.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {requiredParts.map(part => (
                            <div key={part.inventoryItemId} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                                <div>
                                    <p className="font-semibold text-secondary-foreground">{part.name}</p>
                                    <p className="text-xs text-muted-foreground">Qtd: {part.quantity} | Preço Unit.: R$ {part.price.toFixed(2).replace('.',',')}</p>
                                </div>
                                <button type="button" onClick={() => handleRemovePart(part.inventoryItemId)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Peça</label>
                        <select value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none">
                            <option value="" disabled>Selecione uma peça</option>
                            {inventory.map(item => (<option key={item.id} value={item.id}>{item.name} ({item.quantity} em estoque)</option>))}
                        </select>
                    </div>
                    <div className="w-24">
                         <label className="block text-sm font-medium text-muted-foreground mb-1">Qtd.</label>
                         <input type="number" min="1" value={partQuantity} onChange={e => setPartQuantity(Number(e.target.value))} className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" />
                    </div>
                    <button type="button" onClick={handleAddPart} className="px-3 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-accent h-10">
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-border bg-secondary/50 rounded-b-lg gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md border border-border hover:bg-accent">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderModal;