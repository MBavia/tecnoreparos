export enum OrderStatus {
  Pending = 'Pendente',
  InProgress = 'Em Reparo',
  Completed = 'Concluído',
  Canceled = 'Cancelado',
}

export enum PaymentStatus {
  Pending = 'Pendente',
  Paid = 'Pago',
}

export interface RequiredPart {
  inventoryItemId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface ServiceOrder {
  id: number;
  clientName: string;
  equipment: string;
  defect: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  technician: string;
  createdAt: string;
  requiredParts: RequiredPart[];
}

export interface User {
  username: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}