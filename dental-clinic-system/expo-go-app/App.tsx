import { useMemo, useRef, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { WebView } from "react-native-webview"
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from "react-native-webview/lib/WebViewTypes"

const FALLBACK_URL = "http://localhost:3000"

export default function App() {
  const webRef = useRef<WebView>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  // Defina EXPO_PUBLIC_WEB_URL para apontar para seu Next.js local (ex: http://192.168.0.10:3000)
  const targetUrl = useMemo(() => {
    const envUrl = process.env.EXPO_PUBLIC_WEB_URL
    if (envUrl && envUrl.length > 0) return envUrl
    return FALLBACK_URL
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        ref={webRef}
        source={{ uri: targetUrl }}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        onError={(event: WebViewErrorEvent) => setLastError(event.nativeEvent.description)}
        onHttpError={(event: WebViewHttpErrorEvent) =>
          setLastError(`${event.nativeEvent.statusCode}: ${event.nativeEvent.description}`)
        }
        startInLoadingState
        renderError={(errorName: string) => (
          <View style={styles.errorBox}>
            <Text style={styles.title}>Não foi possível carregar</Text>
            <Text style={styles.subtitle}>{errorName}</Text>
            {lastError ? <Text style={styles.detail}>{lastError}</Text> : null}
            <Text style={styles.hint}>Verifique se o servidor Next.js está acessível nesta rede.</Text>
            <TouchableOpacity
              onPress={() => {
                setLastError(null)
                webRef.current?.reload()
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0ea5e9",
  },
  errorBox: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#e0f2fe",
    marginBottom: 6,
    textAlign: "center",
  },
  detail: {
    fontSize: 12,
    color: "#dbeafe",
    marginBottom: 10,
    textAlign: "center",
  },
  hint: {
    fontSize: 12,
    color: "#dbeafe",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
})
