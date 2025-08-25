"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Database,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

// Componente de Logo Elaborado para Configurações
function CoffeeLogoIcon() {
  return (
    <div className="relative h-6 w-6">
      {/* Círculo externo com gradiente */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Círculo interno */}
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 flex items-center justify-center">
        {/* Grão de café estilizado */}
        <div className="relative">
          <div className="w-3 h-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transform rotate-12">
            {/* Linha central do grão */}
            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-amber-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Brilho superior */}
      <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/30 rounded-full blur-sm"></div>
    </div>
  )
}

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    nomeEmpresa: "Oliver Coffee",
    fusoHorario: "America/Sao_Paulo",
    moeda: "BRL",
    idioma: "pt-BR",

    // Configurações de Notificação
    alertasEstoqueBaixo: true,
    alertasVencimento: true,
    alertasStatusPedido: true,
    notificacoesEmail: true,
    notificacoesPush: false,
    limiteAlerta: 20,

    // Configurações do Sistema
    backupAutomatico: true,
    frequenciaBackup: "diario",
    retencaoDados: 365,
    modoManutencao: false,

    // Configurações de Segurança
    timeoutSessao: 30,
    expiracaoSenha: 90,
    autenticacaoDoisFatores: false,
    logAuditoria: true,
  })

  const [statusSistema, setStatusSistema] = useState({
    bancoDados: "online",
    backup: "concluido",
    ultimoBackup: "2024-01-25 03:00:00",
    usodisco: 45,
    usoMemoria: 62,
    tempoAtivo: "15 dias, 8 horas",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Lógica para salvar configurações
    console.log("Configurações salvas:", settings)
  }

  const handleExportData = () => {
    const data = {
      configuracoes: settings,
      statusSistema,
      dataExportacao: new Date().toISOString(),
      versao: "2.0.0",
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `oliver-coffee-configuracoes-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const handleSystemRestart = () => {
    // Lógica para reiniciar o sistema
    console.log("Reinicialização do sistema iniciada")
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Configurações do Sistema</h2>
          <p className="text-gray-400">Configure seu sistema de inventário Oliver Coffee</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleSaveSettings} className="bg-amber-600 hover:bg-amber-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Visão Geral do Status do Sistema */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Banco de Dados</CardTitle>
            <Database className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-green-400">Online</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Último Backup</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-200">Hoje 03:00</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Uso do Disco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-400">{statusSistema.usodisco}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Tempo Ativo</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400">{statusSistema.tempoAtivo}</div>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Configurações */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-gray-800">
          <TabsTrigger value="geral" className="data-[state=active]:bg-amber-600">
            Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="data-[state=active]:bg-amber-600">
            Notificações
          </TabsTrigger>
          <TabsTrigger value="sistema" className="data-[state=active]:bg-amber-600">
            Sistema
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="data-[state=active]:bg-amber-600">
            Segurança
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-amber-600">
            Backup
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <CoffeeLogoIcon />
                Configurações Gerais
              </CardTitle>
              <CardDescription className="text-gray-400">Configuração básica para sua cafeteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa" className="text-gray-200">
                    Nome da Empresa
                  </Label>
                  <Input
                    id="nomeEmpresa"
                    value={settings.nomeEmpresa}
                    onChange={(e) => handleSettingChange("nomeEmpresa", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fusoHorario" className="text-gray-200">
                    Fuso Horário
                  </Label>
                  <Select
                    value={settings.fusoHorario}
                    onValueChange={(value) => handleSettingChange("fusoHorario", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="America/Sao_Paulo">Horário de Brasília</SelectItem>
                      <SelectItem value="America/Manaus">Horário do Amazonas</SelectItem>
                      <SelectItem value="America/Noronha">Horário de Fernando de Noronha</SelectItem>
                      <SelectItem value="America/Rio_Branco">Horário do Acre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moeda" className="text-gray-200">
                    Moeda
                  </Label>
                  <Select value={settings.moeda} onValueChange={(value) => handleSettingChange("moeda", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idioma" className="text-gray-200">
                    Idioma
                  </Label>
                  <Select value={settings.idioma} onValueChange={(value) => handleSettingChange("idioma", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en">Inglês</SelectItem>
                      <SelectItem value="es">Espanhol</SelectItem>
                      <SelectItem value="fr">Francês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificação */}
        <TabsContent value="notificacoes">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Bell className="h-5 w-5 text-blue-400" />
                Configurações de Notificação
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure alertas e preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Alertas de Estoque Baixo</Label>
                    <p className="text-sm text-gray-400">Receba notificações quando itens estiverem em baixa</p>
                  </div>
                  <Switch
                    checked={settings.alertasEstoqueBaixo}
                    onCheckedChange={(checked) => handleSettingChange("alertasEstoqueBaixo", checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Alertas de Vencimento</Label>
                    <p className="text-sm text-gray-400">Receba notificações sobre itens próximos ao vencimento</p>
                  </div>
                  <Switch
                    checked={settings.alertasVencimento}
                    onCheckedChange={(checked) => handleSettingChange("alertasVencimento", checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Alertas de Status de Pedidos</Label>
                    <p className="text-sm text-gray-400">Receba notificações sobre atualizações de pedidos</p>
                  </div>
                  <Switch
                    checked={settings.alertasStatusPedido}
                    onCheckedChange={(checked) => handleSettingChange("alertasStatusPedido", checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Notificações por Email</Label>
                    <p className="text-sm text-gray-400">Receba notificações via email</p>
                  </div>
                  <Switch
                    checked={settings.notificacoesEmail}
                    onCheckedChange={(checked) => handleSettingChange("notificacoesEmail", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limiteAlerta" className="text-gray-200">
                  Limite de Alerta (%)
                </Label>
                <Input
                  id="limiteAlerta"
                  type="number"
                  value={settings.limiteAlerta}
                  onChange={(e) => handleSettingChange("limiteAlerta", Number.parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
                <p className="text-sm text-gray-400">
                  Disparar alertas de estoque baixo quando o inventário cair abaixo desta porcentagem
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="sistema">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Settings className="h-5 w-5 text-purple-400" />
                Configuração do Sistema
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configurações avançadas do sistema e manutenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Modo de Manutenção</Label>
                    <p className="text-sm text-gray-400">Ativar modo de manutenção para atualizações do sistema</p>
                  </div>
                  <Switch
                    checked={settings.modoManutencao}
                    onCheckedChange={(checked) => handleSettingChange("modoManutencao", checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="space-y-2">
                  <Label htmlFor="retencaoDados" className="text-gray-200">
                    Retenção de Dados (dias)
                  </Label>
                  <Input
                    id="retencaoDados"
                    type="number"
                    value={settings.retencaoDados}
                    onChange={(e) => handleSettingChange("retencaoDados", Number.parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-200"
                  />
                  <p className="text-sm text-gray-400">Por quanto tempo manter dados históricos</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleSystemRestart}
                  className="border-gray-700 hover:bg-gray-800 text-gray-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Sistema
                </Button>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200">
                  <Database className="h-4 w-4 mr-2" />
                  Otimizar Banco de Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="seguranca">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Shield className="h-5 w-5 text-green-400" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription className="text-gray-400">Configure segurança e controles de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeoutSessao" className="text-gray-200">
                    Timeout de Sessão (minutos)
                  </Label>
                  <Input
                    id="timeoutSessao"
                    type="number"
                    value={settings.timeoutSessao}
                    onChange={(e) => handleSettingChange("timeoutSessao", Number.parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiracaoSenha" className="text-gray-200">
                    Expiração de Senha (dias)
                  </Label>
                  <Input
                    id="expiracaoSenha"
                    type="number"
                    value={settings.expiracaoSenha}
                    onChange={(e) => handleSettingChange("expiracaoSenha", Number.parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-gray-400">Exigir 2FA para todas as contas de usuário</p>
                  </div>
                  <Switch
                    checked={settings.autenticacaoDoisFatores}
                    onCheckedChange={(checked) => handleSettingChange("autenticacaoDoisFatores", checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Log de Auditoria</Label>
                    <p className="text-sm text-gray-400">
                      Registrar todas as ações do usuário para auditoria de segurança
                    </p>
                  </div>
                  <Switch
                    checked={settings.logAuditoria}
                    onCheckedChange={(checked) => handleSettingChange("logAuditoria", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Backup */}
        <TabsContent value="backup">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Database className="h-5 w-5 text-blue-400" />
                Backup e Gestão de Dados
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure configurações de backup e opções de exportação de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-200">Backup Automático</Label>
                    <p className="text-sm text-gray-400">Ativar backups automáticos do sistema</p>
                  </div>
                  <Switch
                    checked={settings.backupAutomatico}
                    onCheckedChange={(checked) => handleSettingChange("backupAutomatico", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequenciaBackup" className="text-gray-200">
                    Frequência do Backup
                  </Label>
                  <Select
                    value={settings.frequenciaBackup}
                    onValueChange={(value) => handleSettingChange("frequenciaBackup", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="horario">A cada hora</SelectItem>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Exportação e Importação de Dados</h4>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="border-gray-700 hover:bg-gray-800 text-gray-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Dados
                  </Button>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-200 mb-2">Status do Backup</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Último Backup:</span>
                    <span className="text-green-400">{statusSistema.ultimoBackup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700">
                      Concluído
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Próximo Backup:</span>
                    <span className="text-gray-300">Amanhã 03:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
