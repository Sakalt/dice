//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest,
  useWordEditor
} from "/client/component/hook";
import {
  Commission
} from "/client/skeleton/commission";
import {
  EditableWord,
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const CommissionPane = create(
  require("./commission-pane.scss"), "CommissionPane",
  function ({
    commission,
    dictionary,
    onDiscardConfirm,
    onAddConfirm
  }: {
    commission: Commission,
    dictionary: EnhancedDictionary,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onAddConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [alertOpen, setAlertOpen] = useState(false);
    let addWordEditor = useWordEditor();
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let discardCommission = useCallback(async function (event: MouseEvent<HTMLButtonElement>, showPopup?: boolean): Promise<void> {
      let number = dictionary.number;
      let id = commission.id;
      let response = await request("discardCommission", {number, id});
      if (response.status === 200) {
        if (showPopup === undefined || showPopup) {
          addInformationPopup("commissionDiscarded");
        }
        await onDiscardConfirm?.(event);
      }
    }, [dictionary.number, commission, request, onDiscardConfirm, addInformationPopup]);

    let handleEditConfirm = useCallback(async function (word: EditableWord, event: MouseEvent<HTMLButtonElement>): Promise<void> {
      await discardCommission(event, false);
      await onAddConfirm?.(word, event);
    }, [onAddConfirm, discardCommission]);

    let openEditor = useCallback(function (): void {
      addWordEditor({
        dictionary,
        word: null,
        defaultEquivalentName: commission.name,
        onEditConfirm: handleEditConfirm
      });
    }, [dictionary, commission, handleEditConfirm, addWordEditor]);

    let name = commission.name;
    let comment = commission.comment;
    let commentNode = (comment !== undefined && comment !== "") && (
      <div styleName="comment">
        {comment}
      </div>
    );
    let node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="name">{name}</div>
            {commentNode}
          </div>
          <div styleName="button">
            <Button label={trans("commissionPane.discard")} iconName="trash-alt" variant="simple" onClick={() => setAlertOpen(true)}/>
            <Button label={trans("commissionPane.add")} iconName="plus" variant="simple" onClick={openEditor}/>
          </div>
        </WhitePane>
        <Alert
          text={trans("commissionPane.alert")}
          confirmLabel={trans("commissionPane.discard")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardCommission}
        />
      </Fragment>
    );
    return node;

  }
);


export default CommissionPane;