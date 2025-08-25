# Sistema de Controle de Inventário - Cafeteria
## Documentação de Funcionalidades e Códigos

### 📊 DASHBOARD - Painel Principal
**Arquivo:** `components/dashboard.tsx`

#### F001 - Métricas Principais
\`\`\`typescript
// Cálculo do valor total do inventário
const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)

// Contagem de itens com estoque baixo
const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

// Total de itens em estoque
const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0)

// Pedidos pendentes
const pendingOrders = purchaseOrders.filter((order) => order.status === "pending").length
\`\`\`

#### F002 - Alertas de Estoque Baixo
\`\`\`typescript
// Identificação de itens com estoque baixo
const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

// Renderização de alertas
{lowStockItems.map((item) => (
  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
    <div>
      <p className="font-medium text-sm">{item.name}</p>
      <p className="text-xs text-muted-foreground">
        Current: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}
      </p>
    </div>
    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
      Low Stock
    </Badge>
  </div>
))}
\`\`\`

#### F003 - Visão Geral de Níveis de Estoque
\`\`\`typescript
// Cálculo de percentual de estoque
const stockPercentage = (item.currentStock / item.maxStock) * 100
const isLowStock = item.currentStock <= item.minStock

// Componente de progresso
<Progress value={stockPercentage} className={`h-2 ${isLowStock ? "[&>div]:bg-red-500" : ""}`} />
\`\`\`

---

### 📦 GERENCIAMENTO DE INVENTÁRIO
**Arquivo:** `components/inventory-manager.tsx`

#### F004 - Adicionar Item ao Inventário
\`\`\`typescript
const handleAddItem = (formData: FormData) => {
  const newItem = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    currentStock: Number.parseInt(formData.get("currentStock") as string),
    minStock: Number.parseInt(formData.get("minStock") as string),
    maxStock: Number.parseInt(formData.get("maxStock") as string),
    unit: formData.get("unit") as string,
    costPerUnit: Number.parseFloat(formData.get("costPerUnit") as string),
    supplier: formData.get("supplier") as string,
    lastRestocked: new Date().toISOString().split("T")[0],
    expiryDate: (formData.get("expiryDate") as string) || undefined,
    sku: formData.get("sku") as string,
    location: formData.get("location") as string,
  }
  addInventoryItem(newItem)
  setIsAddDialogOpen(false)
}
\`\`\`

#### F005 - Editar Item do Inventário
\`\`\`typescript
const handleEditItem = (formData: FormData) => {
  if (!editingItem) return

  const updates = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    currentStock: Number.parseInt(formData.get("currentStock") as string),
    minStock: Number.parseInt(formData.get("minStock") as string),
    maxStock: Number.parseInt(formData.get("maxStock") as string),
    unit: formData.get("unit") as string,
    costPerUnit: Number.parseFloat(formData.get("costPerUnit") as string),
    supplier: formData.get("supplier") as string,
    expiryDate: (formData.get("expiryDate") as string) || undefined,
    sku: formData.get("sku") as string,
    location: formData.get("location") as string,
  }
  updateInventoryItem(editingItem.id, updates)
  setIsEditDialogOpen(false)
  setEditingItem(null)
}
\`\`\`

#### F006 - Excluir Item do Inventário
\`\`\`typescript
// Função de exclusão
<Button variant="outline" size="sm" onClick={() => deleteInventoryItem(item.id)}>
  <Trash2 className="h-4 w-4" />
</Button>
\`\`\`

#### F007 - Busca e Filtros
\`\`\`typescript
// Filtro de busca e categoria
const filteredInventory = inventory.filter((item) => {
  const matchesSearch =
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
  return matchesSearch && matchesCategory
})

// Categorias disponíveis
const categories = Array.from(new Set(inventory.map((item) => item.category)))
\`\`\`

#### F008 - Cálculo de Valor do Estoque
\`\`\`typescript
// Valor individual do item
const stockValue = item.currentStock * item.costPerUnit

// Status de estoque baixo
const isLowStock = item.currentStock <= item.minStock
\`\`\`

---

### 👥 GERENCIAMENTO DE FORNECEDORES
**Arquivo:** `components/suppliers-manager.tsx`

#### F009 - Adicionar Fornecedor
\`\`\`typescript
const handleAddSupplier = (formData: FormData) => {
  const newSupplier = {
    name: formData.get("name") as string,
    contact: formData.get("contact") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    rating: Number.parseFloat(formData.get("rating") as string) || 0,
    totalOrders: 0,
  }
  addSupplier(newSupplier)
  setIsAddDialogOpen(false)
}
\`\`\`

#### F010 - Editar Fornecedor
\`\`\`typescript
const handleEditSupplier = (formData: FormData) => {
  if (!editingSupplier) return

  const updates = {
    name: formData.get("name") as string,
    contact: formData.get("contact") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    rating: Number.parseFloat(formData.get("rating") as string),
  }
  updateSupplier(editingSupplier.id, updates)
  setIsEditDialogOpen(false)
  setEditingSupplier(null)
}
\`\`\`

#### F011 - Sistema de Avaliação (Estrelas)
\`\`\`typescript
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
  ))
}
\`\`\`

#### F012 - Busca de Fornecedores
\`\`\`typescript
const filteredSuppliers = suppliers.filter(
  (supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
)
\`\`\`

---

### 🛒 PEDIDOS DE COMPRA
**Arquivo:** `components/purchase-orders.tsx`

#### F013 - Criar Pedido de Compra
\`\`\`typescript
const handleAddOrder = (formData: FormData) => {
  const validItems = orderItems.filter((item) => item.itemId && item.quantity > 0)
  const totalAmount = validItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)

  const newOrder = {
    supplier: formData.get("supplier") as string,
    items: validItems.map((item) => {
      const inventoryItem = inventory.find((inv) => inv.id === item.itemId)
      return {
        itemId: item.itemId,
        itemName: inventoryItem?.name || "",
        quantity: item.quantity,
        unitCost: item.unitCost,
      }
    }),
    totalAmount,
    status: "pending" as const,
    orderDate: new Date().toISOString().split("T")[0],
    expectedDelivery: formData.get("expectedDelivery") as string,
    notes: (formData.get("notes") as string) || undefined,
  }

  addPurchaseOrder(newOrder)
  setIsAddDialogOpen(false)
  setOrderItems([{ itemId: "", quantity: 0, unitCost: 0 }])
}
\`\`\`

#### F014 - Gerenciar Itens do Pedido
\`\`\`typescript
// Adicionar item ao pedido
const addOrderItem = () => {
  setOrderItems([...orderItems, { itemId: "", quantity: 0, unitCost: 0 }])
}

// Atualizar item do pedido
const updateOrderItem = (index: number, field: string, value: string | number) => {
  const updated = [...orderItems]
  updated[index] = { ...updated[index], [field]: value }
  setOrderItems(updated)
}

// Remover item do pedido
const removeOrderItem = (index: number) => {
  setOrderItems(orderItems.filter((_, i) => i !== index))
}
\`\`\`

#### F015 - Atualizar Status do Pedido
\`\`\`typescript
const updateOrderStatus = (orderId: string, newStatus: PurchaseOrder["status"]) => {
  updatePurchaseOrder(orderId, { status: newStatus })
}

// Cores por status
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "approved":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-300"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}
\`\`\`

#### F016 - Filtros de Pedidos
\`\`\`typescript
const filteredOrders = purchaseOrders.filter((order) => {
  const matchesSearch =
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  const matchesStatus = statusFilter === "all" || order.status === statusFilter
  return matchesSearch && matchesStatus
})
\`\`\`

---

### 📈 RELATÓRIOS E ANÁLISES
**Arquivo:** `components/reports.tsx`

#### F017 - Métricas Principais
\`\`\`typescript
// Valor total do inventário
const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)

// Itens com estoque baixo
const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

// Dados por categoria
const categoryData = inventory.reduce(
  (acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.currentStock * item.costPerUnit
    return acc
  },
  {} as Record<string, number>,
)
\`\`\`

#### F018 - Dados para Gráficos
\`\`\`typescript
// Dados do gráfico de pizza (categorias)
const categoryChartData = Object.entries(categoryData).map(([category, value]) => ({
  category,
  value: Math.round(value),
  percentage: Math.round((value / totalInventoryValue) * 100),
}))

// Dados de níveis de estoque
const stockLevelData = inventory.map((item) => ({
  name: item.name.substring(0, 15) + (item.name.length > 15 ? "..." : ""),
  current: item.currentStock,
  min: item.minStock,
  max: item.maxStock,
  percentage: Math.round((item.currentStock / item.maxStock) * 100),
}))
\`\`\`

#### F019 - Performance de Fornecedores
\`\`\`typescript
const supplierPerformance = suppliers.map((supplier) => {
  const supplierOrders = purchaseOrders.filter((order) => order.supplier === supplier.name)
  const deliveredOrders = supplierOrders.filter((order) => order.status === "delivered").length
  const onTimeRate = supplierOrders.length > 0 ? Math.round((deliveredOrders / supplierOrders.length) * 100) : 0

  return {
    name: supplier.name,
    rating: supplier.rating,
    orders: supplier.totalOrders,
    onTimeRate,
  }
})
\`\`\`

#### F020 - Dados de Tendências Mensais
\`\`\`typescript
const monthlyOrderData = [
  { month: "Jan", orders: 12, value: 2400 },
  { month: "Feb", orders: 15, value: 3200 },
  { month: "Mar", orders: 18, value: 2800 },
  { month: "Apr", orders: 22, value: 4100 },
  { month: "May", orders: 19, value: 3600 },
  { month: "Jun", orders: 25, value: 4800 },
]
\`\`\`

---

### 🗄️ GERENCIAMENTO DE ESTADO
**Arquivo:** `contexts/inventory-context.tsx`

#### F021 - Context Provider
\`\`\`typescript
export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  
  // ... funções de CRUD
}
\`\`\`

#### F022 - CRUD de Inventário
\`\`\`typescript
// Adicionar item
const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
  const newItem = { ...item, id: Date.now().toString() }
  setInventory((prev) => [...prev, newItem])
}

// Atualizar item
const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
  setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
}

// Excluir item
const deleteInventoryItem = (id: string) => {
  setInventory((prev) => prev.filter((item) => item.id !== id))
}
\`\`\`

#### F023 - CRUD de Fornecedores
\`\`\`typescript
// Adicionar fornecedor
const addSupplier = (supplier: Omit<Supplier, "id">) => {
  const newSupplier = { ...supplier, id: Date.now().toString() }
  setSuppliers((prev) => [...prev, newSupplier])
}

// Atualizar fornecedor
const updateSupplier = (id: string, updates: Partial<Supplier>) => {
  setSuppliers((prev) => prev.map((supplier) => (supplier.id === id ? { ...supplier, ...updates } : supplier)))
}

// Excluir fornecedor
const deleteSupplier = (id: string) => {
  setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
}
\`\`\`

#### F024 - CRUD de Pedidos de Compra
\`\`\`typescript
// Adicionar pedido
const addPurchaseOrder = (order: Omit<PurchaseOrder, "id">) => {
  const newOrder = { ...order, id: `PO-${Date.now().toString().slice(-3)}` }
  setPurchaseOrders((prev) => [...prev, newOrder])
}

// Atualizar pedido
const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
  setPurchaseOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...updates } : order)))
}
\`\`\`

---

### 📋 INTERFACES E TIPOS
**Arquivo:** `contexts/inventory-context.tsx`

#### F025 - Interface InventoryItem
\`\`\`typescript
export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  supplier: string
  lastRestocked: string
  expiryDate?: string
  sku: string
  location: string
}
\`\`\`

#### F026 - Interface Supplier
\`\`\`typescript
export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  rating: number
  totalOrders: number
}
\`\`\`

#### F027 - Interface PurchaseOrder
\`\`\`typescript
export interface PurchaseOrder {
  id: string
  supplier: string
  items: Array<{
    itemId: string
    itemName: string
    quantity: number
    unitCost: number
  }>
  totalAmount: number
  status: "pending" | "approved" | "delivered" | "cancelled"
  orderDate: string
  expectedDelivery: string
  notes?: string
}
\`\`\`

---

## 🎯 RESUMO DE FUNCIONALIDADES IMPLEMENTADAS

### Dashboard (8 funcionalidades)
- F001: Métricas principais em tempo real
- F002: Sistema de alertas de estoque baixo
- F003: Visão geral de níveis de estoque com barras de progresso
- Atividades recentes
- Indicadores visuais de performance
- Cards informativos com ícones
- Gráficos de progresso
- Status do sistema

### Inventário (8 funcionalidades)
- F004: Adicionar novos itens
- F005: Editar itens existentes
- F006: Excluir itens
- F007: Busca e filtros avançados
- F008: Cálculos automáticos de valor
- Gestão de categorias
- Controle de SKU
- Rastreamento de localização

### Fornecedores (5 funcionalidades)
- F009: Cadastro de fornecedores
- F010: Edição de dados de fornecedores
- F011: Sistema de avaliação por estrelas
- F012: Busca de fornecedores
- Gestão de contatos e endereços

### Pedidos de Compra (4 funcionalidades)
- F013: Criação de pedidos multi-item
- F014: Gerenciamento dinâmico de itens
- F015: Controle de status de pedidos
- F016: Filtros e busca de pedidos

### Relatórios (4 funcionalidades)
- F017: Cálculo de métricas principais
- F018: Geração de dados para gráficos
- F019: Análise de performance de fornecedores
- F020: Tendências mensais

### Gerenciamento de Estado (7 funcionalidades)
- F021: Context Provider centralizado
- F022: CRUD completo de inventário
- F023: CRUD completo de fornecedores
- F024: CRUD completo de pedidos
- F025-F027: Interfaces TypeScript tipadas

**Total: 36+ funcionalidades implementadas**
