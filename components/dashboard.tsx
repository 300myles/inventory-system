"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  Users,
  BarChart,
  CheckCircle,
  Calendar,
} from "lucide-react"
import { useInventory } from "@/contexts/inventory-context"
import { useTheme } from "@/contexts/theme-context"

export default function Dashboard() {
  const { inventory, suppliers, purchaseOrders, notifications, getLowStockItems, getExpiringItems } = useInventory()
  const { theme } = useTheme()

  const lowStockItems = getLowStockItems()
  const expiringItems = getExpiringItems(30)
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)
  const pendingOrders = purchaseOrders.filter((order) => order.status === "pendente").length
  const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0)
  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Dados práticos e diretos
  const todayStats = {
    vendas: 2847.5,
    pedidos: 12,
    clientes: 89,
    crescimento: 15.2,
  }

  // Itens mais vendidos (dados simplificados)
  const topSellingItems = [
    { nome: "Grãos Etíopes Yirgacheffe", vendidos: 145, receita: 7263, estoque: 45 },
    { nome: "Café Colombiano Supremo", vendidos: 132, receita: 5841, estoque: 12 },
    { nome: "Copos de Papel Premium", vendidos: 2840, receita: 1704, estoque: 850 },
    { nome: "Leite Integral Orgânico", vendidos: 89, receita: 1269, estoque: 18 },
    { nome: "Xarope de Baunilha", vendidos: 67, receita: 1910, estoque: 6 },
  ]

  // Atividades recentes simplificadas
  const recentActivity = [
    {
      acao: "Estoque Atualizado",
      item: "Grãos Etíopes Yirgacheffe Premium",
      tempo: "2 min",
      tipo: "success",
      valor: "+50 kg",
    },
    {
      acao: "Alerta de Estoque Baixo",
      item: "Café Colombiano Supremo",
      tempo: "15 min",
      tipo: "warning",
      valor: "12/25 kg",
    },
    {
      acao: "Pedido Entregue",
      item: "PED-2024-003",
      tempo: "1h",
      tipo: "success",
      valor: "R$ 1.200,00",
    },
    {
      acao: "Novo Fornecedor",
      item: "Brazil Direct Coffee",
      tempo: "2h",
      tipo: "info",
      valor: "Ativo",
    },
  ]

  // Resumo de categorias
  const categoryStats = inventory.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, value: 0, lowStock: 0 }
      }
      acc[item.category].total += item.currentStock
      acc[item.category].value += item.currentStock * item.costPerUnit
      if (item.currentStock <= item.minStock) {
        acc[item.category].lowStock += 1
      }
      return acc
    },
    {} as Record<string, { total: number; value: number; lowStock: number }>,
  )

  // Classes dinâmicas baseadas no tema
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
  const textPrimary = theme === "dark" ? "text-gray-200" : "text-gray-800"
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600"
  const textMuted = theme === "dark" ? "text-gray-500" : "text-gray-500"

  return (
    <div className="space-y-6">
      {/* Barra de Status em Tempo Real */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Sistema Online</span>
            </div>
            <div className="text-amber-100">|</div>
            <div className="text-sm">Última sincronização: {new Date().toLocaleTimeString("pt-BR")}</div>
            <div className="text-amber-100">|</div>
            <div className="text-sm">
              Vendas hoje: R$ {todayStats.vendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Usuários ativos: 3</span>
            <span>•</span>
            <span>Uptime: 99.9%</span>
          </div>
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
              R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${textSecondary} flex items-center mt-1`}>
              <TrendingUp className="h-3 w-3 mr-1 text-green-400" />+{todayStats.crescimento}% do mês passado
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span className={textMuted}>Meta mensal</span>
                <span className={textMuted}>85%</span>
              </div>
              <Progress value={85} className="h-1 mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalItems.toLocaleString("pt-BR")}</div>
            <p className={`text-xs ${textSecondary}`}>Em {inventory.length} produtos diferentes</p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>Categorias ativas</span>
              <span className={`text-xs font-medium ${textPrimary}`}>{Object.keys(categoryStats).length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{lowStockItems.length + expiringItems.length}</div>
            <p className={`text-xs ${textSecondary}`}>
              {lowStockItems.length} estoque baixo • {expiringItems.length} vencendo
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>Requer ação</span>
              <span className={`text-xs font-medium text-red-400`}>{unreadNotifications} notificações</span>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>Pedidos e Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{todayStats.pedidos}</div>
            <p className={`text-xs ${textSecondary}`}>Pedidos hoje • {todayStats.clientes} clientes</p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>Pendentes</span>
              <span className={`text-xs font-medium ${textPrimary}`}>{pendingOrders} pedidos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Categorias */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
            <BarChart className="h-5 w-5 text-amber-500" />
            Resumo por Categorias
          </CardTitle>
          <CardDescription className={textSecondary}>Visão geral do inventário por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div
                key={category}
                className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${textPrimary}`}>{category}</h4>
                  {stats.lowStock > 0 && (
                    <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700 text-xs">
                      {stats.lowStock} baixo
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className={`text-sm ${textMuted}`}>Valor total</span>
                    <span className={`text-sm font-medium ${textPrimary}`}>
                      R$ {stats.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${textMuted}`}>Quantidade</span>
                    <span className={`text-sm font-medium ${textPrimary}`}>
                      {stats.total.toLocaleString("pt-BR")} unidades
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Alertas Críticos */}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Alertas Críticos
            </CardTitle>
            <CardDescription className={textSecondary}>Itens que requerem atenção imediata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  theme === "dark" ? "bg-red-950/50 border-red-800" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${textPrimary}`}>{item.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs ${textSecondary}`}>
                      {item.currentStock} {item.unit}
                    </span>
                    <span className={`text-xs ${textMuted}`}>Mín: {item.minStock}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700 text-xs">
                    {Math.round((item.currentStock / item.minStock) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
            {expiringItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  theme === "dark" ? "bg-yellow-950/50 border-yellow-800" : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${textPrimary}`}>{item.name}</p>
                  <span className={`text-xs ${textSecondary}`}>
                    Vence: {new Date(item.expiryDate!).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-700 text-xs">
                  Vencendo
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Itens Mais Vendidos */}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <TrendingUp className="h-5 w-5 text-green-400" />
              Itens Mais Vendidos
            </CardTitle>
            <CardDescription className={textSecondary}>Top 5 produtos deste mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSellingItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${textPrimary}`}>{item.nome}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${textSecondary}`}>{item.vendidos} vendidos</span>
                      <span className={`text-xs ${textMuted}`}>Estoque: {item.estoque}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-green-400">R$ {item.receita.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <Clock className="h-5 w-5 text-blue-400" />
              Atividade Recente
            </CardTitle>
            <CardDescription className={textSecondary}>Últimas atualizações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.tipo === "warning"
                        ? "bg-yellow-400"
                        : activity.tipo === "success"
                          ? "bg-green-400"
                          : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${textPrimary}`}>{activity.acao}</p>
                    <p className={`text-xs ${textSecondary}`}>{activity.item}</p>
                    <p className={`text-xs ${textMuted}`}>{activity.tempo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${textPrimary}`}>{activity.valor}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <CheckCircle className="h-5 w-5 text-green-400" />
              Performance do Sistema
            </CardTitle>
            <CardDescription className={textSecondary}>Indicadores de saúde do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>Estoque Saudável</span>
                <span className="text-sm font-medium text-green-400">
                  {inventory.length - lowStockItems.length}/{inventory.length}
                </span>
              </div>
              <Progress value={((inventory.length - lowStockItems.length) / inventory.length) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>Fornecedores Ativos</span>
                <span className="text-sm font-medium text-blue-400">
                  {suppliers.filter((s) => s.isActive).length}/{suppliers.length}
                </span>
              </div>
              <Progress value={(suppliers.filter((s) => s.isActive).length / suppliers.length) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>Pedidos Entregues</span>
                <span className="text-sm font-medium text-purple-400">
                  {purchaseOrders.filter((p) => p.status === "entregue").length}/{purchaseOrders.length}
                </span>
              </div>
              <Progress
                value={(purchaseOrders.filter((p) => p.status === "entregue").length / purchaseOrders.length) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <Calendar className="h-5 w-5 text-amber-500" />
              Próximas Ações
            </CardTitle>
            <CardDescription className={textSecondary}>Tarefas e lembretes importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-3 rounded-lg border ${theme === "dark" ? "border-amber-800 bg-amber-950/50" : "border-amber-200 bg-amber-50"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>Reabastecer estoque baixo</span>
                <Badge variant="outline" className="bg-amber-900 text-amber-300 border-amber-700 text-xs">
                  Urgente
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>{lowStockItems.length} itens precisam de reposição</p>
            </div>

            <div
              className={`p-3 rounded-lg border ${theme === "dark" ? "border-blue-800 bg-blue-950/50" : "border-blue-200 bg-blue-50"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>Verificar vencimentos</span>
                <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-700 text-xs">
                  Hoje
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>{expiringItems.length} itens vencem em 30 dias</p>
            </div>

            <div
              className={`p-3 rounded-lg border ${theme === "dark" ? "border-green-800 bg-green-950/50" : "border-green-200 bg-green-50"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>Aprovar pedidos</span>
                <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 text-xs">
                  {pendingOrders}
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>Pedidos aguardando aprovação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={textPrimary}>Ações Rápidas</CardTitle>
          <CardDescription className={textSecondary}>Operações mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white h-12">
              <Package className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
            <Button
              variant="outline"
              className={`h-12 ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Criar Pedido
            </Button>
            <Button
              variant="outline"
              className={`h-12 ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
            <Button
              variant="outline"
              className={`h-12 ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
