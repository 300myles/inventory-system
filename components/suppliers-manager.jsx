"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useInventory } from "@/contexts/inventory-context"

export default function SuppliersManager() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = (formData) => {
    const newSupplier = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      rating: Number.parseFloat(formData.get("rating")) || 0,
      totalOrders: 0,
    }
    addSupplier(newSupplier)
    setIsAddDialogOpen(false)
  }

  const handleEditSupplier = (formData) => {
    if (!editingSupplier) return

    const updates = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      rating: Number.parseFloat(formData.get("rating")),
    }
    updateSupplier(editingSupplier.id, updates)
    setIsEditDialogOpen(false)
    setEditingSupplier(null)
  }

  const openEditDialog = (supplier) => {
    setEditingSupplier(supplier)
    setIsEditDialogOpen(true)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }
}
