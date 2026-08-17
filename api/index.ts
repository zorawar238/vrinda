import app from '../backend/src/server.js';

export default function handler(req: any, res: any) {
  return app(req, res);
}
