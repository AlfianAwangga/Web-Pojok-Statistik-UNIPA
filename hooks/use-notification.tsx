"use client";

import { useState } from "react";

type NotificationType = "success" | "error";

export function useNotification() {
  const [showAlert, setShowAlert] = useState(false);

  const [alertType, setAlertType] = useState<NotificationType>("success");

  const [alertMessage, setAlertMessage] = useState("");

  const showNotification = (type: NotificationType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return {
    showAlert,
    alertType,
    alertMessage,
    showNotification,
  };
}
