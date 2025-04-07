import { Request } from "express";

function decodeHeader(req: Request, headerName: string) {
  const val = req.headers[headerName];
  if (val != undefined) {
    return val.toString();
  }
}

export { decodeHeader };
