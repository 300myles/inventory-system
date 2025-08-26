"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Table, FileSpreadsheet, Calendar, Database } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function DataExport() {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")
  const [exportPeriod, setExportPeriod] = useState("all")
  const [selectedData, setSelectedData] = useState({
    inventory: true,
    suppliers: true,
    orders: true,
    reports: false,
    users: false,
  })
  const [exportHistory] = useState([
    { id: 1, type: "Inventário Completo", format: "CSV", date: "2024-01-15", size: "2.3 MB" },
    { id: 2, type: "Relatório Mensal", format: "Excel", date: "2024-01-10", size: "1.8 MB" },
    { id: 3, type: "Dados de Fornecedores", format: "JSON", date: "2024-01-05", size: "0.5 MB" },
  ])

  const formatOptions = [
    { value: "json", label: "JSON", icon: FileText, description: "Formato estruturado para desenvolvimento" },
    { value: "csv", label: "CSV", icon: Table, description: "Planilha compatível com Excel" },
    { value: "excel", label: "Excel", icon: FileSpreadsheet, description: "Arquivo Excel nativo (.xlsx)" },
  ]

  const periodOptions = [
    { value: "all", label: "Todos os dados" },
    { value: "month", label: "Último mês" },
    { value: "quarter", label: "Último trimestre" },
    { value: "year", label: "Último ano" },
  ]

  const calculateEstimatedSize = () => {
    let size = 0
    if (selectedData.inventory) size += 1.2
    if (selectedData.suppliers) size += 0.3
    if (selectedData.orders) size += 0.8
    if (selectedData.reports) size += 2.1
    if (selectedData.users) size += 0.1

    if (exportPeriod === "month") size *= 0.3
    else if (exportPeriod === "quarter") size *= 0.7
    else if (exportPeriod === "year") size *= 0.9

    return size.toFixed(1)
  }

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      format: exportFormat,
      period: exportPeriod,
      data: selectedData,
      estimatedSize: calculateEstimatedSize() + " MB",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `oliver-coffee-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
    a.click()

    alert("Exportação iniciada! O download começará em breve.")
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
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-4xl max-h-[80vh] overflow-y-auto ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white"}`}
      >
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
            Exportação de Dados
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formato de Exportação */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Formato de Exportação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatOptions.map((format) => (
                <div
                  key={format.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    exportFormat === format.value
                      ? "border-amber-500 bg-amber-50"
                      : theme === "dark"
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setExportFormat(format.value)}
                >
                  <div className="flex items-center gap-3">
                    <format.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{format.label}</p>
                      <p className="text-sm text-gray-600">{format.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Período de Dados */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={exportPeriod} onValueChange={setExportPeriod}>
                <SelectTrigger className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Seleção de Dados */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dados para Incluir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inventory"
                    checked={selectedData.inventory}
                    onCheckedChange={(checked) => setSelectedData({ ...selectedData, inventory: checked })}
                  />
                  <label htmlFor="inventory" className="text-sm font-medium">
                    Inventário (produtos, estoque, preços)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suppliers"
                    checked={selectedData.suppliers}
                    onCheckedChange={(checked) => setSelectedData({ ...selectedData, suppliers: checked })}
                  />
                  <label htmlFor="suppliers" className="text-sm font-medium">
                    Fornecedores (contatos, avaliações)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="orders"
                    checked={selectedData.orders}
                    onCheckedChange={(checked) => setSelectedData({ ...selectedData, orders: checked })}
                  />
                  <label htmlFor="orders" className="text-sm font-medium">
                    Pedidos de Compra (histórico, status)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reports"
                    checked={selectedData.reports}
                    onCheckedChange={(checked) => setSelectedData({ ...selectedData, reports: checked })}
                  />
                  <label htmlFor="reports" className="text-sm font-medium">
                    Relatórios (análises, métricas)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="users"
                    checked={selectedData.users}
                    onCheckedChange={(checked) => setSelectedData({ ...selectedData, users: checked })}
                  />
                  <label htmlFor="users" className="text-sm font-medium">
                    Usuários (perfis, permissões)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prévia da Exportação */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle>Prévia da Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Formato:</span>
                  <span className="text-sm font-medium">{exportFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Período:</span>
                  <span className="text-sm font-medium">
                    {periodOptions.find((p) => p.value === exportPeriod)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tamanho estimado:</span>
                  <span className="text-sm font-medium">{calculateEstimatedSize()} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Itens selecionados:</span>
                  <span className="text-sm font-medium">{Object.values(selectedData).filter(Boolean).length}</span>
                </div>
              </div>

              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Iniciar Exportação
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Exportações */}
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
          <CardHeader>
            <CardTitle>Histórico de Exportações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportHistory.map((export_item) => (
                <div key={export_item.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <p className="font-medium">{export_item.type}</p>
                    <p className="text-sm text-gray-600">
                      {export_item.format} • {export_item.size} • {export_item.date}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
