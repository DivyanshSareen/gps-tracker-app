// npm install reconnecting-websocket
import ReconnectingWebSocket from 'reconnecting-websocket';
import { LocationData } from '@/types/tracking';

const WS_ENDPOINT =
  'wss://telematics-provider-backend.onrender.com/ws/vehicle-location';

export class ApiService {
  private static rws: ReconnectingWebSocket | null = null;

  private static getConnection(): ReconnectingWebSocket {
    if (!this.rws) {
      this.rws = new ReconnectingWebSocket(WS_ENDPOINT, [], {
        connectionTimeout: 5000,
        maxRetries: 3,
        reconnectionDelayGrowFactor: 1.3,
        minReconnectionDelay: 1000,
        maxReconnectionDelay: 4000,
        debug: false,
      });

      this.rws.addEventListener('open', () => {
        console.log('WebSocket connected successfully');
      });

      this.rws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });

      this.rws.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
      });
    }

    return this.rws;
  }

  static async sendLocationData(locationData: LocationData): Promise<boolean> {
    try {
      const ws = this.getConnection();

      // Wait for connection to be ready
      if (ws.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Connection timeout')),
            5000
          );

          const onOpen = () => {
            clearTimeout(timeout);
            ws.removeEventListener('open', onOpen);
            ws.removeEventListener('error', onError);
            resolve(void 0);
          };

          const onError = () => {
            clearTimeout(timeout);
            ws.removeEventListener('open', onOpen);
            ws.removeEventListener('error', onError);
            reject(new Error('Connection failed'));
          };

          ws.addEventListener('open', onOpen);
          ws.addEventListener('error', onError);
        });
      }

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(locationData));
        console.log('Location data sent successfully:', locationData);
        return true;
      } else {
        throw new Error('WebSocket is not open');
      }
    } catch (error) {
      console.error('Failed to send location data:', error);
      return false;
    }
  }

  static closeConnection(): void {
    if (this.rws) {
      this.rws.close();
      this.rws = null;
    }
  }

  static getConnectionStatus(): string {
    if (!this.rws) return 'disconnected';

    switch (this.rws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}
