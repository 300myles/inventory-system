"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const InventoryContext = createContext(undefined)

// Dados simulados como fallback
const initialInventory = [
  {
    id: "1",
    name: "Grãos Etíopes Yirgacheffe Premium",
    category: "Grãos de Café",
    currentStock: 45,
    minStock: 20,
    maxStock: 150,
    unit: "kg",
    costPerUnit: 52.75,
    supplier: "Importadora Highland Coffee",
    lastRestocked: "2024-01-20",
    expiryDate: "2024-07-20",
    sku: "ETH-YIR-001",
    location: "Depósito A - Prateleira 1",
    barcode: "1234567890123",
    description: "Café etíope de origem única com notas florais",
    image: "/images/coffee-beans-ethiopian.jpg",
    reorderPoint: 25,
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "2",
    name: "Café Colombiano Supremo Torra Escura",
    category: "Grãos de Café",
    currentStock: 12,
    minStock: 25,
    maxStock: 100,
    unit: "kg",
    costPerUnit: 44.25,
    supplier: "South American Coffee Co.",
    lastRestocked: "2024-01-15",
    expiryDate: "2024-06-15",
    sku: "COL-SUP-002",
    location: "Depósito A - Prateleira 2",
    barcode: "1234567890124",
    description: "Café colombiano encorpado com notas de chocolate",
    image: "/images/coffee-beans-colombian.jpg",
    reorderPoint: 30,
    leadTime: 10,
    avgDailyUsage: 3.2,
  },
  {
    id: "3",
    name: "Café Brasileiro Santos Torra Média",
    category: "Grãos de Café",
    currentStock: 8,
    minStock: 20,
    maxStock: 80,
    unit: "kg",
    costPerUnit: 38.5,
    supplier: "Brazil Direct Coffee",
    lastRestocked: "2024-01-18",
    expiryDate: "2024-05-30",
    sku: "BRA-SAN-003",
    location: "Depósito A - Prateleira 3",
    barcode: "1234567890125",
    description: "Café brasileiro suave com perfil de nozes",
    image: "/images/coffee-beans-brazilian.jpg",
    reorderPoint: 25,
    leadTime: 12,
    avgDailyUsage: 2.8,
  },
  {
    id: "4",
    name: "Copos de Papel Premium 350ml",
    category: "Suprimentos",
    currentStock: 850,
    minStock: 500,
    maxStock: 3000,
    unit: "unidades",
    costPerUnit: 0.6,
    supplier: "EcoPackaging Solutions",
    lastRestocked: "2024-01-22",
    sku: "CUP-350ML-004",
    location: "Depósito B - Seção 1",
    barcode: "1234567890126",
    description: "Copos de papel biodegradáveis com marca Oliver Coffee",
    image: "/images/paper-cups.jpg",
    reorderPoint: 600,
    leadTime: 7,
    avgDailyUsage: 45,
  },
  {
    id: "5",
    name: "Leite Integral Orgânico",
    category: "Laticínios",
    currentStock: 18,
    minStock: 25,
    maxStock: 60,
    unit: "litros",
    costPerUnit: 14.25,
    supplier: "Laticínios Vale Verde",
    lastRestocked: "2024-01-24",
    expiryDate: "2024-02-02",
    sku: "LEITE-INT-005",
    location: "Geladeira - Prateleira A",
    barcode: "1234567890127",
    description: "Leite integral orgânico fresco de laticínio local",
    image: "/images/organic-milk.jpg",
    reorderPoint: 30,
    leadTime: 2,
    avgDailyUsage: 4.5,
  },
  {
    id: "6",
    name: "Leite de Aveia Alternativo",
    category: "Laticínios",
    currentStock: 24,
    minStock: 15,
    maxStock: 50,
    unit: "caixas",
    costPerUnit: 12.75,
    supplier: "Bebidas Vegetais Inc.",
    lastRestocked: "2024-01-23",
    expiryDate: "2024-03-15",
    sku: "AVEIA-LT-006",
    location: "Geladeira - Prateleira B",
    barcode: "1234567890128",
    description: "Leite de aveia cremoso para bebidas especiais",
    image: "/images/oat-milk.jpg",
    reorderPoint: 20,
    leadTime: 5,
    avgDailyUsage: 2.8,
  },
  {
    id: "7",
    name: "Xarope de Baunilha Premium",
    category: "Xaropes",
    currentStock: 6,
    minStock: 12,
    maxStock: 36,
    unit: "frascos",
    costPerUnit: 28.5,
    supplier: "Flavor Masters Co.",
    lastRestocked: "2024-01-19",
    expiryDate: "2024-12-31",
    sku: "XAR-BAN-007",
    location: "Balcão - Armário 1",
    barcode: "1234567890129",
    description: "Xarope de baunilha premium para bebidas de café",
    image: "/images/vanilla-syrup.jpg",
    reorderPoint: 15,
    leadTime: 7,
    avgDailyUsage: 1.2,
  },
  {
    id: "8",
    name: "Xarope de Caramelo Premium",
    category: "Xaropes",
    currentStock: 9,
    minStock: 12,
    maxStock: 36,
    unit: "frascos",
    costPerUnit: 29.75,
    supplier: "Flavor Masters Co.",
    lastRestocked: "2024-01-19",
    expiryDate: "2024-12-31",
    sku: "XAR-CAR-008",
    location: "Balcão - Armário 1",
    barcode: "1234567890130",
    description: "Xarope de caramelo rico para bebidas especiais",
    image: "/images/caramel-syrup.jpg",
    reorderPoint: 15,
    leadTime: 7,
    avgDailyUsage: 1.5,
  },
  {
    id: "9",
    name: "Filtros para Máquina de Espresso",
    category: "Equipamentos",
    currentStock: 75,
    minStock: 50,
    maxStock: 200,
    unit: "unidades",
    costPerUnit: 10.25,
    supplier: "Coffee Equipment Pro",
    lastRestocked: "2024-01-21",
    sku: "FILT-ESP-009",
    location: "Depósito de Equipamentos - Gaveta 1",
    barcode: "1234567890131",
    description: "Filtros de alta qualidade para máquinas de espresso",
    image: "/images/espresso-filters.jpg",
    reorderPoint: 60,
    leadTime: 5,
    avgDailyUsage: 2.5,
  },
  {
    id: "10",
    name: "Croissants Congelados Frescos",
    category: "Padaria",
    currentStock: 48,
    minStock: 60,
    maxStock: 200,
    unit: "unidades",
    costPerUnit: 6.85,
    supplier: "Fornecimento Padaria Artesanal",
    lastRestocked: "2024-01-24",
    expiryDate: "2024-04-24",
    sku: "CRO-CON-010",
    location: "Freezer - Seção A",
    barcode: "1234567890132",
    description: "Croissants congelados premium prontos para assar",
    image: "/images/croissants.jpg",
    reorderPoint: 80,
    leadTime: 3,
    avgDailyUsage: 8.5,
  },
  {
    id: "11",
    name: "Açúcar Cristal Orgânico",
    category: "Suprimentos",
    currentStock: 25,
    minStock: 15,
    maxStock: 80,
    unit: "kg",
    costPerUnit: 8.5,
    supplier: "Açúcar Doce Vida",
    lastRestocked: "2024-01-20",
    sku: "ACU-CRI-011",
    location: "Depósito B - Prateleira 2",
    barcode: "1234567890133",
    description: "Açúcar cristal orgânico para adoçar bebidas",
    image: "/images/organic-sugar.jpg",
    reorderPoint: 20,
    leadTime: 5,
    avgDailyUsage: 1.8,
  },
  {
    id: "12",
    name: "Canela em Pó Premium",
    category: "Temperos",
    currentStock: 12,
    minStock: 8,
    maxStock: 30,
    unit: "potes",
    costPerUnit: 15.75,
    supplier: "Especiarias do Brasil",
    lastRestocked: "2024-01-18",
    expiryDate: "2024-08-18",
    sku: "CAN-PO-012",
    location: "Balcão - Armário 2",
    barcode: "1234567890134",
    description: "Canela em pó premium para cappuccinos e lattes",
    image: "/images/cinnamon-powder.jpg",
    reorderPoint: 10,
    leadTime: 7,
    avgDailyUsage: 0.8,
  },
]

