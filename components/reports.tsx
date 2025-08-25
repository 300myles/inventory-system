"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Package, AlertTriangle, Calendar, Download, FileText, BarChart3 } from "lucide-react"
import { useInventory } from "@/contexts/inventory-context"
import { useTheme } from "@/contexts/theme-context"

export default function Reports() {
  const { inventory, suppliers, purchaseOrders } = useInventory()
  const { theme } = useTheme()

  // Cálculos de métricas
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)
  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

  // Dados por categoria
  const categoryData = inventory.reduce(
    (acc, item) => {
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
    },
    {} as Record<string, { items: number; value: number; lowStock: number; totalStock: number }>,
  )

  // Performance de fornecedores
  const supplierPerformance = suppliers.map((supplier) => {
    const supplierOrders = purchaseOrders.filter((order) => order.supplier === supplier.name)
    const deliveredOrders = supplierOrders.filter((order) => order.status === "entregue").length
    const onTimeRate = supplierOrders.length > 0 ? Math.round((deliveredOrders / supplierOrders.length) * 100) : 0
    const totalValue = supplierOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    return {
      name: supplier.name,
      rating: supplier.rating,
      orders: supplierOrders.length,
      onTimeRate,
      totalValue,
      lastOrder: supplier.lastOrderDate,
    }
  })

  // Itens com maior valor em estoque
  const highValueItems = inventory
    .map((item) => ({
      ...item,
      totalValue: item.currentStock * item.costPerUnit,
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10)

  // Resumo mensal (dados simulados)
  const monthlyData = [
    { month: "Janeiro", orders: 12, value: 24500, items: 145 },
    { month: "Fevereiro", orders: 15, value: 32000, items: 189 },
    { month: "Março", orders: 18, value: 28000, items: 167 },
    { month: "Abril", orders: 22, value: 41000, items: 203 },
    { month: "Maio", orders: 19, value: 36000, items: 178 },
    { month: "Junho", orders: 25, value: 48000, items: 234 },
  ]

  // Classes dinâmicas baseadas no tema
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
  const textPrimary = theme === "dark" ? "text-gray-200" : "text-gray-800"
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600"

  const exportReport = (type: string) => {
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

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>Relatórios e Análises</h2>
          <p className={textSecondary}>Insights detalhados sobre o desempenho do inventário</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportReport("inventario")}
            className={`${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Valor Total do Inventário</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              R$ {totalInventoryValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${textSecondary} flex items-center`}>
              <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
              +12.5% do mês passado
            </p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Itens Ativos</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{inventory.length}</div>
            <p className={`text-xs ${textSecondary}`}>Em {Object.keys(categoryData).length} categorias</p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Itens com Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems.length}</div>
            <p className={`text-xs ${textSecondary}`}>
              {Math.round((lowStockItems.length / inventory.length) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Pedidos Mensais</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{purchaseOrders.length}</div>
            <p className={`text-xs ${textSecondary} flex items-center`}>
              <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
              +8.2% do mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Categorias */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Análise por Categorias
          </CardTitle>
          <CardDescription className={textSecondary}>Distribuição detalhada do inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([category, data]) => (
              <div
                key={category}
                className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${textPrimary}`}>{category}</h4>
                  <div className="flex gap-2">
                    {data.lowStock > 0 && (
                      <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700">
                        {data.lowStock} baixo
                      </Badge>
                    )}
                    <Badge variant="outline" className={`${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
                      {data.items} itens
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className={`text-xs ${textSecondary}`}>Valor Total</p>
                    <p className={`font-medium ${textPrimary}`}>
                      R$ {data.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSecondary}`}>Quantidade</p>
                    <p className={`font-medium ${textPrimary}`}>{data.totalStock.toLocaleString("pt-BR")} unidades</p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSecondary}`}>% do Total</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {Math.round((data.value / totalInventoryValue) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className={textSecondary}>Saúde do Estoque</span>
                    <span className={textSecondary}>
                      {Math.round(((data.items - data.lowStock) / data.items) * 100)}%
                    </span>
                  </div>
                  <Progress value={((data.items - data.lowStock) / data.items) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance de Fornecedores */}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={textPrimary}>Performance de Fornecedores</CardTitle>
            <CardDescription className={textSecondary}>Avaliação e estatísticas dos fornecedores</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className={`${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                  <TableHead className={textSecondary}>Fornecedor</TableHead>
                  <TableHead className={textSecondary}>Avaliação</TableHead>
                  <TableHead className={textSecondary}>Pedidos</TableHead>
                  <TableHead className={textSecondary}>Pontualidade</TableHead>
                  <TableHead className={textSecondary}>Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierPerformance.map((supplier) => (
                  <TableRow
                    key={supplier.name}
                    className={`${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                  >
                    <TableCell>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>{supplier.name}</p>
                        <p className={`text-xs ${textSecondary}`}>
                          Último pedido: {new Date(supplier.lastOrder).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={textPrimary}>{supplier.rating.toFixed(1)}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < supplier.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{supplier.orders}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={supplier.onTimeRate} className="w-16" />
                        <span className={`text-sm ${textPrimary}`}>{supplier.onTimeRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={textPrimary}>
                      R$ {supplier.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Itens de Maior Valor */}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={textPrimary}>Itens de Maior Valor em Estoque</CardTitle>
            <CardDescription className={textSecondary}>Top 10 itens por valor total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highValueItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs ${textSecondary}`}>
                          {item.currentStock} {item.unit}
                        </span>
                        <span className={`text-xs ${textSecondary}`}>R$ {item.costPerUnit.toFixed(2)}/un</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${textPrimary}`}>
                      R$ {item.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs ${textSecondary}`}>
                      {Math.round((item.totalValue / totalInventoryValue) * 100)}% do total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Mensal */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={textPrimary}>Resumo Mensal</CardTitle>
          <CardDescription className={textSecondary}>Evolução dos pedidos e valores ao longo do ano</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className={`${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                <TableHead className={textSecondary}>Mês</TableHead>
                <TableHead className={textSecondary}>Pedidos</TableHead>
                <TableHead className={textSecondary}>Valor Total</TableHead>
                <TableHead className={textSecondary}>Itens Movimentados</TableHead>
                <TableHead className={textSecondary}>Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month, index) => {
                const previousMonth = monthlyData[index - 1]
                const growth = previousMonth
                  ? Math.round(((month.value - previousMonth.value) / previousMonth.value) * 100)
                  : 0

                return (
                  <TableRow key={month.month} className={`${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                    <TableCell className={`font-medium ${textPrimary}`}>{month.month}</TableCell>
                    <TableCell className={textPrimary}>{month.orders}</TableCell>
                    <TableCell className={textPrimary}>
                      R$ {month.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={textPrimary}>{month.items}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />
                        )}
                        <span className={`text-sm ${growth > 0 ? "text-green-400" : "text-red-400"}`}>
                          {growth > 0 ? "+" : ""}
                          {growth}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
