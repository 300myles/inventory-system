"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
  Package,
  Scan,
  Eye,
  TrendingDown,
  Clock,
  ImageIcon,
} from "lucide-react"
import { useInventory } from "@/contexts/inventory-context"

export default function InventoryManager() {
  const { inventory, suppliers, addInventoryItem, updateInventoryItem, deleteInventoryItem, getStockPrediction } =
    useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [viewingItem, setViewingItem] = useState(null)

  const categories = Array.from(new Set(inventory.map((item) => item.category)))

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    let matchesStatus = true
    if (statusFilter === "low_stock") {
      matchesStatus = item.currentStock <= item.minStock
    } else if (statusFilter === "out_of_stock") {
      matchesStatus = item.currentStock === 0
    } else if (statusFilter === "expiring") {
      if (item.expiryDate) {
        const today = new Date()
        const expiryDate = new Date(item.expiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        matchesStatus = daysUntilExpiry <= 30 && daysUntilExpiry > 0
      } else {
        matchesStatus = false
      }
    }

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddItem = (formData) => {
    const newItem = {
      name: formData.get("name"),
      category: formData.get("category"),
      currentStock: Number.parseInt(formData.get("currentStock")),
      minStock: Number.parseInt(formData.get("minStock")),
      maxStock: Number.parseInt(formData.get("maxStock")),
      unit: formData.get("unit"),
      costPerUnit: Number.parseFloat(formData.get("costPerUnit")),
      supplier: formData.get("supplier"),
      lastRestocked: new Date().toISOString().split("T")[0],
      expiryDate: formData.get("expiryDate") || undefined,
      sku: formData.get("sku"),
      location: formData.get("location"),
      barcode: formData.get("barcode") || undefined,
      description: formData.get("description") || undefined,
      image: "/placeholder.svg?height=80&width=80",
      reorderPoint: Number.parseInt(formData.get("reorderPoint")),
      leadTime: Number.parseInt(formData.get("leadTime")),
      avgDailyUsage: Number.parseFloat(formData.get("avgDailyUsage")),
    }
    addInventoryItem(newItem)
    setIsAddDialogOpen(false)
  }

  const handleEditItem = (formData) => {
    if (!editingItem) return

    const updates = {
      name: formData.get("name"),
      category: formData.get("category"),
      currentStock: Number.parseInt(formData.get("currentStock")),
      minStock: Number.parseInt(formData.get("minStock")),
      maxStock: Number.parseInt(formData.get("maxStock")),
      unit: formData.get("unit"),
      costPerUnit: Number.parseFloat(formData.get("costPerUnit")),
      supplier: formData.get("supplier"),
      expiryDate: formData.get("expiryDate") || undefined,
      sku: formData.get("sku"),
      location: formData.get("location"),
      barcode: formData.get("barcode") || undefined,
      description: formData.get("description") || undefined,
      reorderPoint: Number.parseInt(formData.get("reorderPoint")),
      leadTime: Number.parseInt(formData.get("leadTime")),
      avgDailyUsage: Number.parseFloat(formData.get("avgDailyUsage")),
    }
    updateInventoryItem(editingItem.id, updates)
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  const openEditDialog = (item) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (item) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const getItemStatus = (item) => {
    if (item.currentStock === 0) {
      return { status: "Sem Estoque", color: "bg-red-900 text-red-300 border-red-700", icon: AlertTriangle }
    }
    if (item.currentStock <= item.minStock) {
      return { status: "Estoque Baixo", color: "bg-yellow-900 text-yellow-300 border-yellow-700", icon: TrendingDown }
    }
    if (item.expiryDate) {
      const today = new Date()
      const expiryDate = new Date(item.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        return { status: "Vencendo", color: "bg-orange-900 text-orange-300 border-orange-700", icon: Clock }
      }
    }
    return { status: "Em Estoque", color: "bg-green-900 text-green-300 border-green-700", icon: Package }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Gestão de Inventário</h2>
          <p className="text-gray-400">Gerencie os itens do inventário da Oliver Coffee</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200 bg-transparent">
            <Scan className="h-4 w-4 mr-2" />
            Escanear Código
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-200">Adicionar Novo Item do Inventário</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Insira os detalhes para o novo item do inventário.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddItem}>
                <div className="grid gap-6 py-4">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-200">Informações Básicas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">
                          Nome do Item *
                        </Label>
                        <Input id="name" name="name" required className="bg-gray-800 border-gray-700 text-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku" className="text-gray-200">
                          SKU *
                        </Label>
                        <Input id="sku" name="sku" required className="bg-gray-800 border-gray-700 text-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="barcode" className="text-gray-200">
                          Código de Barras
                        </Label>
                        <Input id="barcode" name="barcode" className="bg-gray-800 border-gray-700 text-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-200">
                          Categoria *
                        </Label>
                        <Select name="category" required>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="Selecionar categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="Grãos de Café">Grãos de Café</SelectItem>
                            <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                            <SelectItem value="Laticínios">Laticínios</SelectItem>
                            <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                            <SelectItem value="Xaropes">Xaropes</SelectItem>
                            <SelectItem value="Padaria">Padaria</SelectItem>
                            <SelectItem value="Temperos">Temperos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-200">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        className="bg-gray-800 border-gray-700 text-gray-200"
                        placeholder="Breve descrição do item..."
                      />
                    </div>
                  </div>

                  {/* Informações de Estoque */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-200">Informações de Estoque</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentStock" className="text-gray-200">
                          Estoque Atual *
                        </Label>
                        <Input
                          id="currentStock"
                          name="currentStock"
                          type="number"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock" className="text-gray-200">
                          Estoque Mínimo *
                        </Label>
                        <Input
                          id="minStock"
                          name="minStock"
                          type="number"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxStock" className="text-gray-200">
                          Estoque Máximo *
                        </Label>
                        <Input
                          id="maxStock"
                          name="maxStock"
                          type="number"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorderPoint" className="text-gray-200">
                          Ponto de Reposição *
                        </Label>
                        <Input
                          id="reorderPoint"
                          name="reorderPoint"
                          type="number"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-gray-200">
                          Unidade *
                        </Label>
                        <Select name="unit" required>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="Selecionar unidade" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="unidades">unidades</SelectItem>
                            <SelectItem value="litros">litros</SelectItem>
                            <SelectItem value="caixas">caixas</SelectItem>
                            <SelectItem value="frascos">frascos</SelectItem>
                            <SelectItem value="potes">potes</SelectItem>
                            <SelectItem value="sacos">sacos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avgDailyUsage" className="text-gray-200">
                          Uso Médio Diário
                        </Label>
                        <Input
                          id="avgDailyUsage"
                          name="avgDailyUsage"
                          type="number"
                          step="0.1"
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações de Fornecedor e Custo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-200">Informações de Fornecedor e Custo</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier" className="text-gray-200">
                          Fornecedor *
                        </Label>
                        <Select name="supplier" required>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="Selecionar fornecedor" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.name}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costPerUnit" className="text-gray-200">
                          Custo por Unidade (R$) *
                        </Label>
                        <Input
                          id="costPerUnit"
                          name="costPerUnit"
                          type="number"
                          step="0.01"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leadTime" className="text-gray-200">
                          Tempo de Entrega (dias)
                        </Label>
                        <Input
                          id="leadTime"
                          name="leadTime"
                          type="number"
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-gray-200">
                          Data de Vencimento
                        </Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações de Localização */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-200">Informações de Localização</h3>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-200">
                        Local de Armazenamento *
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                        placeholder="ex: Depósito A - Prateleira 1"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-gray-700 hover:bg-gray-800 text-gray-200"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    Adicionar Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar itens, SKU ou código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-gray-200"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                <SelectItem value="expiring">Vencendo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Inventário com Imagens Reais */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Package className="h-5 w-5" />
            Itens do Inventário ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Imagem</TableHead>
                  <TableHead className="text-gray-300">Item</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Estoque</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Fornecedor</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Previsão</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const itemStatus = getItemStatus(item)
                  const stockValue = item.currentStock * item.costPerUnit
                  const prediction7Days = getStockPrediction(item.id, 7)
                  const StatusIcon = itemStatus.icon

                  return (
                    <TableRow key={item.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-lg">
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.target
                                target.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                              <ImageIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-200">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.sku}</p>
                          {item.barcode && <p className="text-xs text-gray-500">Código: {item.barcode}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-200">
                            {item.currentStock} {item.unit}
                          </p>
                          <p className="text-sm text-gray-400">
                            Mín: {item.minStock} | Máx: {item.maxStock}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={itemStatus.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {itemStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{item.supplier}</TableCell>
                      <TableCell className="text-gray-300">
                        R$ {stockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-300">
                            {prediction7Days.toFixed(1)} {item.unit}
                          </p>
                          <p className="text-xs text-gray-500">em 7 dias</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(item)}
                            className="border-gray-700 hover:bg-gray-800 text-gray-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="border-gray-700 hover:bg-gray-800 text-gray-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInventoryItem(item.id)}
                            className="border-red-700 hover:bg-red-900 text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Visualização de Item com Imagem Real */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Detalhes do Item</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações detalhadas sobre {viewingItem?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-lg">
                  {viewingItem.image ? (
                    <img
                      src={viewingItem.image || "/placeholder.svg"}
                      alt={viewingItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target
                        target.src = "/placeholder.svg?height=96&width=96"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-200">{viewingItem.name}</h3>
                  <p className="text-gray-400">{viewingItem.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">SKU</Label>
                  <p className="text-gray-200">{viewingItem.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Categoria</Label>
                  <p className="text-gray-200">{viewingItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Fornecedor</Label>
                  <p className="text-gray-200">{viewingItem.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Estoque Atual</Label>
                  <p className="text-gray-200">
                    {viewingItem.currentStock} {viewingItem.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Custo por Unidade</Label>
                  <p className="text-gray-200">
                    R$ {viewingItem.costPerUnit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Valor Total</Label>
                  <p className="text-gray-200">
                    R${" "}
                    {(viewingItem.currentStock * viewingItem.costPerUnit).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Localização</Label>
                  <p className="text-gray-200">{viewingItem.location}</p>
                </div>
                {viewingItem.expiryDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Data de Vencimento</Label>
                    <p className="text-gray-200">{new Date(viewingItem.expiryDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-300">Última Reposição</Label>
                  <p className="text-gray-200">{new Date(viewingItem.lastRestocked).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Previsão 7 Dias</Label>
                  <p className="text-gray-200">
                    {getStockPrediction(viewingItem.id, 7).toFixed(1)} {viewingItem.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Previsão 30 Dias</Label>
                  <p className="text-gray-200">
                    {getStockPrediction(viewingItem.id, 30).toFixed(1)} {viewingItem.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Tempo de Entrega</Label>
                  <p className="text-gray-200">{viewingItem.leadTime} dias</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="bg-amber-600 hover:bg-amber-700">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição - Estrutura similar ao de Adicionar mas com valores padrão */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Editar Item do Inventário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize os detalhes deste item do inventário.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form action={handleEditItem}>
              <div className="grid gap-6 py-4">
                {/* Estrutura similar ao formulário de adicionar mas com defaultValue */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-gray-200">
                        Nome do Item *
                      </Label>
                      <Input
                        id="edit-name"
                        name="name"
                        defaultValue={editingItem.name}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-sku" className="text-gray-200">
                        SKU *
                      </Label>
                      <Input
                        id="edit-sku"
                        name="sku"
                        defaultValue={editingItem.sku}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-barcode" className="text-gray-200">
                        Código de Barras
                      </Label>
                      <Input
                        id="edit-barcode"
                        name="barcode"
                        defaultValue={editingItem.barcode}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category" className="text-gray-200">
                        Categoria *
                      </Label>
                      <Select name="category" defaultValue={editingItem.category} required>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Grãos de Café">Grãos de Café</SelectItem>
                          <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                          <SelectItem value="Laticínios">Laticínios</SelectItem>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                          <SelectItem value="Xaropes">Xaropes</SelectItem>
                          <SelectItem value="Padaria">Padaria</SelectItem>
                          <SelectItem value="Temperos">Temperos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-gray-200">
                      Descrição
                    </Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={editingItem.description}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>

                {/* Informações de Estoque */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">Informações de Estoque</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-currentStock" className="text-gray-200">
                        Estoque Atual *
                      </Label>
                      <Input
                        id="edit-currentStock"
                        name="currentStock"
                        type="number"
                        defaultValue={editingItem.currentStock}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-minStock" className="text-gray-200">
                        Estoque Mínimo *
                      </Label>
                      <Input
                        id="edit-minStock"
                        name="minStock"
                        type="number"
                        defaultValue={editingItem.minStock}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxStock" className="text-gray-200">
                        Estoque Máximo *
                      </Label>
                      <Input
                        id="edit-maxStock"
                        name="maxStock"
                        type="number"
                        defaultValue={editingItem.maxStock}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-reorderPoint" className="text-gray-200">
                        Ponto de Reposição *
                      </Label>
                      <Input
                        id="edit-reorderPoint"
                        name="reorderPoint"
                        type="number"
                        defaultValue={editingItem.reorderPoint}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-unit" className="text-gray-200">
                        Unidade *
                      </Label>
                      <Select name="unit" defaultValue={editingItem.unit} required>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="unidades">unidades</SelectItem>
                          <SelectItem value="litros">litros</SelectItem>
                          <SelectItem value="caixas">caixas</SelectItem>
                          <SelectItem value="frascos">frascos</SelectItem>
                          <SelectItem value="potes">potes</SelectItem>
                          <SelectItem value="sacos">sacos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-avgDailyUsage" className="text-gray-200">
                        Uso Médio Diário
                      </Label>
                      <Input
                        id="edit-avgDailyUsage"
                        name="avgDailyUsage"
                        type="number"
                        step="0.1"
                        defaultValue={editingItem.avgDailyUsage}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Informações de Fornecedor e Custo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">Informações de Fornecedor e Custo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-supplier" className="text-gray-200">
                        Fornecedor *
                      </Label>
                      <Select name="supplier" defaultValue={editingItem.supplier} required>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-costPerUnit" className="text-gray-200">
                        Custo por Unidade (R$) *
                      </Label>
                      <Input
                        id="edit-costPerUnit"
                        name="costPerUnit"
                        type="number"
                        step="0.01"
                        defaultValue={editingItem.costPerUnit}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-leadTime" className="text-gray-200">
                        Tempo de Entrega (dias)
                      </Label>
                      <Input
                        id="edit-leadTime"
                        name="leadTime"
                        type="number"
                        defaultValue={editingItem.leadTime}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-expiryDate" className="text-gray-200">
                        Data de Vencimento
                      </Label>
                      <Input
                        id="edit-expiryDate"
                        name="expiryDate"
                        type="date"
                        defaultValue={editingItem.expiryDate}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Informações de Localização */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">Informações de Localização</h3>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location" className="text-gray-200">
                      Local de Armazenamento *
                    </Label>
                    <Input
                      id="edit-location"
                      name="location"
                      defaultValue={editingItem.location}
                      required
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-700 hover:bg-gray-800 text-gray-200"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Atualizar Item
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