const initialSuppliers = [
  {
    id: "1",
    name: "Importadora Highland Coffee",
    contact: "Sarah Mitchell",
    email: "sarah@highlandcoffee.com",
    phone: "(11) 3123-4567",
    address: "Rua dos Grãos de Café, 2847, São Paulo, SP 01234-567",
    rating: 4.9,
    totalOrders: 67,
    lastOrderDate: "2024-01-20",
    paymentTerms: "30 dias",
    deliveryTime: 14,
    isActive: true,
  },
  {
    id: "2",
    name: "South American Coffee Co.",
    contact: "Carlos Rodriguez",
    email: "carlos@sacoffee.com",
    phone: "(21) 2234-5678",
    address: "Av. Importação, 1523, Rio de Janeiro, RJ 20001-234",
    rating: 4.7,
    totalOrders: 45,
    lastOrderDate: "2024-01-15",
    paymentTerms: "15 dias",
    deliveryTime: 10,
    isActive: true,
  },
  {
    id: "3",
    name: "EcoPackaging Solutions",
    contact: "Jennifer Green",
    email: "jennifer@ecopack.com",
    phone: "(11) 3345-6789",
    address: "Rua Sustentável, 789, São Paulo, SP 04567-890",
    rating: 4.6,
    totalOrders: 89,
    lastOrderDate: "2024-01-22",
    paymentTerms: "30 dias",
    deliveryTime: 7,
    isActive: true,
  },
  {
    id: "4",
    name: "Laticínios Vale Verde",
    contact: "Michael Thompson",
    email: "mike@valeverde.com",
    phone: "(19) 3456-7890",
    address: "Estrada da Fazenda, 456, Campinas, SP 13000-123",
    rating: 4.8,
    totalOrders: 234,
    lastOrderDate: "2024-01-24",
    paymentTerms: "7 dias",
    deliveryTime: 2,
    isActive: true,
  },
  {
    id: "5",
    name: "Coffee Equipment Pro",
    contact: "David Kim",
    email: "david@coffeeequippro.com",
    phone: "(11) 3567-8901",
    address: "Rua dos Equipamentos, 321, São Paulo, SP 05678-901",
    rating: 4.5,
    totalOrders: 34,
    lastOrderDate: "2024-01-21",
    paymentTerms: "30 dias",
    deliveryTime: 5,
    isActive: true,
  },
  {
    id: "6",
    name: "Brazil Direct Coffee",
    contact: "Ana Silva",
    email: "ana@brazildirect.com",
    phone: "(13) 3678-9012",
    address: "Porto de Santos, 654, Santos, SP 11000-456",
    rating: 4.4,
    totalOrders: 28,
    lastOrderDate: "2024-01-18",
    paymentTerms: "45 dias",
    deliveryTime: 12,
    isActive: true,
  },
]

