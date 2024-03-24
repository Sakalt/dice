//

import {before, post, restController} from "/server/controller/rest/decorator";
import {InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkMe} from "/server/controller/rest/internal/middleware";
import {NotificationCreator} from "/server/creator";
import {NotificationModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class NotificationRestController extends InternalRestController {

  @post("/addNotification")
  @before(checkMe("admin"))
  public async [Symbol()](request: Request<"addNotification">, response: Response<"addNotification">): Promise<void> {
    const {type, title, text} = request.body;
    const notification = await NotificationModel.add(type, title, text);
    const body = NotificationCreator.create(notification);
    InternalRestController.respond(response, body);
  }

  @post("/fetchNotifications")
  public async [Symbol()](request: Request<"fetchNotifications">, response: Response<"fetchNotifications">): Promise<void> {
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await NotificationModel.fetch(range);
    const body = mapWithSize(hitResult, NotificationCreator.create);
    InternalRestController.respond(response, body);
  }

}