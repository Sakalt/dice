//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  intl,
  route
} from "/client/component/decorator";
import {
  createValidate
} from "/client/util/misc";
import {
  PopupUtil
} from "/client/util/popup";
import {
  EMAIL_REGEXP
} from "/server/model/validation";


@route @inject @intl
@applyStyle(require("./change-user-email-form.scss"))
export class ChangeUserEmailForm extends StoreComponent<Props, State> {

  public constructor(props: any) {
    super(props);
    let email = this.props.currentEmail;
    this.state = {email};
  }

  private async handleClick(): Promise<void> {
    let email = this.state.email;
    let response = await this.requestPost("changeUserEmail", {email});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("emailChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let validate = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidEmail"));
    let node = (
      <form styleName="root">
        <Input label={this.trans("changeUserEmailForm.email")} value={this.state.email} validate={validate} usesTooltip={true} onSet={(email) => this.setState({email})}/>
        <Button label={this.trans("changeUserEmailForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  currentEmail: string,
  onSubmit?: () => void
};
type State = {
  email: string
};