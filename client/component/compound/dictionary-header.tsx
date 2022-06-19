//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  Suspense,
  lazy,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Dropdown from "/client/component/atom/dropdown";
import Icon from "/client/component/atom/icon";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useExampleEditor,
  useHotkey,
  useIntl,
  usePath,
  useRequest,
  useWordEditor
} from "/client/component/hook";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const CommissionEditor = lazy(() => import("/client/component/compound/commission-editor"));


const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    showAddLink = false,
    showAddCommissionLink = true,
    showExampleLink = true,
    showSettingLink = false,
    showDownloadLink = true
  }: {
    dictionary: EnhancedDictionary,
    showAddLink?: boolean,
    showAddCommissionLink?: boolean,
    showExampleLink?: boolean,
    showSettingLink?: boolean,
    showDownloadLink?: boolean
  }): ReactElement {

    const addWordEditor = useWordEditor();
    const addExampleEditor = useExampleEditor();
    const [, {trans}] = useIntl();
    const {pushPath} = usePath();
    const {request} = useRequest();

    const [commissionEditorOpen, setCommissionEditorOpen] = useState(false);

    const openEditor = useCallback(function (type: "word" | "example"): void {
      if (dictionary !== null) {
        if (type === "word") {
          addWordEditor({dictionary, word: null});
        } else {
          addExampleEditor({dictionary, example: null});
        }
      }
    }, [dictionary, addWordEditor, addExampleEditor]);

    const jumpExamplePage = useCallback(function (): void {
      if (dictionary) {
        const path = "/example/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    const jumpSettingPage = useCallback(function (): void {
      if (dictionary) {
        const path = "/dashboard/dictionary/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    const downloadDictionary = useCallback(async function (): Promise<void> {
      if (dictionary) {
        const number = dictionary.number;
        const response = await request("downloadDictionary", {number}, {responseType: "blob"});
        if (response.status === 200 && !("error" in response.data)) {
          const data = response.data;
          const disposition = response.headers["content-disposition"];
          const match = disposition.match(/filename="(.+)"/);
          const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
          const fileName = (() => {
            if (encodedMatch !== null) {
              return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
            } else if (match !== null) {
              return match[1];
            } else {
              return "dictionary.json";
            }
          })();
          downloadFile(data, fileName);
        }
      }
    }, [dictionary, request]);

    useHotkey("jumpDictionaryPage", () => {
      pushPath("/dictionary/" + dictionary.number);
    }, [dictionary?.number]);
    useHotkey("jumpDictionarySettingPage", () => {
      pushPath("/dashboard/dictionary/" + dictionary?.number);
    }, [dictionary?.number]);
    useHotkey("jumpExamplePage", () => {
      pushPath("/example/" + dictionary.number);
    }, [dictionary?.number]);
    useHotkey("addWord", () => {
      openEditor("word");
    }, [openEditor], showAddLink);
    useHotkey("addExample", () => {
      openEditor("example");
    }, [openEditor], showAddLink);
    useHotkey("addCommission", () => {
      setCommissionEditorOpen(true);
    }, [], showAddCommissionLink);

    const addDropdownSpecs = [
      {value: "word", node: <DictionaryHeaderAddDropdownNode type="word"/>},
      {value: "example", node: <DictionaryHeaderAddDropdownNode type="example"/>}
    ] as const;
    const node = (
      <div styleName="root">
        <div styleName="left">
          {(showExampleLink) && (
            <Button label={trans("dictionaryHeader.example")} iconName="custom-example" variant="simple" hideLabel={true} onClick={jumpExamplePage}/>
          )}
          {(showAddCommissionLink) && (
            <Button label={trans("dictionaryHeader.addCommission")} iconName="list-check" variant="simple" hideLabel={true} onClick={() => setCommissionEditorOpen(true)}/>
          )}
          {(showDownloadLink) && (
            <Button label={trans("dictionaryHeader.download")} iconName="download" variant="simple" hideLabel={true} onClick={downloadDictionary}/>
          )}
        </div>
        <div styleName="right">
          {(showAddLink) && (
            <Dropdown specs={addDropdownSpecs} showArrow={true} fillWidth={false} restrictHeight={false} autoMode="click" onSet={openEditor}>
              <Button label={trans("dictionaryHeader.add")} iconName="plus" variant="simple" hideLabel={true}/>
            </Dropdown>
          )}
          {(showSettingLink) && (
            <Button label={trans("dictionaryHeader.setting")} iconName="cog" variant="simple" hideLabel={true} onClick={jumpSettingPage}/>
          )}
        </div>
        <DictionaryHeaderOverlays {...{dictionary, commissionEditorOpen, setCommissionEditorOpen}}/>
      </div>
    );
    return node;

  }
);


const DictionaryHeaderAddDropdownNode = create(
  require("./dictionary-header.scss"),
  function ({
    type,
    styles
  }: {
    type: "word" | "example",
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const node = (
      <div>
        <Icon className={styles!["icon"]} name={(type === "word") ? "custom-word" : "custom-example"}/>
        {trans(`dictionaryHeader.add${type.charAt(0).toUpperCase() + type.slice(1)}`)}
      </div>
    );
    return node;

  }
);


const DictionaryHeaderOverlays = create(
  require("./dictionary-header.scss"),
  function ({
    dictionary,
    commissionEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary,
    commissionEditorOpen: boolean,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement | null {

    const node = (commissionEditorOpen) && (
      <Suspense fallback="">
        <CommissionEditor dictionary={dictionary} open={commissionEditorOpen} onClose={() => setCommissionEditorOpen(false)}/>
      </Suspense>
    );
    return node || null;

  }
);


export default DictionaryHeader;