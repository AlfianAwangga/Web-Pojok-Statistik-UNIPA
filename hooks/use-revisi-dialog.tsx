"use client";

import { useState } from "react";

interface RevisiItem {
  id: number;
  title?: string;
  revisi_msg?: string;
}

export function useRevisiDialog<T extends RevisiItem>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openRevisi = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeRevisi = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedItem,
    submitting,
    setSubmitting,
    openRevisi,
    closeRevisi,
  };
}
