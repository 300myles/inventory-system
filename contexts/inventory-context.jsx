"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getAdmin } from "@/lib/userActions";
import { SocketProvider } from "./SocketContext";

const InventoryContext = createContext(null);

// Dados simulados como fallback
const initialInventory = [
  {
    id: "1",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "2",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "3",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "4",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "5",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "6",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "7",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "8",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "9",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "10",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "11",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
  {
    id: "12",
    name: "Smart Watch",
    category: "Appliance",
    currentStock: 45,
    costPerUnit: 52.75,
    lastUpdated: "2024-01-20",
    uploadedDate: "2024-07-20",
    productID: "ETH-YIR-001",
    description: "Electric Smart Watch That Does Shit",
    image: "/images/coffee-beans-ethiopian.jpg",
    leadTime: 14,
    avgDailyUsage: 2.5,
  },
];

const initialPurchaseOrders = [
  {
    id: "PED-2024-001",
    supplier: "Johnson",
    items: [
      {
        itemId: "1",
        itemName: " Smart Watch",
        quantity: 100,
        unitCost: 52.75,
      },
    ],
    totalAmount: 5275.0,
    createdAt: "2024-01-25",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-002",
    supplier: "Johnson",
    items: [
      {
        itemId: "1",
        itemName: " Smart Watch",
        quantity: 100,
        unitCost: 52.75,
      },
    ],
    totalAmount: 5275.0,
    createdAt: "2024-01-25",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-003",
    supplier: "Johnson",
    items: [
      {
        itemId: "1",
        itemName: " Smart Watch",
        quantity: 100,
        unitCost: 52.75,
      },
    ],
    totalAmount: 5275.0,
    createdAt: "2024-01-25",
    createdBy: "Usuário Admin",
  },
  {
    id: "PED-2024-004",
    supplier: "Johnson",
    items: [
      {
        itemId: "1",
        itemName: " Smart Watch",
        quantity: 100,
        unitCost: 52.75,
      },
    ],
    totalAmount: 5275.0,
    createdAt: "2024-01-25",
    createdBy: "Usuário Admin",
  },
];

const initialNotifications = [
  {
    id: "1",
    type: "estoque_baixo",
    title: "Low  Stock Alert",
    message: "Smart Watch out of Stock",
    date: "2024-01-25T10:30:00Z",
    read: false,
    priority: "HighPriority",
    actionRequired: true,
  },

  {
    id: "2",
    type: "estoque_baixo",
    title: "Low  Stock Alert",
    message: "Smart Watch out of Stock",
    date: "2024-01-25T10:30:00Z",
    read: false,
    priority: "HighPriority",
    actionRequired: true,
  },

  {
    id: "3",
    type: "estoque_baixo",
    title: "Low  Stock Alert",
    message: "Smart Watch out of Stock",
    date: "2024-01-25T10:30:00Z",
    read: false,
    priority: "HighPriority",
    actionRequired: true,
  },
];

export function InventoryProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // admin authentication
  useEffect(() => {
    verifyAdmin();
  }, []);

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
    lastUpdated: item.last_restocked,
    uploadedDate: item.expiry_date,
    productID: item.productID,
    location: item.location,
    barcode: item.barcode,
    description: item.description,
    image: item.image,
    reorderPoint: item.reorder_point,
    leadTime: item.lead_time,
    avgDailyUsage: item.avg_daily_usage,
  });

  const convertSupplier = (supplier) => ({
    id: supplier.id,
    name: supplier.name,
    contact: supplier.contact,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    rating: supplier.rating,
    totalOrders: supplier.total_orders,
    lastcreatedAt: supplier.last_order_date,
    paymentTerms: supplier.payment_terms,
    deliveryTime: supplier.delivery_time,
    isActive: supplier.is_active,
  });

  const convertPurchaseOrder = (order) => ({
    id: order.id,
    supplier: order.supplier,
    items: order.items,
    totalAmount: order.total_amount,
    status: order.status,
    createdAt: order.order_date,
    expectedDelivery: order.expected_delivery,
    actualDelivery: order.actual_delivery,
    notes: order.notes,
    priority: order.priority,
    createdBy: order.created_by,
  });

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
  });

  const convertNotification = (notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    date: notification.date,
    read: notification.read,
    priority: notification.priority,
    actionRequired: notification.action_required,
  });

  // Carregar dados do Supabase ou usar dados simulados
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        // Usar dados simulados
        setInventory(initialInventory);
        setPurchaseOrders(initialPurchaseOrders);
        setNotifications(initialNotifications);
        setStockMovements([]);
        return;
      }

      // Carregar dados do Supabase
      const [
        inventoryRes,
        suppliersRes,
        ordersRes,
        movementsRes,
        notificationsRes,
      ] = await Promise.all([
        supabase.from("inventory_items").select("*").order("name"),
        supabase.from("suppliers").select("*").order("name"),
        supabase
          .from("purchase_orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("stock_movements")
          .select("*")
          .order("date", { ascending: false })
          .limit(100),
        supabase
          .from("notifications")
          .select("*")
          .order("date", { ascending: false })
          .limit(50),
      ]);

      if (inventoryRes.error) throw inventoryRes.error;
      if (suppliersRes.error) throw suppliersRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (movementsRes.error) throw movementsRes.error;
      if (notificationsRes.error) throw notificationsRes.error;

      setInventory(inventoryRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setPurchaseOrders(ordersRes.data || []);
      setStockMovements(movementsRes.data || []);
      setNotifications(notificationsRes.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");

      // Fallback para dados simulados em caso de erro
      setInventory(initialInventory);
      setSuppliers(initialSuppliers);
      setPurchaseOrders(initialPurchaseOrders);
      setNotifications(initialNotifications);
      setStockMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add new inventory item to the database
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
            last_restocked: item.lastUpdated,
            expiry_date: item.uploadedDate,
            productID: item.productID,
            location: item.location,
            barcode: item.barcode,
            description: item.description,
            image: item.image,
            reorder_point: item.reorderPoint,
            lead_time: item.leadTime,
            avg_daily_usage: item.avgDailyUsage,
          })
          .select()
          .single();

        if (error) throw error;
        const response = await fetch("");

        const newItem = convertInventoryItem(data);
        setInventory((prev) => [...prev, newItem]);

        await addStockMovement({
          itemId: newItem.id,
          itemName: newItem.name,
          type: "entrada",
          quantity: newItem.currentStock,
          reason: "Entrada inicial de estoque",
          date: new Date().toISOString(),
          user: "Sistema",
        });
      } catch (err) {
        console.error("Erro ao adicionar item:", err);
        throw err;
      }
    } else {
      // Modo simulado
      const newItem = { ...item, id: Date.now().toString() };
      setInventory((prev) => [...prev, newItem]);

      addStockMovement({
        itemId: newItem.id,
        itemName: newItem.name,
        type: "entrada",
        quantity: newItem.currentStock,
        reason: "Entrada inicial de estoque",
        date: new Date().toISOString(),
        user: "Sistema",
      });
    }
  };

  const updateInventoryItem = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {};
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.category !== undefined)
          updateData.category = updates.category;
        if (updates.currentStock !== undefined)
          updateData.current_stock = updates.currentStock;
        if (updates.minStock !== undefined)
          updateData.min_stock = updates.minStock;
        if (updates.maxStock !== undefined)
          updateData.max_stock = updates.maxStock;
        if (updates.unit !== undefined) updateData.unit = updates.unit;
        if (updates.costPerUnit !== undefined)
          updateData.cost_per_unit = updates.costPerUnit;
        if (updates.supplier !== undefined)
          updateData.supplier = updates.supplier;
        if (updates.lastUpdated !== undefined)
          updateData.last_restocked = updates.lastUpdated;
        if (updates.uploadedDate !== undefined)
          updateData.expiry_date = updates.uploadedDate;
        if (updates.productID !== undefined)
          updateData.productID = updates.productID;
        if (updates.location !== undefined)
          updateData.location = updates.location;
        if (updates.barcode !== undefined) updateData.barcode = updates.barcode;
        if (updates.description !== undefined)
          updateData.description = updates.description;
        if (updates.image !== undefined) updateData.image = updates.image;
        if (updates.reorderPoint !== undefined)
          updateData.reorder_point = updates.reorderPoint;
        if (updates.leadTime !== undefined)
          updateData.lead_time = updates.leadTime;
        if (updates.avgDailyUsage !== undefined)
          updateData.avg_daily_usage = updates.avgDailyUsage;

        const { data, error } = await supabase
          .from("inventory_items")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        const updatedItem = convertInventoryItem(data);
        setInventory((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        // Rastrear mudanças de estoque
        const oldItem = inventory.find((item) => item.id === id);
        if (
          oldItem &&
          updates.currentStock !== undefined &&
          updates.currentStock !== oldItem.currentStock
        ) {
          const difference = updates.currentStock - oldItem.currentStock;
          await addStockMovement({
            itemId: id,
            itemName: oldItem.name,
            type: difference > 0 ? "entrada" : "saida",
            quantity: Math.abs(difference),
            reason:
              difference > 0 ? "Aumento de estoque" : "Redução de estoque",
            date: new Date().toISOString(),
            user: "Sistema",
          });
        }
      } catch (err) {
        console.error("Erro ao atualizar item:", err);
        throw err;
      }
    } else {
      // Modo simulado
      setInventory((prev) => {
        const oldItem = prev.find((item) => item.id === id);
        const newItem = prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );

        // Rastrear mudanças de estoque
        if (
          oldItem &&
          updates.currentStock !== undefined &&
          updates.currentStock !== oldItem.currentStock
        ) {
          const difference = updates.currentStock - oldItem.currentStock;
          addStockMovement({
            itemId: id,
            itemName: oldItem.name,
            type: difference > 0 ? "entrada" : "saida",
            quantity: Math.abs(difference),
            reason:
              difference > 0 ? "Aumento de estoque" : "Redução de estoque",
            date: new Date().toISOString(),
            user: "Sistema",
          });
        }

        return newItem;
      });
    }
  };

  const deleteInventoryItem = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const item = inventory.find((i) => i.id === id);

        const { error } = await supabase
          .from("inventory_items")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setInventory((prev) => prev.filter((item) => item.id !== id));

        if (item) {
          await addStockMovement({
            itemId: id,
            itemName: item.name,
            type: "saida",
            quantity: item.currentStock,
            reason: "Item removido do sistema",
            date: new Date().toISOString(),
            user: "Sistema",
          });
        }
      } catch (err) {
        console.error("Erro ao deletar item:", err);
        throw err;
      }
    } else {
      // Modo simulado
      const item = inventory.find((i) => i.id === id);
      if (item) {
        addStockMovement({
          itemId: id,
          itemName: item.name,
          type: "saida",
          quantity: item.currentStock,
          reason: "Item removido do sistema",
          date: new Date().toISOString(),
          user: "Sistema",
        });
      }
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

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
            last_order_date: supplier.lastcreatedAt,
            payment_terms: supplier.paymentTerms,
            delivery_time: supplier.deliveryTime,
            is_active: supplier.isActive,
          })
          .select()
          .single();

        if (error) throw error;

        const newSupplier = convertSupplier(data);
        setSuppliers((prev) => [...prev, newSupplier]);
      } catch (err) {
        console.error("Erro ao adicionar fornecedor:", err);
        throw err;
      }
    } else {
      const newSupplier = { ...supplier, id: Date.now().toString() };
      setSuppliers((prev) => [...prev, newSupplier]);
    }
  };

  const updateSupplier = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {};
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.contact !== undefined) updateData.contact = updates.contact;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.phone !== undefined) updateData.phone = updates.phone;
        if (updates.address !== undefined) updateData.address = updates.address;
        if (updates.rating !== undefined) updateData.rating = updates.rating;
        if (updates.totalOrders !== undefined)
          updateData.total_orders = updates.totalOrders;
        if (updates.lastcreatedAt !== undefined)
          updateData.last_order_date = updates.lastcreatedAt;
        if (updates.paymentTerms !== undefined)
          updateData.payment_terms = updates.paymentTerms;
        if (updates.deliveryTime !== undefined)
          updateData.delivery_time = updates.deliveryTime;
        if (updates.isActive !== undefined)
          updateData.is_active = updates.isActive;

        const { data, error } = await supabase
          .from("suppliers")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        const updatedSupplier = convertSupplier(data);
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === id ? updatedSupplier : supplier
          )
        );
      } catch (err) {
        console.error("Erro ao atualizar fornecedor:", err);
        throw err;
      }
    } else {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === id ? { ...supplier, ...updates } : supplier
        )
      );
    }
  };

  const deleteSupplier = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("suppliers")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      } catch (err) {
        console.error("Erro ao deletar fornecedor:", err);
        throw err;
      }
    } else {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
    }
  };

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
            order_date: order.createdAt,
            expected_delivery: order.expectedDelivery,
            actual_delivery: order.actualDelivery,
            notes: order.notes,
            priority: order.priority,
            created_by: order.createdBy,
          })
          .select()
          .single();

        if (error) throw error;

        const newOrder = convertPurchaseOrder(data);
        setPurchaseOrders((prev) => [...prev, newOrder]);

        await addNotification({
          type: "status_pedido",
          title: "Novo Pedido de Compra",
          message: `Pedido de compra ${newOrder.id} criado para ${newOrder.supplier}`,
          date: new Date().toISOString(),
          read: false,
          priority: "baixa",
          actionRequired: false,
        });
      } catch (err) {
        console.error("Erro ao adicionar pedido:", err);
        throw err;
      }
    } else {
      const newOrder = {
        ...order,
        id: `PED-2024-${String(purchaseOrders.length + 1).padStart(3, "0")}`,
      };
      setPurchaseOrders((prev) => [...prev, newOrder]);

      addNotification({
        type: "status_pedido",
        title: "Novo Pedido de Compra",
        message: `Pedido de compra ${newOrder.id} criado para ${newOrder.supplier}`,
        date: new Date().toISOString(),
        read: false,
        priority: "baixa",
        actionRequired: false,
      });
    }
  };

  const updatePurchaseOrder = async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {};
        if (updates.supplier !== undefined)
          updateData.supplier = updates.supplier;
        if (updates.items !== undefined) updateData.items = updates.items;
        if (updates.totalAmount !== undefined)
          updateData.total_amount = updates.totalAmount;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.createdAt !== undefined)
          updateData.order_date = updates.createdAt;
        if (updates.expectedDelivery !== undefined)
          updateData.expected_delivery = updates.expectedDelivery;
        if (updates.actualDelivery !== undefined)
          updateData.actual_delivery = updates.actualDelivery;
        if (updates.notes !== undefined) updateData.notes = updates.notes;
        if (updates.priority !== undefined)
          updateData.priority = updates.priority;
        if (updates.createdBy !== undefined)
          updateData.created_by = updates.createdBy;

        const { data, error } = await supabase
          .from("purchase_orders")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        const updatedOrder = convertPurchaseOrder(data);
        setPurchaseOrders((prev) =>
          prev.map((order) => (order.id === id ? updatedOrder : order))
        );

        if (updates.status) {
          await addNotification({
            type: "status_pedido",
            title: "Status do Pedido Atualizado",
            message: `Status do pedido ${id} alterado para ${updates.status}`,
            date: new Date().toISOString(),
            read: false,
            priority: "baixa",
            actionRequired: false,
          });
        }
      } catch (err) {
        console.error("Erro ao atualizar pedido:", err);
        throw err;
      }
    } else {
      setPurchaseOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...updates } : order
        )
      );

      if (updates.status) {
        addNotification({
          type: "status_pedido",
          title: "Status do Pedido Atualizado",
          message: `Status do pedido ${id} alterado para ${updates.status}`,
          date: new Date().toISOString(),
          read: false,
          priority: "baixa",
          actionRequired: false,
        });
      }
    }
  };

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
          .single();

        if (error) throw error;

        const newMovement = convertStockMovement(data);
        setStockMovements((prev) => [newMovement, ...prev.slice(0, 99)]);
      } catch (err) {
        console.error("Erro ao adicionar movimentação:", err);
        throw err;
      }
    } else {
      const newMovement = { ...movement, id: Date.now().toString() };
      setStockMovements((prev) => [newMovement, ...prev]);
    }
  };

  const markNotificationRead = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", id);

        if (error) throw error;

        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } catch (err) {
        console.error("Erro ao marcar notificação como lida:", err);
        throw err;
      }
    } else {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

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
          .single();

        if (error) throw error;

        const newNotification = convertNotification(data);
        setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]);
      } catch (err) {
        console.error("Erro ao adicionar notificação:", err);
        throw err;
      }
    } else {
      const newNotification = { ...notification, id: Date.now().toString() };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  // Funções utilitárias
  const getStockPrediction = (itemId, days) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return 0;

    const predictedUsage = item.avgDailyUsage * days;
    return Math.max(0, item.currentStock - predictedUsage);
  };

  const getLowStockItems = () => {
    return inventory.filter((item) => item.currentStock <= item.minStock);
  };

  const getExpiringItems = (days) => {
    const today = new Date();
    return inventory.filter((item) => {
      if (!item.uploadedDate) return false;
      const uploadedDate = new Date(item.uploadedDate);
      const daysUntilExpiry = Math.ceil(
        (uploadedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= days && daysUntilExpiry > 0;
    });
  };

  const refreshData = async () => {
    await loadData();
  };

  // Auto-gerar notificações para estoque baixo e itens vencendo
  // useEffect(() => {
  //   if (inventory.length === 0) return;

  //   const checkLowStock = async () => {
  //     const lowStockItems = getLowStockItems();
  //     for (const item of lowStockItems) {
  //       const existingNotification = notifications.find(
  //         (n) =>
  //           n.type === "estoque_baixo" &&
  //           n.message.includes(item.name) &&
  //           !n.read
  //       );
  //       if (!existingNotification) {
  //         await addNotification({
  //           type: "estoque_baixo",
  //           title: "Low  Stock Alert",
  //           message: `${item.name} está abaixo do nível mínimo (${item.currentStock}/${item.minStock})`,
  //           date: new Date().toISOString(),
  //           read: false,
  //           priority:
  //             item.currentStock <= item.minStock * 0.5
  //               ? "HighPriority"
  //               : "media",
  //           actionRequired: true,
  //         });
  //       }
  //     }
  //   };

  //   const checkExpiring = async () => {
  //     const expiringItems = getExpiringItems(14);
  //     for (const item of expiringItems) {
  //       const existingNotification = notifications.find(
  //         (n) =>
  //           n.type === "vencimento" && n.message.includes(item.name) && !n.read
  //       );
  //       if (!existingNotification && item.uploadedDate) {
  //         const today = new Date();
  //         const uploadedDate = new Date(item.uploadedDate);
  //         const daysUntilExpiry = Math.ceil(
  //           (uploadedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  //         );

  //         await addNotification({
  //           type: "vencimento",
  //           title: "Aviso de Vencimento",
  //           message: `${item.name} vence em ${daysUntilExpiry} dias (${item.uploadedDate})`,
  //           date: new Date().toISOString(),
  //           read: false,
  //           priority: daysUntilExpiry <= 7 ? "HighPriority" : "media",
  //           actionRequired: true,
  //         });
  //       }
  //     }
  //   };

  //   checkLowStock();
  //   checkExpiring();
  // }, [inventory]);

  const verifyAdmin = async () => {
    try {
      const data = await getAdmin();
      if (data?.success) {
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        // Admin auth
        admin,
        setAdmin,
        // inventory auth
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
      <SocketProvider>{children}</SocketProvider>
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      "useInventory deve ser usado dentro de um InventoryProvider"
    );
  }
  return context;
}
