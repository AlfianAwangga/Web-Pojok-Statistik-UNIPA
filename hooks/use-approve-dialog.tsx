"use client";

import { useState } from "react";

interface ApproveItem {
  id: number;
  title?: string;
}

export function useApproveDialog<T extends ApproveItem>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [approving, setApproving] = useState(false);

  const openApprove = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeApprove = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedItem,
    approving,
    setApproving,
    openApprove,
    closeApprove,
  };
}
