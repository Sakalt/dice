//

import {ReactElement, Ref} from "react";
import {AdditionalProps, aria} from "zographia";
import {createWithRef} from "/client-new/component/create";
import LogotypeSvg from "/client-new/public/logo.svg";
import SymbolSvg from "/client-new/public/symbol.svg";


export const Logo = createWithRef(
  require("./logo.scss"), "Logo",
  function ({
    ...rest
  }: {
    className?: string,
    ref?: Ref<HTMLDivElement>
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" role="img" {...aria({label: "ZpDIC Online"})} {...rest}>
        <SymbolSvg styleName="symbol"/>
        <LogotypeSvg styleName="logo"/>
      </div>
    );

  }
);
