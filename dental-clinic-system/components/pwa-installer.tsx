"use client";

import { useEffect } from "react";

export function PWAInstaller() {
  useEffect(() => {
    // Registrar o service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registrado com sucesso:", registration);
            
            // Verificar por atualizações
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "activated") {
                    console.log("Nova versão disponível!");
                    // Mostrar notificação de atualização
                    if ("Notification" in window && Notification.permission === "granted") {
                      new Notification("Clínica Odontológica", {
                        body: "Uma nova versão do aplicativo está disponível. Recarregue a página.",
                        icon: "/icon-192x192.png",
                      });
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error("Erro ao registrar Service Worker:", error);
          });
      });
    }

    // Pedir permissão para notificações
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Suporte para instalação de PWA
    let deferredPrompt: any;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // Mostrar botão de instalação se necessário
      console.log("PWA pode ser instalado");
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA foi instalado com sucesso");
      deferredPrompt = null;
    });

    // Detectar se está em modo standalone (app instalado)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("Aplicativo está rodando em modo standalone");
    }
  }, []);

  return null;
}

export default PWAInstaller;
