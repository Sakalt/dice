//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import AkrantiainExecutor from "../compound/akrantiain-executor";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./change-dictionary-source-form.scss"))
export default class ChangeDictionarySourceForm extends Component<Props, State> {

  public state: State = {
    source: undefined as any,
    executorOpen: false
  };

  public constructor(props: any) {
    super(props);
    let source = this.props.currentSource ?? "";
    this.state.source = source;
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let propertyName = this.props.languageName + "Source";
    let settings = {[propertyName]: this.state.source};
    let response = await this.requestPost("changeDictionarySettings", {number, settings});
    if (response.status === 200) {
      this.props.store!.addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let executorNode = (() => {
      if (this.props.languageName === "akrantiain") {
        let executorNode = (
          <AkrantiainExecutor defaultSource={this.state.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
        );
        return executorNode;
      }
    })();
    let node = (
      <Fragment>
        <form styleName="root">
          <TextArea
            label={this.trans(`changeDictionarySourceForm.${this.props.languageName}`)}
            value={this.state.source}
            font="monospace"
            mode={this.props.languageName}
            nowrap={true}
            onSet={(source) => this.setState({source})}
          />
          <div styleName="button">
            <Button label={this.trans("changeDictionarySourceForm.try")} style="link" onClick={() => this.setState({executorOpen: true})}/>
            <Button label={this.trans("changeDictionarySourceForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
          </div>
        </form>
        {executorNode}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentSource: string | undefined,
  languageName: "akrantiain" | "zatlin",
  onSubmit?: () => void
};
type State = {
  source: string,
  executorOpen: boolean
};