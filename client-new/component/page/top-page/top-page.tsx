//

import {faRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Suspense} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {NotificationList} from "/client-new/component/compound/notification-list";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {Hero} from "./hero";
import {OverallAggregationPane} from "./overall-aggregation-pane";


export const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("topPage");

    return (
      <Page styleName="root" insertPadding={false} {...rest}>
        <div styleName="top">
          <Hero/>
          <OverallAggregationPane/>
        </div>
        <div styleName="main">
          <Suspense>
            <MainContainer>
              <section>
                <h2 styleName="heading">{trans("heading.notification")}</h2>
                <NotificationList size={1} showPagination={false}/>
                <div styleName="link">
                  <Link href="/notification" scheme="secondary" variant="underline">
                    <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
                    {trans("moreNotifications")}
                  </Link>
                </div>
              </section>
              <hr styleName="divider"/>
            </MainContainer>
          </Suspense>
        </div>
      </Page>
    );

  }
);
