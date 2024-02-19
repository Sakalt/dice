//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client-new/hook/alert";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Commission, Dictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


export function useDiscardCommission(dictionary: Dictionary, commission: Commission): () => void {
  const {trans} = useTrans("commissionList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const id = commission.id;
    const response = await request("discardCommission", {number, id});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchCommissions", (query) => query.number === dictionary.number);
      dispatchSuccessToast("discardCommission");
    });
  }, [dictionary.number, commission.id, request, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.discard.message"),
      confirmLabel: trans("dialog.discard.confirm"),
      confirmIcon: faTrashAlt,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}