const initialPurchaseOrders = [
  {
    id: "PED-2024-001",
    supplier: "Importadora Highland Coffee",
    items: [{ itemId: "1", itemName: "Grãos Etíopes Yirgacheffe Premium", quantity: 100, unitCost: 52.75 }],
    totalAmount: 5275.0,
    status: "aprovado",
    orderDate: "2024-01-25",
    expectedDelivery: "2024-02-08",
    notes: "Pedido prioritário para promoção de fim de semana",
    priority: "alta",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-002",
    supplier: "Laticínios Vale Verde",
    items: [{ itemId: "5", itemName: "Leite Integral Orgânico", quantity: 40, unitCost: 14.25 }],
    totalAmount: 570.0,
    status: "enviado",
    orderDate: "2024-01-24",
    expectedDelivery: "2024-01-26",
    priority: "urgente",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-003",
    supplier: "EcoPackaging Solutions",
    items: [{ itemId: "4", itemName: "Copos de Papel Premium 350ml", quantity: 2000, unitCost: 0.6 }],
    totalAmount: 1200.0,
    status: "entregue",
    orderDate: "2024-01-22",
    expectedDelivery: "2024-01-29",
    actualDelivery: "2024-01-28",
    priority: "media",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-004",
    supplier: "South American Coffee Co.",
    items: [{ itemId: "2", itemName: "Café Colombiano Supremo Torra Escura", quantity: 75, unitCost: 44.25 }],
    totalAmount: 3318.75,
    status: "pendente",
    orderDate: "2024-01-25",
    expectedDelivery: "2024-02-04",
    notes: "Reposição urgente necessária",
    priority: "urgente",
    createdBy: "Usuário Admin",
  },
]

