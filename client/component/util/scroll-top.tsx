//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  RouteProps
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(null, {withRouter: true, inject: false, injectIntl: false, observer: false})
export default class ScrollTop extends Component<RouteProps, {}> {

  public componentDidUpdate(props: RouteProps): void {
    if (this.props.location !== props.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): ReactNode {
    return this.props.children;
  }

}