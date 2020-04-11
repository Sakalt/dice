//

import * as sendgrid from "@sendgrid/mail";
import * as parser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import * as mongoose from "mongoose";
import {
  Schema
} from "mongoose";
import * as multer from "multer";
import {
  DebugController
} from "/server/controller/debug";
import {
  DictionaryController
} from "/server/controller/dictionary";
import {
  NotificationController
} from "/server/controller/notification";
import {
  UserController
} from "/server/controller/user";


export const PORT = process.env["PORT"] || 8050;
export const MONGO_URI = process.env["MONGO_URI"] || "mongodb://localhost:27017/zpdic";
export const COOKIE_SECRET = process.env["COOKIE_SECRET"] || "cookie-zpdic";
export const SESSION_SECRET = process.env["SESSION_SECRET"] || "session-zpdic";
export const JWT_SECRET = process.env["JWT_SECRET"] || "jwt-secret";
export const SENDGRID_KEY = process.env["SENDGRID_KEY"] || "dummy";


class Main {

  private application: Express;

  public constructor() {
    this.application = express();
  }

  public main(): void {
    this.setupBodyParsers();
    this.setupCookie();
    this.setupMulter();
    this.setupRenderer();
    this.setupMongo();
    this.setupSendgrid();
    this.setupRouters();
    this.setupErrorHandler();
    this.setupFallback();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    let urlencodedParser = parser.urlencoded({extended: false});
    let jsonParser = parser.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupCookie(): void {
    let middleware = cookieParser(COOKIE_SECRET);
    this.application.use(middleware);
  }

  // ファイルをアップロードする処理を行う Multer の設定をします。
  // アップロードされたファイルは upload フォルダ内に保存するようにしています。
  private setupMulter(): void {
    let middleware = multer({dest: "./upload/"}).single("file");
    this.application.use(middleware);
  }

  // HTML を出力するテンプレートエンジンの設定をします。
  // フロントエンドには React を用いるのでこの設定は必要ありませんが、デバッグで利用するかもしれないので設定しておきます。
  // とりあえず EJS を使う設定になっています。
  private setupRenderer(): void {
    this.application.set("views", process.cwd() + "/server/view");
    this.application.set("view engine", "ejs");
  }

  // MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
  // typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。
  private setupMongo(): void {
    let check = function (value: string): boolean {
      return value !== null;
    };
    let SchemaString = Schema.Types.String as any;
    SchemaString.checkRequired(check);
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  }

  private setupSendgrid(): void {
    sendgrid.setApiKey(SENDGRID_KEY);
  }

  // ルーターの設定を行います。
  // このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。
  private setupRouters(): void {
    DebugController.use(this.application);
    DictionaryController.use(this.application);
    NotificationController.use(this.application);
    UserController.use(this.application);
  }

  private setupErrorHandler(): void {
    let handler = function (error: any, request: Request, response: Response, next: NextFunction): void {
      console.error(error.stack);
      response.status(500).end();
    };
    this.application.use(handler);
  }

  // ルート以外にアクセスしたときのフォールバックの設定をします。
  private setupFallback(): void {
    let fallback = require("express-history-api-fallback");
    let handler = function (request: Request, response: Response, next: NextFunction): void {
      let fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      console.error("Not found: " + fullUrl);
      response.status(404).end();
    };
    this.application.use("/api*", handler);
    this.application.use(express.static("dist"));
    this.application.use(fallback("/dist/index.html", {root: "."}));
  }

  private listen(): void {
    this.application.listen(+PORT, () => {
      console.log("\u001b[33m[Express]\u001b[0m Listening on port " + PORT);
    });
  }

}


let main = new Main();
main.main();