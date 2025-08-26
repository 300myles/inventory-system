"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scan, Search, Package, Plus, Minus } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useInventory } from "@/contexts/inventory-context"

export default function BarcodeScanner() {
  const { theme } = useTheme()
  const { inventory, updateInventoryItem } = useInventory()
  const [isOpen, setIsOpen] = useState(false)
  const [scanCode, setScanCode] = useState("")
  const [foundItem, setFoundItem] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanHistory, setScanHistory] = useState([])

  const simulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      const randomItem = inventory[Math.floor(Math.random() * inventory.length)]
      setScanCode(randomItem.sku)
      searchItem(randomItem.sku)
      setIsScanning(false)
    }, 2000)
  }

  const searchItem = (code) => {
    const item = inventory.find((i) => i.sku === code || i.name.toLowerCase().includes(code.toLowerCase()))
    setFoundItem(item || null)

    if (item) {
      setScanHistory((prev) => [
        {
          id: Date.now(),
          item: item.name,
          code: code,
          timestamp: new Date().toLocaleString("pt-BR"),
          action: "Encontrado",
        },
        ...prev.slice(0, 4),
      ])
    }
  }

  const adjustQuantity = (itemId, change) => {
    const currentItem = inventory.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.currentStock + change)
      updateInventoryItem(itemId, { currentStock: newQuantity })

      // Atualizar o item encontrado localmente
      setFoundItem({ ...currentItem, currentStock: newQuantity })

      setScanHistory((prev) => [
        {
          id: Date.now(),
          item: foundItem.name,
          code: foundItem.sku,
          timestamp: new Date().toLocaleString("pt-BR"),
          action: `${change > 0 ? "+" : ""}${change} unidades`,
        },
        ...prev.slice(0, 4),
      ])
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
          <Scan className="h-4 w-4 mr-2" />
          Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white"}`}>
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
            Scanner de Código de Barras
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scanner Simulado */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scanner Ativo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${
                  isScanning ? "border-amber-500 bg-amber-50" : theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              >
                {isScanning ? (
                  <div className="text-center">
                    <div className="animate-pulse text-amber-600">
                      <Scan className="h-8 w-8 mx-auto mb-2" />
                      <p>Escaneando...</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <p>Posicione o código de barras aqui</p>
                  </div>
                )}
              </div>

              <Button onClick={simulateScan} disabled={isScanning} className="w-full">
                {isScanning ? "Escaneando..." : "Simular Escaneamento"}
              </Button>
            </CardContent>
          </Card>

          {/* Busca Manual */}
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Busca Manual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código ou SKU..."
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
                <Button onClick={() => searchItem(scanCode)}>Buscar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Item Encontrado */}
          {foundItem && (
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Item Encontrado</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Encontrado
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={foundItem.image || "/placeholder.svg"}
                    alt={foundItem.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{foundItem.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {foundItem.sku}</p>
                    <p className="text-sm">
                      Estoque: {foundItem.currentStock} {foundItem.unit}
                    </p>
                    <p className="text-sm">Preço: R$ {foundItem.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => adjustQuantity(foundItem.id, -10)}>
                    <Minus className="h-4 w-4 mr-1" />
                    -10
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adjustQuantity(foundItem.id, -1)}>
                    <Minus className="h-4 w-4 mr-1" />
                    -1
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adjustQuantity(foundItem.id, 1)}>
                    <Plus className="h-4 w-4 mr-1" />
                    +1
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adjustQuantity(foundItem.id, 10)}>
                    <Plus className="h-4 w-4 mr-1" />
                    +10
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          {scanHistory.length > 0 && (
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle>Histórico de Escaneamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex justify-between items-center p-2 rounded border">
                      <div>
                        <p className="font-medium">{scan.item}</p>
                        <p className="text-sm text-gray-600">{scan.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{scan.action}</p>
                        <p className="text-xs text-gray-500">{scan.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
