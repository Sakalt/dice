//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import {
  Component
} from "/client/component/component";
import {
  PaneList,
  UserPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";
import {
  User
} from "/server/skeleton/user";


@applyStyle(require("./invitation-list.scss"))
export class UserList extends Component<Props, State> {

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (user: User): ReactNode {
      return <UserPane user={user} dictionary={outerThis.props.dictionary} key={user.id} onSubmit={outerThis.props.onSubmit}/>;
    };
    let node = (
      <PaneList items={this.props.users} size={this.props.size} column={2} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  users: Array<User> | null,
  dictionary?: Dictionary,
  size: number,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};