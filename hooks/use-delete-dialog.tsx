"use client";

import { useState } from "react";

interface DeleteItem {
  id: number;
  name?: string;
}

export function useDeleteDialog<T extends DeleteItem>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDelete = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeDelete = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedItem,
    deleting,
    setDeleting,
    openDelete,
    closeDelete,
  };
}