const initialNotifications = [
  {
    id: "1",
    type: "estoque_baixo",
    title: "Alerta de Estoque Baixo",
    message: "Café Colombiano Supremo Torra Escura está abaixo do nível mínimo (12/25)",
    date: "2024-01-25T10:30:00Z",
    read: false,
    priority: "alta",
    actionRequired: true,
  },
  {
    id: "2",
    type: "vencimento",
    title: "Aviso de Vencimento",
    message: "Leite Integral Orgânico vence em 8 dias (02 de fev, 2024)",
    date: "2024-01-25T09:15:00Z",
    read: false,
    priority: "media",
    actionRequired: true,
  },
  {
    id: "3",
    type: "status_pedido",
    title: "Pedido Enviado",
    message: "PED-2024-002 do Laticínios Vale Verde foi enviado",
    date: "2024-01-25T08:45:00Z",
    read: true,
    priority: "baixa",
    actionRequired: false,
  },
  {
    id: "4",
    type: "estoque_baixo",
    title: "Alerta de Estoque Baixo",
    message: "Café Brasileiro Santos Torra Média está criticamente baixo (8/20)",
    date: "2024-01-25T07:20:00Z",
    read: false,
    priority: "alta",
    actionRequired: true,
  },
]

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [stockMovements, setStockMovements] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Funções de conversão para Supabase
  const convertInventoryItem = (item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    currentStock: item.current_stock,
    minStock: item.min_stock,
    maxStock: item.max_stock,
    unit: item.unit,
    costPerUnit: item.cost_per_unit,
    supplier: item.supplier,
    lastRestocked: item.last_restocked,
    expiryDate: item.expiry_date,
    sku: item.sku,
    location: item.location,
    barcode: item.barcode,
    description: item.description,
    image: item.image,
    reorderPoint: item.reorder_point,
    leadTime: item.lead_time,
    avgDailyUsage: item.avg_daily_usage,
  })

  const convertSupplier = (supplier) => ({
    id: supplier.id,
    name: supplier.name,
    contact: supplier.contact,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    rating: supplier.rating,
    totalOrders: supplier.total_orders,
    lastOrderDate: supplier.last_order_date,
    paymentTerms: supplier.payment_terms,
    deliveryTime: supplier.delivery_time,
    isActive: supplier.is_active,
  })

  const convertPurchaseOrder = (order) => ({
    id: order.id,
    supplier: order.supplier,
    items: order.items,
    totalAmount: order.total_amount,
    status: order.status,
    orderDate: order.order_date,
    expectedDelivery: order.expected_delivery,
    actualDelivery: order.actual_delivery,
    notes: order.notes,
    priority: order.priority,
    createdBy: order.created_by,
  })

  const convertStockMovement = (movement) => ({
    id: movement.id,
    itemId: movement.item_id,
    itemName: movement.item_name,
    type: movement.type,
    quantity: movement.quantity,
    reason: movement.reason,
    date: movement.date,
    user: movement.user,
    reference: movement.reference,
  })

  const convertNotification = (notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    date: notification.date,
    read: notification.read,
    priority: notification.priority,
    actionRequired: notification.action_required,
  })

  // Carregar dados do Supabase ou usar dados simulados
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured || !supabase) {
        // Usar dados simulados
        setInventory(initialInventory)
        setSuppliers(initialSuppliers)
        setPurchaseOrders(initialPurchaseOrders)
        setNotifications(initialNotifications)
        setStockMovements([])
        return
      }

      // Carregar dados do Supabase
      const [inventoryRes, suppliersRes, ordersRes, movementsRes, notificationsRes] = await Promise.all([
        supabase.from("inventory_items").select("*").order("name"),
        supabase.from("suppliers").select("*").order("name"),
        supabase.from("purchase_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("stock_movements").select("*").order("date", { ascending: false }).limit(100),
        supabase.from("notifications").select("*").order("date", { ascending: false }).limit(50),
      ])

      if (inventoryRes.error) throw inventoryRes.error
      if (suppliersRes.error) throw suppliersRes.error
      if (ordersRes.error) throw ordersRes.error
      if (movementsRes.error) throw movementsRes.error
      if (notificationsRes.error) throw notificationsRes.error

      setInventory(inventoryRes.data || [])
      setSuppliers(suppliersRes.data || [])
      setPurchaseOrders(ordersRes.data || [])
      setStockMovements(movementsRes.data || [])
      setNotifications(notificationsRes.data || [])
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")

      // Fallback para dados simulados em caso de erro
      setInventory(initialInventory)
      setSuppliers(initialSuppliers)
      setPurchaseOrders(initialPurchaseOrders)
      setNotifications(initialNotifications)
      setStockMovements([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Funções CRUD - adaptadas para funcionar com ou sem Supabase
  const addInventoryItem = async (item) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("inventory_items")
          .insert({
            name: item.name,
            category: item.category,
            current_stock: item.currentStock,
            min_stock: item.minStock,
            max_stock: item.maxStock,
            unit: item.unit,
            cost_per_unit: item.costPerUnit,
            supplier: item.supplier,
            last_restocked: item.lastRestocked,
            expiry_date: item.expiryDate,
            sku: item.sku,
            location: item.location,
            barcode: item.barcode,
            description: item.description,
            image: item.image,
            reorder_point: item.reorderPoint,
            lead_time: item.leadTime,
            avg_daily_usage: item.avgDailyUsage,
          })
          .select()
          .single()

        if (error) throw error

        const newItem = convertInventoryItem(data)
        setInventory((prev) => [...prev, newItem])

        await addStockMovement({
          itemId: newItem.id,
          itemName: newItem.name,
          type: "entrada",
          quantity: newItem.currentStock,
          reason: "Entrada inicial de estoque",
          date: new Date().toISOString(),
          user: "Sistema",
        })
      } catch (err) {
        console.error("Erro ao adicionar item:", err)
        throw err
      }
    } else {
      // Modo simulado
      const newItem = { ...item, id: Date.now().toString() }
      setInventory((prev) => [...prev, newItem])

      addStockMovement({
        itemId: newItem.id,
        itemName: newItem.name,
        type: "entrada",
        quantity: newItem.currentStock,
        reason: "Entrada inicial de estoque",
        date: new Date().toISOString(),
        user: "Sistema",
      })
    }
  }

  const updateInventoryItem = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {}
        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.category !== undefined) updateData.category = updates.category
        if (updates.currentStock !== undefined) updateData.current_stock = updates.currentStock
        if (updates.minStock !== undefined) updateData.min_stock = updates.minStock
        if (updates.maxStock !== undefined) updateData.max_stock = updates.maxStock
        if (updates.unit !== undefined) updateData.unit = updates.unit
        if (updates.costPerUnit !== undefined) updateData.cost_per_unit = updates.costPerUnit
        if (updates.supplier !== undefined) updateData.supplier = updates.supplier
        if (updates.lastRestocked !== undefined) updateData.last_restocked = updates.lastRestocked
        if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate
        if (updates.sku !== undefined) updateData.sku = updates.sku
        if (updates.location !== undefined) updateData.location = updates.location
        if (updates.barcode !== undefined) updateData.barcode = updates.barcode
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.image !== undefined) updateData.image = updates.image
        if (updates.reorderPoint !== undefined) updateData.reorder_point = updates.reorderPoint
        if (updates.leadTime !== undefined) updateData.lead_time = updates.leadTime
        if (updates.avgDailyUsage !== undefined) updateData.avg_daily_usage = updates.avgDailyUsage

        const { data, error } = await supabase.from("inventory_items").update(updateData).eq("id", id).select().single()

        if (error) throw error

        const updatedItem = convertInventoryItem(data)
        setInventory((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))

        // Rastrear mudanças de estoque
        const oldItem = inventory.find((item) => item.id === id)
        if (oldItem && updates.currentStock !== undefined && updates.currentStock !== oldItem.currentStock) {
          const difference = updates.currentStock - oldItem.currentStock
          await addStockMovement({
            itemId: id,
            itemName: oldItem.name,
            type: difference > 0 ? "entrada" : "saida",
            quantity: Math.abs(difference),
            reason: difference > 0 ? "Aumento de estoque" : "Redução de estoque",
            date: new Date().toISOString(),
            user: "Sistema",
          })
        }
      } catch (err) {
        console.error("Erro ao atualizar item:", err)
        throw err
      }
    } else {
      // Modo simulado
      setInventory((prev) => {
        const oldItem = prev.find((item) => item.id === id)
        const newItem = prev.map((item) => (item.id === id ? { ...item, ...updates } : item))

        // Rastrear mudanças de estoque
        if (oldItem && updates.currentStock !== undefined && updates.currentStock !== oldItem.currentStock) {
          const difference = updates.currentStock - oldItem.currentStock
          addStockMovement({
            itemId: id,
            itemName: oldItem.name,
            type: difference > 0 ? "entrada" : "saida",
            quantity: Math.abs(difference),
            reason: difference > 0 ? "Aumento de estoque" : "Redução de estoque",
            date: new Date().toISOString(),
            user: "Sistema",
          })
        }

        return newItem
      })
    }
  }

  const deleteInventoryItem = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const item = inventory.find((i) => i.id === id)

        const { error } = await supabase.from("inventory_items").delete().eq("id", id)

        if (error) throw error

        setInventory((prev) => prev.filter((item) => item.id !== id))

        if (item) {
          await addStockMovement({
            itemId: id,
            itemName: item.name,
            type: "saida",
            quantity: item.currentStock,
            reason: "Item removido do sistema",
            date: new Date().toISOString(),
            user: "Sistema",
          })
        }
      } catch (err) {
        console.error("Erro ao deletar item:", err)
        throw err
      }
    } else {
      // Modo simulado
      const item = inventory.find((i) => i.id === id)
      if (item) {
        addStockMovement({
          itemId: id,
          itemName: item.name,
          type: "saida",
          quantity: item.currentStock,
          reason: "Item removido do sistema",
          date: new Date().toISOString(),
          user: "Sistema",
        })
      }
      setInventory((prev) => prev.filter((item) => item.id !== id))
    }
  }

  // Implementar outras funções CRUD de forma similar...
  const addSupplier = async (supplier) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("suppliers")
          .insert({
            name: supplier.name,
            contact: supplier.contact,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            rating: supplier.rating,
            total_orders: supplier.totalOrders,
            last_order_date: supplier.lastOrderDate,
            payment_terms: supplier.paymentTerms,
            delivery_time: supplier.deliveryTime,
            is_active: supplier.isActive,
          })
          .select()
          .single()

        if (error) throw error

        const newSupplier = convertSupplier(data)
        setSuppliers((prev) => [...prev, newSupplier])
      } catch (err) {
        console.error("Erro ao adicionar fornecedor:", err)
        throw err
      }
    } else {
      const newSupplier = { ...supplier, id: Date.now().toString() }
      setSuppliers((prev) => [...prev, newSupplier])
    }
  }

  const updateSupplier = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {}
        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.contact !== undefined) updateData.contact = updates.contact
        if (updates.email !== undefined) updateData.email = updates.email
        if (updates.phone !== undefined) updateData.phone = updates.phone
        if (updates.address !== undefined) updateData.address = updates.address
        if (updates.rating !== undefined) updateData.rating = updates.rating
        if (updates.totalOrders !== undefined) updateData.total_orders = updates.totalOrders
        if (updates.lastOrderDate !== undefined) updateData.last_order_date = updates.lastOrderDate
        if (updates.paymentTerms !== undefined) updateData.payment_terms = updates.paymentTerms
        if (updates.deliveryTime !== undefined) updateData.delivery_time = updates.deliveryTime
        if (updates.isActive !== undefined) updateData.is_active = updates.isActive

        const { data, error } = await supabase.from("suppliers").update(updateData).eq("id", id).select().single()

        if (error) throw error

        const updatedSupplier = convertSupplier(data)
        setSuppliers((prev) => prev.map((supplier) => (supplier.id === id ? updatedSupplier : supplier)))
      } catch (err) {
        console.error("Erro ao atualizar fornecedor:", err)
        throw err
      }
    } else {
      setSuppliers((prev) => prev.map((supplier) => (supplier.id === id ? { ...supplier, ...updates } : supplier)))
    }
  }

  const deleteSupplier = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("suppliers").delete().eq("id", id)

        if (error) throw error

        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
      } catch (err) {
        console.error("Erro ao deletar fornecedor:", err)
        throw err
      }
    } else {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
    }
  }

  const addPurchaseOrder = async (order) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("purchase_orders")
          .insert({
            supplier: order.supplier,
            items: order.items,
            total_amount: order.totalAmount,
            status: order.status,
            order_date: order.orderDate,
            expected_delivery: order.expectedDelivery,
            actual_delivery: order.actualDelivery,
            notes: order.notes,
            priority: order.priority,
            created_by: order.createdBy,
          })
          .select()
          .single()

        if (error) throw error

        const newOrder = convertPurchaseOrder(data)
        setPurchaseOrders((prev) => [...prev, newOrder])

        await addNotification({
          type: "status_pedido",
          title: "Novo Pedido de Compra",
          message: `Pedido de compra ${newOrder.id} criado para ${newOrder.supplier}`,
          date: new Date().toISOString(),
          read: false,
          priority: "baixa",
          actionRequired: false,
        })
      } catch (err) {
        console.error("Erro ao adicionar pedido:", err)
        throw err
      }
    } else {
      const newOrder = { ...order, id: `PED-2024-${String(purchaseOrders.length + 1).padStart(3, "0")}` }
      setPurchaseOrders((prev) => [...prev, newOrder])

      addNotification({
        type: "status_pedido",
        title: "Novo Pedido de Compra",
        message: `Pedido de compra ${newOrder.id} criado para ${newOrder.supplier}`,
        date: new Date().toISOString(),
        read: false,
        priority: "baixa",
        actionRequired: false,
      })
    }
  }

  const updatePurchaseOrder = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {}
        if (updates.supplier !== undefined) updateData.supplier = updates.supplier
        if (updates.items !== undefined) updateData.items = updates.items
        if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount
        if (updates.status !== undefined) updateData.status = updates.status
        if (updates.orderDate !== undefined) updateData.order_date = updates.orderDate
        if (updates.expectedDelivery !== undefined) updateData.expected_delivery = updates.expectedDelivery
        if (updates.actualDelivery !== undefined) updateData.actual_delivery = updates.actualDelivery
        if (updates.notes !== undefined) updateData.notes = updates.notes
        if (updates.priority !== undefined) updateData.priority = updates.priority
        if (updates.createdBy !== undefined) updateData.created_by = updates.createdBy

        const { data, error } = await supabase.from("purchase_orders").update(updateData).eq("id", id).select().single()

        if (error) throw error

        const updatedOrder = convertPurchaseOrder(data)
        setPurchaseOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder : order)))

        if (updates.status) {
          await addNotification({
            type: "status_pedido",
            title: "Status do Pedido Atualizado",
            message: `Status do pedido ${id} alterado para ${updates.status}`,
            date: new Date().toISOString(),
            read: false,
            priority: "baixa",
            actionRequired: false,
          })
        }
      } catch (err) {
        console.error("Erro ao atualizar pedido:", err)
        throw err
      }
    } else {
      setPurchaseOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...updates } : order)))

      if (updates.status) {
        addNotification({
          type: "status_pedido",
          title: "Status do Pedido Atualizado",
          message: `Status do pedido ${id} alterado para ${updates.status}`,
          date: new Date().toISOString(),
          read: false,
          priority: "baixa",
          actionRequired: false,
        })
      }
    }
  }

  const addStockMovement = async (movement) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("stock_movements")
          .insert({
            item_id: movement.itemId,
            item_name: movement.itemName,
            type: movement.type,
            quantity: movement.quantity,
            reason: movement.reason,
            date: movement.date,
            user: movement.user,
            reference: movement.reference,
          })
          .select()
          .single()

        if (error) throw error

        const newMovement = convertStockMovement(data)
        setStockMovements((prev) => [newMovement, ...prev.slice(0, 99)])
      } catch (err) {
        console.error("Erro ao adicionar movimentação:", err)
        throw err
      }
    } else {
      const newMovement = { ...movement, id: Date.now().toString() }
      setStockMovements((prev) => [newMovement, ...prev])
    }
  }

  const markNotificationRead = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

        if (error) throw error

        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
      } catch (err) {
        console.error("Erro ao marcar notificação como lida:", err)
        throw err
      }
    } else {
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }
  }

  const addNotification = async (notification) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .insert({
            type: notification.type,
            title: notification.title,
            message: notification.message,
            date: notification.date,
            read: notification.read,
            priority: notification.priority,
            action_required: notification.actionRequired,
          })
          .select()
          .single()

        if (error) throw error

        const newNotification = convertNotification(data)
        setNotifications((prev) => [newNotification, ...prev.slice(0, 49)])
      } catch (err) {
        console.error("Erro ao adicionar notificação:", err)
        throw err
      }
    } else {
      const newNotification = { ...notification, id: Date.now().toString() }
      setNotifications((prev) => [newNotification, ...prev])
    }
  }

  // Funções utilitárias
  const getStockPrediction = (itemId, days) => {
    const item = inventory.find((i) => i.id === itemId)
    if (!item) return 0

    const predictedUsage = item.avgDailyUsage * days
    return Math.max(0, item.currentStock - predictedUsage)
  }

  const getLowStockItems = () => {
    return inventory.filter((item) => item.currentStock <= item.minStock)
  }

  const getExpiringItems = (days) => {
    const today = new Date()
    return inventory.filter((item) => {
      if (!item.expiryDate) return false
      const expiryDate = new Date(item.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= days && daysUntilExpiry > 0
    })
  }

  const refreshData = async () => {
    await loadData()
  }

  // Auto-gerar notificações para estoque baixo e itens vencendo
  useEffect(() => {
    if (inventory.length === 0) return

    const checkLowStock = async () => {
      const lowStockItems = getLowStockItems()
      for (const item of lowStockItems) {
        const existingNotification = notifications.find(
          (n) => n.type === "estoque_baixo" && n.message.includes(item.name) && !n.read,
        )
        if (!existingNotification) {
          await addNotification({
            type: "estoque_baixo",
            title: "Alerta de Estoque Baixo",
            message: `${item.name} está abaixo do nível mínimo (${item.currentStock}/${item.minStock})`,
            date: new Date().toISOString(),
            read: false,
            priority: item.currentStock <= item.minStock * 0.5 ? "alta" : "media",
            actionRequired: true,
          })
        }
      }
    }

    const checkExpiring = async () => {
      const expiringItems = getExpiringItems(14)
      for (const item of expiringItems) {
        const existingNotification = notifications.find(
          (n) => n.type === "vencimento" && n.message.includes(item.name) && !n.read,
        )
        if (!existingNotification && item.expiryDate) {
          const today = new Date()
          const expiryDate = new Date(item.expiryDate)
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          await addNotification({
            type: "vencimento",
            title: "Aviso de Vencimento",
            message: `${item.name} vence em ${daysUntilExpiry} dias (${item.expiryDate})`,
            date: new Date().toISOString(),
            read: false,
            priority: daysUntilExpiry <= 7 ? "alta" : "media",
            actionRequired: true,
          })
        }
      }
    }

    checkLowStock()
    checkExpiring()
  }, [inventory])

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        suppliers,
        purchaseOrders,
        stockMovements,
        notifications,
        loading,
        error,
        isUsingSupabase: isSupabaseConfigured,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPurchaseOrder,
        updatePurchaseOrder,
        addStockMovement,
        markNotificationRead,
        addNotification,
        getStockPrediction,
        getLowStockItems,
        getExpiringItems,
        refreshData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory deve ser usado dentro de um InventoryProvider")
  }
  return context
}
