//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useState
} from "react";
import Drawer from "/client/component/atom/drawer";
import HotkeyHelp from "/client/component/compound/hotkey-help";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  useExampleEditorProps,
  useHotkey,
  useIntl,
  usePath,
  useWordEditorProps
} from "/client/component/hook";


const InnerRoot = create(
  null, "InnerRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    let [hotkeyHelpOpen, setHotkeyHelpOpen] = useState(false);
    let [wordEditorProps, wordEditorOpen, setWordEditorOpen] = useWordEditorProps();
    let [exampleEditorProps, exampleEditorOpen, setExampleEditorOpen] = useExampleEditorProps();
    let [, {trans}] = useIntl();
    let {pushPath} = usePath();

    useHotkey("jumpDashboardPage", () => {
      pushPath("/dashboard");
    }, []);
    useHotkey("jumpDictionaryListPage", () => {
      pushPath("/list");
    }, []);
    useHotkey("jumpNotificationPage", () => {
      pushPath("/notification");
    }, []);
    useHotkey("jumpDocumentPage", () => {
      pushPath("/document");
    }, []);
    useHotkey("jumpContactPage", () => {
      pushPath("/contact");
    }, []);
    useHotkey("toggleWordEditor", () => {
      setWordEditorOpen((wordEditorOpen) => !wordEditorOpen);
    }, []);
    useHotkey("showHotkeyHelp", () => {
      setHotkeyHelpOpen(true);
    }, []);
    useHotkey("unfocus", () => {
      let activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, []);

    let wordEditorNodes = wordEditorProps.map((props) => {
      let wordEditorNode = <WordEditor key={props.id} {...props}/>;
      return wordEditorNode;
    });
    let exampleEditorNodes = exampleEditorProps.map((props) => {
      let exampleEditorNode = <></>;
      return exampleEditorNode;
    });
    let node = (
      <Fragment>
        {children}
        <Drawer
          title={trans("wordEditor.title")}
          iconName="custom-word"
          badgeValue={(wordEditorNodes.length > 0) ? wordEditorNodes.length : undefined}
          position="top"
          open={wordEditorOpen}
          onOpen={() => setWordEditorOpen(true)}
          onClose={() => setWordEditorOpen(false)}
          outsideClosable={true}
        >
          {wordEditorNodes}
        </Drawer>
        <Drawer
          title={trans("exampleEditor.title")}
          iconName="custom-example"
          badgeValue={(exampleEditorNodes.length > 0) ? exampleEditorNodes.length : undefined}
          position="bottom"
          open={exampleEditorOpen}
          onOpen={() => setExampleEditorOpen(true)}
          onClose={() => setExampleEditorOpen(false)}
          outsideClosable={true}
        >
          {exampleEditorNodes}
        </Drawer>
        <HotkeyHelp open={hotkeyHelpOpen} onClose={() => setHotkeyHelpOpen(false)}/>
      </Fragment>
    );
    return node;

  }
);


export default InnerRoot;