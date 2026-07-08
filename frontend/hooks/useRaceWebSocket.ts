import { useEffect, useRef } from "react";
import { useRaceStore } from "../store/useRaceStore";

export function useRaceWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const { setSocket, updateFromWebSocket, setDriverAnalytics, tickLocalTelemetry, hasRealSocketData } = useRaceStore();

  const setSocketRef = useRef(setSocket);
  const updateFromWebSocketRef = useRef(updateFromWebSocket);
  const setDriverAnalyticsRef = useRef(setDriverAnalytics);

  useEffect(() => {
    setSocketRef.current = setSocket;
    updateFromWebSocketRef.current = updateFromWebSocket;
    setDriverAnalyticsRef.current = setDriverAnalytics;
  }, [setSocket, updateFromWebSocket, setDriverAnalytics]);

  // 1. Local pacing telemetry loop (Activated when no real socket frames are active)
  useEffect(() => {
    let localInterval: NodeJS.Timeout | null = null;
    
    if (!hasRealSocketData) {
      localInterval = setInterval(() => {
        tickLocalTelemetry();
      }, 150);
    }
    
    return () => {
      if (localInterval) clearInterval(localInterval);
    };
  }, [hasRealSocketData, tickLocalTelemetry]);

  // 2. Main Socket Connection Manager
  useEffect(() => {
    async function fetchHRPAnalytics() {
      try {
        const res = await fetch("http://localhost:8000/analytics/hrp");
        if (res.ok) {
          const data = await res.json();
          setDriverAnalyticsRef.current(data);
        }
      } catch (err) {
        // Suppress console/terminal fetch errors to prevent breaking immersion.
        // The store handles fallback data elegantly.
      }
    }

    fetchHRPAnalytics();

    function connect() {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//localhost:8000/ws/telemetry`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocketRef.current(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          updateFromWebSocketRef.current(data);
        } catch (e) {
          // Fail silently to maintain cyberpunk F1 cockpit visuals
        }
      };

      ws.onclose = () => {
        setSocketRef.current(null);
        // Suppress alert popups. Reconnect silently in the background
        setTimeout(() => connect(), 4000);
      };

      ws.onerror = (err) => {
        ws.close();
      };

      socketRef.current = ws;
    }

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
}
