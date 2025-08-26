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
  HomeIcon,
  ArrowRight,
  ArrowUpRight,
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

  // Stats for the day
  const todayStats = {
    Sales: 2847.5,
    Orders: 12,
    Customers: 89,
    Growth: 15.2,
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
  const categoryStats = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, value: 0, lowStock: 0 }
    }
    acc[item.category].total += item.currentStock
    acc[item.category].value += item.currentStock * item.costPerUnit
    if (item.currentStock <= item.minStock) {
      acc[item.category].lowStock += 1
    }
    return acc
  }, {})

  // Classes dinâmicas baseadas no tema
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
  const textPrimary = theme === "dark" ? "text-gray-200" : "text-gray-800"
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600"
  const textMuted = theme === "dark" ? "text-gray-500" : "text-gray-500"

  return (
    <div className="space-y-6">
      {/* Barra de Status em Tempo Real */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">System Online</span>
            </div>
            <div className="text-amber-100">|</div>
            <div className="text-sm">
              Last Updated: 3:15am <br /> Aug 23, 2025{" "}
            </div>
            <div className="text-amber-100">|</div>
            <div className="text-sm">
              Total Sales Today: ${" "}
              {todayStats.Sales.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Active Users: 3</span>
            <span>•</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>
              Items in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              376{/*{totalItems.toLocaleString("pt-BR")}*/}
            </div>
            <p className={`text-xs ${textSecondary}`}>
              In {inventory.length} Different Products
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>Active Categories</span>
              <span className={`text-xs font-medium ${textPrimary}`}>
                {Object.keys(categoryStats).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${" "}
              {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${textSecondary} flex items-center mt-1`}>
              <TrendingUp className="h-3 w-3 mr-1 text-green-400" />+
              {todayStats.Growth}% From Last Month
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span className={textMuted}>Monthly Goal</span>
                <span className={textMuted}>85%</span>
              </div>
              <Progress value={85} className="h-1 mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* TODO: Only Super Admin can see this */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {lowStockItems.length + expiringItems.length}
            </div>
            <p className={`text-xs ${textSecondary}`}>
              {lowStockItems.length} low stock • {expiringItems.length} vencendo
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>
                {/* TODO: Change this to point to the right place and style it properly */}
                <a href="#">check status</a>
              </span>
              <span className={`text-xs font-medium text-red-400`}>
                {unreadNotifications} Notifications
              </span>
            </div>
          </CardContent>
        </Card>

        {/* TODO: Only Super Admin can see this */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${textPrimary}`}>
              Total Admins
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">9</div>
            <p className={`text-xs text-green-400`}>Active Admins: 3</p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${textMuted}`}>
                {/* TODO: Change this to point to the right place and style it properly */}
                <a href="#">see more</a>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Chart would be Here */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
            <BarChart className="h-5 w-5 text-blue-500" />
            Progression Metrics
          </CardTitle>
          <CardDescription className={textSecondary}>
            chart displays the progression metric of products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h1>Barchart Would be Here</h1>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Alerts Container */}
        <Card className={cardClass}>
          <CardHeader className={`border-b border-gray-400 mb-[-5px]`}>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Critical Alerts
            </CardTitle>
            <CardDescription className={textSecondary}>
              Suspicious activities
            </CardDescription>
          </CardHeader>
          <a
            className="relative flex item-center space-x-1.5 left-[72%] bottom-[14%] text-[15px]"
            href="#"
          >
            <span>see more</span> <ArrowUpRight className="w-[4%] relative top-[-2px]" />
          </a>
          <CardContent className="space-y-3">
            {lowStockItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-red-950/50 border-red-800"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${textPrimary}`}>
                    Multiple Login Attempts
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs ${textMuted}`}>
                      IP: 1.200.33.3.22
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className="bg-red-900 text-red-300 border-red-700 text-xs"
                  >
                    3.5
                  </Badge>
                </div>
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
            <CardDescription className={textSecondary}>
              Top 5 produtos deste mês
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSellingItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${textPrimary}`}>
                      {item.nome}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${textSecondary}`}>
                        {item.vendidos} vendidos
                      </span>
                      <span className={`text-xs ${textMuted}`}>
                        Estoque: {item.estoque}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-green-400">
                    R$ {item.receita.toLocaleString("pt-BR")}
                  </p>
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
            <CardDescription className={textSecondary}>
              Últimas atualizações do sistema
            </CardDescription>
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
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      {activity.acao}
                    </p>
                    <p className={`text-xs ${textSecondary}`}>
                      {activity.item}
                    </p>
                    <p className={`text-xs ${textMuted}`}>{activity.tempo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${textPrimary}`}>
                    {activity.valor}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/*  */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
              <CheckCircle className="h-5 w-5 text-green-400" />
              Performance do Sistema
            </CardTitle>
            <CardDescription className={textSecondary}>
              Indicadores de saúde do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>
                  Estoque Saudável
                </span>
                <span className="text-sm font-medium text-green-400">
                  {inventory.length - lowStockItems.length}/{inventory.length}
                </span>
              </div>
              <Progress
                value={
                  ((inventory.length - lowStockItems.length) /
                    inventory.length) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>
                  Fornecedores Ativos
                </span>
                <span className="text-sm font-medium text-blue-400">
                  {suppliers.filter((s) => s.isActive).length}/
                  {suppliers.length}
                </span>
              </div>
              <Progress
                value={
                  (suppliers.filter((s) => s.isActive).length /
                    suppliers.length) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textPrimary}`}>
                  Pedidos Entregues
                </span>
                <span className="text-sm font-medium text-purple-400">
                  {purchaseOrders.filter((p) => p.status === "entregue").length}
                  /{purchaseOrders.length}
                </span>
              </div>
              <Progress
                value={
                  (purchaseOrders.filter((p) => p.status === "entregue")
                    .length /
                    purchaseOrders.length) *
                  100
                }
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
            <CardDescription className={textSecondary}>
              Tarefas e lembretes importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-3 rounded-lg border ${
                theme === "dark"
                  ? "border-amber-800 bg-amber-950/50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>
                  Reabastecer estoque baixo
                </span>
                <Badge
                  variant="outline"
                  className="bg-amber-900 text-amber-300 border-amber-700 text-xs"
                >
                  Urgente
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>
                {lowStockItems.length} itens precisam de reposição
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                theme === "dark"
                  ? "border-blue-800 bg-blue-950/50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>
                  Verificar vencimentos
                </span>
                <Badge
                  variant="outline"
                  className="bg-blue-900 text-blue-300 border-blue-700 text-xs"
                >
                  Hoje
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>
                {expiringItems.length} itens vencem em 30 dias
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                theme === "dark"
                  ? "border-green-800 bg-green-950/50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${textPrimary}`}>
                  Aprovar pedidos
                </span>
                <Badge
                  variant="outline"
                  className="bg-green-900 text-green-300 border-green-700 text-xs"
                >
                  {pendingOrders}
                </Badge>
              </div>
              <p className={`text-xs ${textSecondary} mt-1`}>
                Pedidos aguardando aprovação
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={textPrimary}>Ações Rápidas</CardTitle>
          <CardDescription className={textSecondary}>
            Operações mais utilizadas
          </CardDescription>
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
  );
}
