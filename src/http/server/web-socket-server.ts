import {logger} from '#mini-web';
import {Server} from 'node:https';
import {WebSocket, WebSocketServer} from 'ws';

export function createWebSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({server});

  // const clients = new Map();

  wss.on('connection', (ws) => {
    // const clientId = crypto.randomUUID();
    logger.info(`New client connected`);

    ws.on('message', (message: Buffer) => {
      wss.clients.forEach((peer) => {
        if (peer !== ws && peer.readyState === WebSocket.OPEN) {
          peer.send(message.toString());
        }
      });
    });

    ws.on('error', (error) => logger.error(String(error)));
    ws.on('close', (code, reason) => {
      if (reason.toString()) {
        logger.info(`Client disconnected. Code ${code}. Reason ${reason.toString()}`);
      } else {
        logger.info(`Client disconnected`);
      }
    });
  });

  return wss;
}
