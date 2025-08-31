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
  Eye,
  ShoppingCart,
  Calendar,
  HistoryIcon,
  X,
} from "lucide-react";
import { useInventory } from "@/contexts/inventory-context";
import { useTheme } from "@/contexts/theme-context";

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    suppliers,
    inventory,
    addPurchaseOrder,
    updatePurchaseOrder,
  } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([
    { itemId: "", quantity: 0, unitCost: 0 },
  ]);

    const { theme } = useTheme();

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOrder = (formData) => {
    const validItems = orderItems.filter(
      (item) => item.itemId && item.quantity > 0
    );
    const totalAmount = validItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    );

    const newOrder = {
      supplier: formData.get("supplier"),
      items: validItems.map((item) => {
        const inventoryItem = inventory.find((inv) => inv.id === item.itemId);
        return {
          itemId: item.itemId,
          itemName: inventoryItem?.name || "",
          quantity: item.quantity,
          unitCost: item.unitCost,
        };
      }),
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      expectedDelivery: formData.get("expectedDelivery"),
      notes: formData.get("notes") || undefined,
    };

    addPurchaseOrder(newOrder);
    setIsAddDialogOpen(false);
    setOrderItems([{ itemId: "", quantity: 0, unitCost: 0 }]);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { itemId: "", quantity: 0, unitCost: 0 }]);
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const viewOrder = (order) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    updatePurchaseOrder(orderId, { status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Inventory History
          </h2>
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            See recent activities below:
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <Card
        className={` ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-transparent border-gray-200"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle
            className={`flex items-center gap-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            <HistoryIcon className="h-5 w-5" />
            Recent Activities ({filteredOrders.length})
          </CardTitle>

          <div className="relative flex-1 max-w-sm">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            />
            <Input
              placeholder="Search orders or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-transparent border-gray-400 text-gray-800 placeholder-gray-800"
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead>Item ID</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Item(s)</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className={`border-gray-800  ${
                    theme === "dark"
                      ? "hover:bg-gray-800/50"
                      : "hover:bg-gray-300/50"
                  }`}
                >
                  <TableCell>
                    <p className="font-medium">{order.id}</p>
                  </TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.items.length} items</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items[0]?.itemName}
                        {order.items.length > 1 &&
                          ` +${order.items.length - 1} more`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      &#8358;{order.totalAmount.toFixed(2)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {order.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOrder(order)}
                      className={`border-gray-700 cursor-pointer hover:bg-gray-800  ${
                        theme === "dark"
                          ? "text-gray-200"
                          : "text-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View history Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent
          className={` max-w-3xl ${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div
              className={`space-y-6 rounded-[20px] p-[10px] border ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Item ID</Label>
                  <p>{viewingOrder.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Agent</Label>
                  <p>{viewingOrder.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Created At</Label>
                  <p>{viewingOrder.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Total Amount</Label>
                  <p className="text-lg font-semibold">
                    &#8358;{viewingOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>&#8358;{item.unitCost.toFixed(2)}</TableCell>
                        <TableCell>
                          &#8358;{(item.quantity * item.unitCost).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {viewingOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    {viewingOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-red-700 hover-bg-red-400 cursor-pointer text-gray-200"
            >
              <HistoryIcon />
              Reverse Action
            </Button>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-gray-700 hover-bg-gray-400 cursor-pointer text-gray-200"
            >
              <X />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
