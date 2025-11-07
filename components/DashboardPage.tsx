import React, { useState } from 'react';
import { User, ServiceOrder, InventoryItem, OrderStatus, PaymentStatus } from '../types';
import Header from './Header';
import ServiceOrderList from './ServiceOrderList';
import InventoryList from './InventoryList';
import ServiceOrderModal from './ServiceOrderModal';
import InventoryModal from './InventoryModal';
import ConfirmModal from './ConfirmModal';

// Mock Data
const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Tela LCD iPhone 11', description: 'Tela de reposição para iPhone 11', quantity: 10, price: 250.00 },
  { id: 2, name: 'Bateria Samsung A51', description: 'Bateria original para Samsung Galaxy A51', quantity: 15, price: 120.50 },
  { id: 3, name: 'Conector de Carga USB-C', description: 'Conector genérico para celulares com entrada USB-C', quantity: 30, price: 45.00 },
  { id: 4, name: 'Câmera Traseira Moto G8', description: 'Módulo de câmera traseira para Motorola Moto G8', quantity: 5, price: 180.00 },
];

const initialOrders: ServiceOrder[] = [
  { id: 1, clientName: 'João Silva', equipment: 'iPhone 11', defect: 'Tela quebrada', status: OrderStatus.InProgress, paymentStatus: PaymentStatus.Pending, technician: 'tecnico', createdAt: '2023-10-26T10:00:00Z', requiredParts: [{ inventoryItemId: 1, name: 'Tela LCD iPhone 11', quantity: 1, price: 250.00 }] },
  { id: 2, clientName: 'Maria Oliveira', equipment: 'Samsung A51', defect: 'Não liga, possível problema na bateria', status: OrderStatus.Pending, paymentStatus: PaymentStatus.Pending, technician: 'tecnico', createdAt: '2023-10-27T14:30:00Z', requiredParts: [] },
  { id: 3, clientName: 'Carlos Pereira', equipment: 'Macbook Pro 2019', defect: 'Teclado não funciona', status: OrderStatus.Completed, paymentStatus: PaymentStatus.Paid, technician: 'tecnico', createdAt: '2023-10-20T09:00:00Z', requiredParts: [] },
  { id: 4, clientName: 'Ana Costa', equipment: 'Motorola Moto G8', defect: 'Câmera não foca', status: OrderStatus.Completed, paymentStatus: PaymentStatus.Paid, technician: 'tecnico', createdAt: '2023-10-22T11:00:00Z', requiredParts: [{ inventoryItemId: 4, name: 'Câmera Traseira Moto G8', quantity: 1, price: 180.00 }] },
];

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  
  // Modals state
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'order' | 'inventory', id: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveOrder = (orderToSave: ServiceOrder) => {
    let updatedInventory = [...inventory];
    
    // Logic to update inventory based on parts used
    const originalOrder = serviceOrders.find(o => o.id === orderToSave.id);
    
    // Return parts to stock from original order
    if (originalOrder) {
      originalOrder.requiredParts.forEach(originalPart => {
        const inventoryItem = updatedInventory.find(i => i.id === originalPart.inventoryItemId);
        if (inventoryItem) inventoryItem.quantity += originalPart.quantity;
      });
    }

    // Remove parts from stock for new/updated order
    orderToSave.requiredParts.forEach(newPart => {
      const inventoryItem = updatedInventory.find(i => i.id === newPart.inventoryItemId);
      if (inventoryItem) inventoryItem.quantity -= newPart.quantity;
    });

    setInventory(updatedInventory);

    if (orderToSave.id) {
      setServiceOrders(serviceOrders.map(order => order.id === orderToSave.id ? orderToSave : order));
    } else {
      const newOrder: ServiceOrder = {
        ...orderToSave,
        id: Date.now(),
        technician: user.username,
        createdAt: new Date().toISOString(),
      };
      setServiceOrders([newOrder, ...serviceOrders]);
    }
    setEditingOrder(null);
    setOrderModalOpen(false);
  };

  const handleDeleteOrder = (orderId: number) => {
    setItemToDelete({ type: 'order', id: orderId });
    setConfirmModalOpen(true);
  };

  const handleStatusChange = (orderId: number, status: OrderStatus) => {
    setServiceOrders(serviceOrders.map(order => order.id === orderId ? { ...order, status } : order));
  };
  
  const handlePaymentStatusChange = (orderId: number, paymentStatus: PaymentStatus) => {
      setServiceOrders(serviceOrders.map(order => order.id === orderId ? { ...order, paymentStatus } : order));
  };

  const handleSaveInventoryItem = (itemToSave: InventoryItem) => {
    if (itemToSave.id) {
      setInventory(inventory.map(item => item.id === itemToSave.id ? itemToSave : item));
    } else {
      const newItem: InventoryItem = {
        ...itemToSave,
        id: Date.now(),
      };
      setInventory([newItem, ...inventory]);
    }
    setEditingItem(null);
    setInventoryModalOpen(false);
  };

  const handleDeleteInventoryItem = (itemId: number) => {
    // Check if the item is being used in any service order
    const isItemInUse = serviceOrders.some(order => 
        order.requiredParts.some(part => part.inventoryItemId === itemId)
    );
    if (isItemInUse) {
        alert("Este item não pode ser excluído pois está associado a uma ou mais Ordens de Serviço.");
        return;
    }
    setItemToDelete({ type: 'inventory', id: itemId });
    setConfirmModalOpen(true);
  };
  
  const confirmDeletion = () => {
      if (!itemToDelete) return;

      if (itemToDelete.type === 'order') {
          // Logic to return parts to inventory when deleting an order
          const orderToDelete = serviceOrders.find(o => o.id === itemToDelete.id);
          if (orderToDelete) {
              const updatedInventory = [...inventory];
              orderToDelete.requiredParts.forEach(part => {
                  const inventoryItem = updatedInventory.find(i => i.id === part.inventoryItemId);
                  if (inventoryItem) inventoryItem.quantity += part.quantity;
              });
              setInventory(updatedInventory);
          }
          setServiceOrders(serviceOrders.filter(order => order.id !== itemToDelete.id));
      } else if (itemToDelete.type === 'inventory') {
          setInventory(inventory.filter(item => item.id !== itemToDelete.id));
      }
      
      setConfirmModalOpen(false);
      setItemToDelete(null);
  };

  const openOrderModal = (order: ServiceOrder | null) => {
    setEditingOrder(order);
    setOrderModalOpen(true);
  };

  const openInventoryModal = (item: InventoryItem | null) => {
    setEditingItem(item);
    setInventoryModalOpen(true);
  };

  const filteredOrders = serviceOrders.filter(order =>
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-grow p-4 sm:p-6 md:p-8 bg-secondary/30 dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
             <div className="flex bg-secondary dark:bg-secondary/50 rounded-lg p-1 border border-border w-full sm:w-auto">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-1/2 sm:w-auto ${activeTab === 'orders' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                >
                    Ordens de Serviço
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-1/2 sm:w-auto ${activeTab === 'inventory' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                >
                    Estoque
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar por cliente ou equipamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
              />
              <button 
                onClick={() => activeTab === 'orders' ? openOrderModal(null) : openInventoryModal(null)}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background whitespace-nowrap"
              >
                <PlusIcon className="h-4 w-4" />
                {activeTab === 'orders' ? 'Nova O.S.' : 'Novo Item'}
              </button>
            </div>
          </div>

          {activeTab === 'orders' ? (
            <ServiceOrderList 
              orders={filteredOrders} 
              onEdit={openOrderModal} 
              onDelete={handleDeleteOrder}
              onStatusChange={handleStatusChange}
              onPaymentStatusChange={handlePaymentStatusChange}
            />
          ) : (
            <InventoryList items={filteredInventory} onEdit={openInventoryModal} onDelete={handleDeleteInventoryItem} />
          )}
        </div>
      </main>
      
      <ServiceOrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSave={handleSaveOrder}
        order={editingOrder}
        inventory={inventory}
      />
      
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        onSave={handleSaveInventoryItem}
        item={editingItem}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeletion}
        title={`Confirmar Exclusão`}
        message={`Você tem certeza que deseja excluir este ${itemToDelete?.type === 'order' ? 'ordem de serviço' : 'item do estoque'}? Esta ação não pode ser desfeita.`}
      />

    </div>
  );
};

export default DashboardPage;