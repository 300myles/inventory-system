"use client"
import { useInventory } from "@/contexts/inventory-context"
import { useTheme } from "@/contexts/theme-context"

export default function Reports() {
  const { inventory, suppliers, purchaseOrders } = useInventory()
  const { theme } = useTheme()

  // Cálculos de métricas
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)
  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

  // Dados por categoria
  const categoryData = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { items: 0, value: 0, lowStock: 0, totalStock: 0 }
    }
    acc[item.category].items += 1
    acc[item.category].value += item.currentStock * item.costPerUnit
    acc[item.category].totalStock += item.currentStock
    if (item.currentStock <= item.minStock) {
      acc[item.category].lowStock += 1
    }
    return acc
  }, {})

  const exportReport = (type) => {
    const data = {
      tipo: type,
      data: new Date().toISOString(),
      inventario: inventory.length,
      valorTotal: totalInventoryValue,
      alertas: lowStockItems.length,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${type}-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }
}
