import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
export class Server {
  private _app: Application;
  private _port: number;
  constructor(port: number) {
    this._app = express();
    this._port = port;

    this.middlewares();
    this.routes();
    this.errors();
  }
  private routes(): void {
    this._app.use("/", () => {
      console.log("Root default");
    });
  }
  private errors(): void {
    this._app.use((req: Request, res: Response, next: NextFunction) => {
      const err = new Error(`Not Fount - ${req.originalUrl}`);
      res.status(404);
      next(err);
    });
    this._app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err.stack);
        res.status(err.status || 500).json({
          status: err.status,
          message: err.message,
          stack: err.stack,
        });
      }
    );
  }
  private middlewares() {
    this._app.use(cors({ credentials: true }));
    this._app.use(morgan("dev"));
    this._app.use(express.json({ limit: "50mb" }));
    this._app.use(
      express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
      })
    );
  }
  public start(callback: () => void): void {
    this._app.listen(this._port, callback);
  }
  public static init(port: number): Server {
    return new Server(port);
  }
}
