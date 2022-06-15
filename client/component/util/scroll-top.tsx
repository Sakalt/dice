//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useEffect
} from "react";
import {
  create
} from "/client/component/create";
import {
  useLocation
} from "/client/component/hook";


const ScrollTop = create(
  null, "ScrollTop",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.key]);

    const node = (
      <Fragment>
        {children}
      </Fragment>
    );
    return node;

  }
);


export default ScrollTop;