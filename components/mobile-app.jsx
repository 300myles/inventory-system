"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Smartphone, Download, Wifi, WifiOff, Bell, Scan, BarChart3, Package } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function MobileApp() {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [appStats] = useState({
    downloads: 1247,
    activeUsers: 89,
    lastSync: "2024-01-15 14:30",
    version: "2.1.0",
  })
  const [mobileFeatures] = useState([
    { name: "Scanner de Código", icon: Scan, status: "ativo", usage: "95%" },
    { name: "Consulta de Estoque", icon: Package, status: "ativo", usage: "87%" },
    { name: "Relatórios Móveis", icon: BarChart3, status: "ativo", usage: "62%" },
    { name: "Notificações Push", icon: Bell, status: "ativo", usage: "78%" },
  ])

  const simulateDownload = (platform) => {
    alert(`Iniciando download do app para ${platform}...`)
  }

  const toggleSync = () => {
    setIsOnline(!isOnline)
    if (!isOnline) {
      alert("Sincronização ativada! Dados sendo atualizados...")
    } else {
      alert("Modo offline ativado. Dados serão sincronizados quando voltar online.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`transition-colors duration-300 ${
            theme === "dark"
              ? "border-gray-700 hover:bg-gray-800 text-gray-200"
              : "border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-4xl max-h-[80vh] overflow-y-auto ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white"}`}
      >
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>Aplicativo Mobile</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interface Mobile Simulada */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Interface Mobile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto w-64 h-96 bg-gray-900 rounded-3xl p-4 shadow-2xl">
                {/* Tela do celular */}
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  {/* Header do app */}
                  <div className="bg-amber-500 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Oliver Coffee</h3>
                      <div className="flex items-center gap-2">
                        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        <Badge variant="secondary" className="text-xs">
                          {isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do app */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        <Package className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs font-medium">Estoque</p>
                        <p className="text-lg font-bold text-blue-600">247</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg text-center">
                        <Scan className="h-6 w-6 mx-auto mb-1 text-green-600" />
                        <p className="text-xs font-medium">Scanner</p>
                        <p className="text-xs text-green-600">Ativo</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="text-xs font-medium">Café Etíope Premium</p>
                        <p className="text-xs text-gray-600">Estoque: 45 kg</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="text-xs font-medium">Leite Orgânico</p>
                        <p className="text-xs text-gray-600">Estoque: 12 L</p>
                      </div>
                      <div className="bg-red-100 p-2 rounded">
                        <p className="text-xs font-medium">Açúcar Cristal</p>
                        <p className="text-xs text-red-600">Estoque Baixo: 2 kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom navigation */}
                  <div className="absolute bottom-4 left-4 right-4 bg-gray-100 rounded-lg p-2">
                    <div className="flex justify-around">
                      <div className="text-center">
                        <BarChart3 className="h-4 w-4 mx-auto text-gray-600" />
                        <p className="text-xs">Dashboard</p>
                      </div>
                      <div className="text-center">
                        <Package className="h-4 w-4 mx-auto text-amber-600" />
                        <p className="text-xs">Estoque</p>
                      </div>
                      <div className="text-center">
                        <Scan className="h-4 w-4 mx-auto text-gray-600" />
                        <p className="text-xs">Scanner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controles e Estatísticas */}
          <div className="space-y-6">
            {/* Downloads */}
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download do App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => simulateDownload("iOS")} className="bg-black text-white hover:bg-gray-800">
                    <Download className="h-4 w-4 mr-2" />
                    iOS App Store
                  </Button>
                  <Button
                    onClick={() => simulateDownload("Android")}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Google Play
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Versão atual: {appStats.version}</p>
                  <p>Total de downloads: {appStats.downloads.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle>Configurações Mobile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sincronização Online</p>
                    <p className="text-sm text-gray-600">Manter dados atualizados</p>
                  </div>
                  <Switch checked={isOnline} onCheckedChange={toggleSync} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-gray-600">Alertas em tempo real</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Última sincronização: {appStats.lastSync}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle>Estatísticas do App</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{appStats.downloads}</div>
                    <div className="text-sm text-gray-600">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{appStats.activeUsers}</div>
                    <div className="text-sm text-gray-600">Usuários Ativos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Funcionalidades Mobile */}
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
          <CardHeader>
            <CardTitle>Funcionalidades Mobile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mobileFeatures.map((feature, index) => (
                <div key={index} className="p-4 rounded-lg border text-center">
                  <feature.icon className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <p className="font-medium">{feature.name}</p>
                  <Badge variant="outline" className="mt-2">
                    {feature.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Uso: {feature.usage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modo Offline */}
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
          <CardHeader>
            <CardTitle>Funcionalidades Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded border">
                <div>
                  <p className="font-medium">Consulta de Estoque</p>
                  <p className="text-sm text-gray-600">Visualizar dados em cache</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Disponível
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded border">
                <div>
                  <p className="font-medium">Scanner de Códigos</p>
                  <p className="text-sm text-gray-600">Escanear e salvar para sincronizar</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Disponível
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded border">
                <div>
                  <p className="font-medium">Ajustes de Estoque</p>
                  <p className="text-sm text-gray-600">Modificações locais com sync posterior</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Disponível
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded border">
                <div>
                  <p className="font-medium">Relatórios</p>
                  <p className="text-sm text-gray-600">Requer conexão online</p>
                </div>
                <Badge variant="secondary">Offline</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
