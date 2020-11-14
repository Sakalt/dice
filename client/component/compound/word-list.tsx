//

import partial from "lodash-es/partial";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Component from "/client/component/component";
import WordPane from "/client/component/compound/word-pane";
import {
  style
} from "/client/component/decorator";
import {
  EditableWord,
  EnhancedDictionary,
  Word
} from "/client/skeleton/dictionary";


@style(require("./word-list.scss"))
export default class WordList extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showEditLink: false,
    showButton: false
  };

  public render(): ReactNode {
    let displayedWords = this.props.words.slice(this.props.offset, this.props.offset + this.props.size);
    let wordPanes = displayedWords.map((word) => {
      let wordPane = (
        <WordPane
          dictionary={this.props.dictionary}
          word={word}
          key={word.id}
          style={this.props.style}
          showEditLink={this.props.showEditLink}
          showButton={this.props.showButton}
          onSubmit={this.props.onSubmit && partial(this.props.onSubmit, word)}
          onEditConfirm={this.props.onEditConfirm && partial(this.props.onEditConfirm, word)}
          onRemoveConfirm={this.props.onRemoveConfirm && partial(this.props.onRemoveConfirm, word)}
        />
      );
      return wordPane;
    });
    let node = (
      <div styleName="root">
        {wordPanes}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary,
  words: Array<Word>,
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean,
  size: number,
  offset: number,
  onSubmit?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onRemoveConfirm?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void
};
type DefaultProps = {
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean
};
type State = {
};