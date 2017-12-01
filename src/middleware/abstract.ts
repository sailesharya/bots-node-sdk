import * as express from 'express';
import { CommonProvider } from '../common/provider';
import { ILogger } from '../common/definitions';
export { express }

export interface IStaticMiddlwareAbstract {
  // new (root: string, router: express.IRouter<any>, options?: any);
  extend(root: string, router: express.IRouter<any>, options?: any);
}

/**
 * interface for extended request object in OMCe
 * @see https://docs.oracle.com/en/cloud/paas/mobile-suite/develop/calling-apis-custom-code.html
 */
export interface IMobileCloudRequest extends express.Request {
  oracleMobile?: { [service: string]: { [method: string]: Function } };
}

/**
 * Embedded middleware abstraction layer.
 */
export abstract class MiddlewareAbstract {
  protected _logger: ILogger; // establish a namespaced logger instance

  /**
   * extend static method. Instantiate the middleware class.
   * @param root: string - base application dirname.
   * @param router: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  public static extend(root: string, router: express.IRouter<any>, options: any = {}): MiddlewareAbstract {
    const THIS: any = this; // bypass "Cannot create instance of abstract class error"
    return new THIS(root, router, options);
  }

  constructor(protected _root: string, router: express.IRouter<any>, options?: any) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    // init middleware
    try {
      this._init(router, options);
      this._logger.info(`Initialized`);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * abstract _init. to be implemented by implementation classes.
   * @param router: express.Router main namespace router.
   * @param options: any channel specific middleware options.
   */
  protected abstract _init(router: express.IRouter<any>, options: any): void;

}
