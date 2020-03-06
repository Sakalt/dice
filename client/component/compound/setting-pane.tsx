//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Badge
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./setting-pane.scss"))
class SettingPaneBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let badgeNode;
    if (this.props.badgeValue) {
      badgeNode = <Badge value={this.props.badgeValue}/>;
    }
    let descriptionNode;
    if (this.props.description) {
      descriptionNode = (
        <p styleName="description">
          {this.props.description}
        </p>
      );
    }
    let node = (
      <div styleName="root">
        <div styleName="description-wrapper">
          <div styleName="label">
            {this.props.label}
            {badgeNode}
          </div>
          {descriptionNode}
        </div>
        <div styleName="content">
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  label: string,
  badgeValue?: string,
  description?: string
};
type State = {
};

export let SettingPane = withRouter(SettingPaneBase);