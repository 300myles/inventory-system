"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Mail, Settings, Users, Send, Clock, CheckCircle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function EmailNotifications() {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [emailConfig, setEmailConfig] = useState({
    server: "smtp.gmail.com",
    port: "587",
    username: "sistema@olivercoffee.com",
    password: "••••••••",
  })
  const [recipients, setRecipients] = useState(["admin@olivercoffee.com", "gerente@olivercoffee.com"])
  const [newRecipient, setNewRecipient] = useState("")
  const [alerts, setAlerts] = useState({
    lowStock: true,
    expiring: true,
    newOrders: false,
    reports: true,
  })
  const [emailHistory] = useState([
    { id: 1, type: "Estoque Baixo", recipient: "admin@olivercoffee.com", sent: "2024-01-15 14:30", status: "Enviado" },
    {
      id: 2,
      type: "Relatório Semanal",
      recipient: "gerente@olivercoffee.com",
      sent: "2024-01-15 09:00",
      status: "Enviado",
    },
    {
      id: 3,
      type: "Produtos Vencendo",
      recipient: "admin@olivercoffee.com",
      sent: "2024-01-14 16:45",
      status: "Enviado",
    },
  ])

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient])
      setNewRecipient("")
    }
  }

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email))
  }

  const sendTestEmail = () => {
    alert("Email de teste enviado com sucesso!")
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
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-4xl max-h-[80vh] overflow-y-auto ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white"}`}
      >
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
            Configurações de Email
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configurações do Servidor */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Servidor SMTP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Servidor</label>
                <Input
                  value={emailConfig.server}
                  onChange={(e) => setEmailConfig({ ...emailConfig, server: e.target.value })}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Porta</label>
                <Input
                  value={emailConfig.port}
                  onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Usuário</label>
                <Input
                  value={emailConfig.username}
                  onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  value={emailConfig.password}
                  onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              <Button onClick={sendTestEmail} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Enviar Email de Teste
              </Button>
            </CardContent>
          </Card>

          {/* Destinatários */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Destinatários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="email@exemplo.com"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
                <Button onClick={addRecipient}>Adicionar</Button>
              </div>

              <div className="space-y-2">
                {recipients.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <span>{email}</span>
                    <Button variant="outline" size="sm" onClick={() => removeRecipient(email)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Alertas */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle>Tipos de Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estoque Baixo</p>
                  <p className="text-sm text-gray-600">Alertas quando itens estão com estoque baixo</p>
                </div>
                <Switch
                  checked={alerts.lowStock}
                  onCheckedChange={(checked) => setAlerts({ ...alerts, lowStock: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Produtos Vencendo</p>
                  <p className="text-sm text-gray-600">Alertas para produtos próximos ao vencimento</p>
                </div>
                <Switch
                  checked={alerts.expiring}
                  onCheckedChange={(checked) => setAlerts({ ...alerts, expiring: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Pedidos</p>
                  <p className="text-sm text-gray-600">Notificações de novos pedidos de compra</p>
                </div>
                <Switch
                  checked={alerts.newOrders}
                  onCheckedChange={(checked) => setAlerts({ ...alerts, newOrders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatórios</p>
                  <p className="text-sm text-gray-600">Envio automático de relatórios semanais</p>
                </div>
                <Switch
                  checked={alerts.reports}
                  onCheckedChange={(checked) => setAlerts({ ...alerts, reports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Emails */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 rounded border">
                    <div>
                      <p className="font-medium">{email.type}</p>
                      <p className="text-sm text-gray-600">{email.recipient}</p>
                      <p className="text-xs text-gray-500">{email.sent}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {email.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Atual */}
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
          <CardHeader>
            <CardTitle>Status Atual dos Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm">Estoque Baixo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm">Vencendo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm">Pedidos Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm">Emails Hoje</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
