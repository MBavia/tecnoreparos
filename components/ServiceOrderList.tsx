import React, { useState } from 'react';
import { ServiceOrder, OrderStatus, PaymentStatus } from '../types';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  onEdit: (order: ServiceOrder) => void;
  onDelete: (orderId: number) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}

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

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const ORDER_STATUS_STYLES: { [key in OrderStatus]: string } = {
  [OrderStatus.Pending]: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  [OrderStatus.InProgress]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  [OrderStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  [OrderStatus.Canceled]: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const PAYMENT_STATUS_STYLES: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  [PaymentStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};


const ServiceOrderList: React.FC<ServiceOrderListProps> = ({ orders, onEdit, onDelete, onStatusChange, onPaymentStatusChange }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const handleRowClick = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  if (orders.length === 0) {
    return <div className="text-center py-10 bg-card rounded-lg border border-border"><p className="text-muted-foreground">Nenhuma ordem de serviço encontrada.</p></div>;
  }
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-muted-foreground">
        <thead className="text-xs uppercase bg-secondary/50 dark:bg-secondary/20">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">Cliente</th>
            <th scope="col" className="px-6 py-3 font-medium hidden md:table-cell">Equipamento</th>
            <th scope="col" className="px-6 py-3 font-medium">Status</th>
            <th scope="col" className="px-6 py-3 font-medium hidden sm:table-cell">Pagamento</th>
            <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr 
                className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(order.id)}
              >
                <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-2">
                     <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                     <div>
                        {order.clientName}
                        <div className="font-normal text-muted-foreground md:hidden">{order.equipment}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">{order.equipment}</td>
                <td className="px-6 py-4">
                   <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.id, e.target.value as OrderStatus)
                    }}
                    className={`text-xs font-semibold rounded-full appearance-none py-1 px-3 focus:ring-2 focus:outline-none border-0 ${ORDER_STATUS_STYLES[order.status]}`}
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                   <select
                    value={order.paymentStatus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        e.stopPropagation();
                        onPaymentStatusChange(order.id, e.target.value as PaymentStatus)
                    }}
                    className={`text-xs font-semibold rounded-full appearance-none py-1 px-3 focus:ring-2 focus:outline-none border-0 ${PAYMENT_STATUS_STYLES[order.paymentStatus]}`}
                  >
                    {Object.values(PaymentStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(order); }} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Editar">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} className="p-2 rounded-md hover:bg-accent text-red-500 hover:text-red-600 transition-colors" aria-label="Excluir">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr className="bg-secondary/30">
                  <td colSpan={5} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Detalhes do Reparo</h4>
                            <p><strong className="text-muted-foreground">Defeito:</strong> {order.defect}</p>
                            <p><strong className="text-muted-foreground">Técnico:</strong> {order.technician}</p>
                            <p><strong className="text-muted-foreground">Data de Criação:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                             <p className="flex items-center gap-2"><strong className="text-muted-foreground">Status:</strong> 
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ORDER_STATUS_STYLES[order.status]}`}>
                                    {order.status}
                                </span>
                            </p>
                            <p className="flex items-center gap-2"><strong className="text-muted-foreground">Pagamento:</strong> 
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${PAYMENT_STATUS_STYLES[order.paymentStatus]}`}>
                                    {order.paymentStatus}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Peças Utilizadas</h4>
                            {order.requiredParts.length > 0 ? (
                                <>
                                <ul className="space-y-1">
                                    {order.requiredParts.map(part => (
                                        <li key={part.inventoryItemId} className="flex justify-between">
                                            <span>{part.name} (x{part.quantity})</span>
                                            <span>R$ {(part.price * part.quantity).toFixed(2).replace('.',',')}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-foreground">
                                    <span>Custo Total das Peças:</span>
                                    <span>R$ {order.requiredParts.reduce((acc, part) => acc + (part.price * part.quantity), 0).toFixed(2).replace('.',',')}</span>
                                </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Nenhuma peça utilizada.</p>
                            )}
                        </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ServiceOrderList;