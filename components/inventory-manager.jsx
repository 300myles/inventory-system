"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  PlusIcon,
  Save,
} from "lucide-react";
import { useInventory } from "@/contexts/inventory-context";
import { useTheme } from "@/contexts/theme-context";

export default function InventoryManager() {
  const {
    inventory,
    suppliers,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getStockPrediction,
  } = useInventory();

  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const categories = Array.from(
    new Set(inventory.map((item) => item.category))
  );

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === "low_stock") {
      matchesStatus = item.currentStock <= item.minStock;
    } else if (statusFilter === "out_of_stock") {
      matchesStatus = item.currentStock === 0;
    } else if (statusFilter === "expiring") {
      if (item.uploadedDate) {
        const today = new Date();
        const uploadedDate = new Date(item.uploadedDate);
        const daysUntilExpiry = Math.ceil(
          (uploadedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        matchesStatus = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      } else {
        matchesStatus = false;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const table = [
    "Image",
    "Item",
    "Category",
    "Status",
    "Description",
    "Price",
    "Actions",
  ];

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
      lastUpdated: new Date().toISOString().split("T")[0],
      uploadedDate: formData.get("uploadedDate") || undefined,
      productID: formData.get("productID"),
      location: formData.get("location"),
      barcode: formData.get("barcode") || undefined,
      description: formData.get("description") || undefined,
      image: "/placeholder.svg?height=80&width=80",
      reorderPoint: Number.parseInt(formData.get("reorderPoint")),
      leadTime: Number.parseInt(formData.get("leadTime")),
      avgDailyUsage: Number.parseFloat(formData.get("avgDailyUsage")),
    };
    addInventoryItem(newItem);
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (formData) => {
    if (!editingItem) return;

    const updates = {
      name: formData.get("name"),
      category: formData.get("category"),
      currentStock: Number.parseInt(formData.get("currentStock")),
      minStock: Number.parseInt(formData.get("minStock")),
      maxStock: Number.parseInt(formData.get("maxStock")),
      unit: formData.get("unit"),
      costPerUnit: Number.parseFloat(formData.get("costPerUnit")),
      supplier: formData.get("supplier"),
      uploadedDate: formData.get("uploadedDate") || undefined,
      productID: formData.get("productID"),
      location: formData.get("location"),
      barcode: formData.get("barcode") || undefined,
      description: formData.get("description") || undefined,
      reorderPoint: Number.parseInt(formData.get("reorderPoint")),
      leadTime: Number.parseInt(formData.get("leadTime")),
      avgDailyUsage: Number.parseFloat(formData.get("avgDailyUsage")),
    };
    updateInventoryItem(editingItem.id, updates);
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (item) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const getItemStatus = (item) => {
    if (item.currentStock <= item.minStock) {
      return {
        status: "Out of Stock",
        color: "bg-red-900 text-red-300 border-red-700",
        icon: TrendingDown,
      };
    }
    if (item.uploadedDate) {
      const today = new Date();
      const uploadedDate = new Date(item.uploadedDate);
      const daysUntilExpiry = Math.ceil(
        (uploadedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        return {
          status: "Vencendo",
          color: "bg-orange-900 text-orange-300 border-orange-700",
          icon: Clock,
        };
      }
    }
    return {
      status: "In Stock",
      color: "bg-green-900 text-green-300 border-green-700",
      icon: Package,
    };
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="flex justify-between items-center">
        <div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Inventory
          </h2>
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Comprehensive Inventory Overview
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-200">
                  Add Item to Inventory
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Insert Details of Item
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddItem}>
                <div className="grid gap-6 py-4">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">
                          Name of Item *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productID" className="text-gray-200">
                          Price *
                        </Label>
                        <Input
                          id="productID"
                          name="productID"
                          required
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="barcode" className="text-gray-200">
                          Quantity
                        </Label>
                        <Input
                          id="barcode"
                          name="barcode"
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-200">
                          Category *
                        </Label>
                        <Select name="category" required>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="Appliances">
                              Appliances
                            </SelectItem>
                            <SelectItem value="Medicine">Medicine</SelectItem>
                            <SelectItem value="Item1">Item1</SelectItem>
                            <SelectItem value="Item2">Item2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-200">
                        Description
                      </Label>

                      <Textarea
                        id="description"
                        name="description"
                        className="bg-gray-800 border-gray-700 text-gray-200"
                        placeholder="Item Description Here..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-gray-200">
                        Image
                      </Label>
                      <Input
                        type="file"
                        id="image"
                        name="image"
                        className="bg-gray-800 border-gray-700 text-gray-200"
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon />
                    Add Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Section */}
      <Card
        className={` ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-transparent border-gray-200"
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              />
              <Input
                placeholder="Search For Items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10  ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-transparent border-gray-400 text-gray-800 placeholder-gray-800"
                }`}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className={`w-48 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-transparent border-gray-400 text-gray-800"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-400"
                }`}
              >
                <SelectItem value="all">Items Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className={`w-48 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-transparent border-gray-400 text-gray-800"
                }`}
              >
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-400"
                }`}
              >
                <SelectItem value="all">Stock Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-transparent border-gray-200"
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            <Package className="h-5 w-5" />
            Items in Inventory ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  {table?.map((item, id) => (
                    <TableHead key={id} className="text-gray-300">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const itemStatus = getItemStatus(item);
                  const stockValue = item.currentStock * item.costPerUnit;
                  const prediction7Days = getStockPrediction(item.id, 7);
                  const StatusIcon = itemStatus.icon;

                  return (
                    <TableRow
                      key={item.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-lg">
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.target;
                                target.src =
                                  "/placeholder.svg?height=64&width=64";
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
                          <p className="font-medium text-gray-200">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {item.productID}
                          </p>
                          {item.barcode && (
                            <p className="text-xs text-gray-500">
                              Código: {item.barcode}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={itemStatus.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {itemStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        &#8358;{" "}
                        {stockValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(item)}
                            className="border-gray-700 cursor-pointer hover:bg-gray-800 text-gray-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="border-gray-700 cursor-pointer hover:bg-gray-800 text-gray-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInventoryItem(item.id)}
                            className="border-red-700 cursor-pointer hover:bg-red-900 text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Of Item Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Details of Item</DialogTitle>
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
                        const target = e.target;
                        target.src = "/placeholder.svg?height=96&width=96";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-200">
                    {viewingItem.name}
                  </h3>
                  <p className="text-gray-400">{viewingItem.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Item ID
                  </Label>
                  <p className="text-gray-200">{viewingItem.productID}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Category
                  </Label>
                  <p className="text-gray-200">{viewingItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Quantity
                  </Label>
                  <p className="text-gray-200">80</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Price
                  </Label>
                  <p className="text-gray-200">
                    &#8358;{" "}
                    {viewingItem.costPerUnit.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Total Value
                  </Label>
                  <p className="text-gray-200">
                    &#8358;{" "}
                    {(
                      viewingItem.currentStock * viewingItem.costPerUnit
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                {viewingItem.uploadedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-300">
                      Date Added
                    </Label>
                    <p className="text-gray-200">
                      {new Date(viewingItem.uploadedDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-300">
                    Last Modified
                  </Label>
                  <p className="text-gray-200">
                    {new Date(viewingItem.lastUpdated).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Inventory Item*/}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Edit Item</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edit Item Details
            </DialogDescription>
          </DialogHeader>
          <form action={handleAddItem}>
            <div className="grid gap-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Name of Item *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productID" className="text-gray-200">
                      Price *
                    </Label>
                    <Input
                      id="productID"
                      name="productID"
                      required
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode" className="text-gray-200">
                      Quantity
                    </Label>
                    <Input
                      id="barcode"
                      name="barcode"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-200">
                      Category *
                    </Label>
                    <Select name="category" required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Appliances">Appliances</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                        <SelectItem value="Item1">Item1</SelectItem>
                        <SelectItem value="Item2">Item2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-200">
                    Description
                  </Label>

                  <Textarea
                    id="description"
                    name="description"
                    className="bg-gray-800 border-gray-700 text-gray-200"
                    placeholder="Item Description Here..."
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
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700"
              >
                <Save />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
