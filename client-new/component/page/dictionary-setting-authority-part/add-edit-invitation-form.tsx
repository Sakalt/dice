//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {UserList} from "/client-new/component/compound/user-list";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {Dictionary} from "/client-new/skeleton";


export const AddEditInvitationForm = create(
  require("./add-edit-invitation-form.scss"), "AddEditInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingEditingPart");

    const number = dictionary.number;
    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number, authority: "editOnly"});

    return (
      <form styleName="root-table" {...rest}>
        <div>
          <Button type="submit" variant="light">
            <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
            {trans("button.addEditInvitation")}
          </Button>
        </div>
        <UserList users={authorizedUsers} pageSpec={{size: 20}}/>
      </form>
    );

  }
);