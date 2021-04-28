import React, { createContext, useCallback, useContext, useRef } from 'react';
import { Toast as PrimeToast } from 'primereact/toast';

interface ToastContextData {
  addToast(message: ToastMessage): void;
  addErrorToast(action: string, message: string, duration?: number): void;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warn';
  title: string;
  description?: string;
  duration?: number;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const toast = useRef<PrimeToast>(null);

  const addToast = useCallback(
    ({
      type,
      title,
      description,
      duration = 3000,
    }: Omit<ToastMessage, 'id'>) => {
      toast.current?.show({
        severity: type,
        summary: title,
        detail: description,
        life: duration,
      });
    },
    [],
  );

  const addErrorToast = useCallback(
    (action: string, message: string, duration = 3000) => {
      const toastMessage: ToastMessage = {
        type: 'error',
        title: `Erro ao ${action}.`,
        description: `${message}`,
        duration,
      };

      addToast(toastMessage);
    },
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, addErrorToast }}>
      <PrimeToast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
