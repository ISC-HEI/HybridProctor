
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { type Request } from "express"; 

type RequestContext = {
  req: Request
};

const als = new AsyncLocalStorage<RequestContext>();

export function runWithRequest<T>(req: Request, callback: () => Promise<T> | T): T | Promise<T> {
  return als.run({ req }, callback);
}

export function getReq(): Request | undefined {
  return als.getStore()?.req;
}

export function bindToContext<T extends (...args: any[]) => any>(fn: T): T {
    return new AsyncResource('bound-fn').bind(fn);
}
