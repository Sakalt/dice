//

import {ReactElement} from "react";
import {AdditionalProps, ControlContainer, ControlLabel, Textarea, TextareaAddon, useTrans} from "zographia";
import {ExampleOfferTag} from "/client/component/atom/example-offer-tag";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormBasicSection = create(
  require("./edit-example-form-basic-section.scss"), "EditExampleFormBasicSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditExampleSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {register} = form;
    const offerId = form.watch("offer");

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.basic")}</h3>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.sentence")}</ControlLabel>
            <Textarea styleName="textarea" {...register("sentence")}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.translation")}</ControlLabel>
            <Textarea styleName="textarea" disabled={!!offerId} {...register("translation")}>
              {(offerId !== undefined) && (
                <TextareaAddon position="top">
                  <ExampleOfferTag offer={{id: offerId}}/>
                </TextareaAddon>
              )}
            </Textarea>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.supplement")}</ControlLabel>
            <Textarea styleName="textarea" {...register("supplement")}/>
          </ControlContainer>
        </div>
      </section>
    );

  }
);