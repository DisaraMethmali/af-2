"use client"

import { createContext, useContext, useState } from "react"
import { Snackbar, Alert, AlertTitle } from "@mui/material"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)
  const [open, setOpen] = useState(false)

  const showToast = ({ title, message, type = "success" }) => {
    setToast({ title, message, type })
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity={toast.type} variant="filled" sx={{ width: "100%" }}>
            {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  )
}

export default ToastProvider
