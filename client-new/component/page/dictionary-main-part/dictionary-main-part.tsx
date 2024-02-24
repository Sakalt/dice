/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, GoogleAdsense} from "zographia";
import {Markdown} from "/client-new/component/atom/markdown";
import {SearchWordForm} from "/client-new/component/compound/search-word-form";
import {SuggestionCard} from "/client-new/component/compound/suggestion-card";
import {WordList} from "/client-new/component/compound/word-list";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Search, useSearchState} from "/client-new/hook/search";
import {WordParameter} from "/client-new/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client-new/util/misc";


export const DictionaryMainPart = create(
  require("./dictionary-main-part.scss"), "DictionaryMainPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = useDictionary();

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "edit"});

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [hitResult] = useSuspenseResponse("searchWord", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 40)}, {keepPreviousData: true});
    const [hitWords, hitSize] = hitResult.words;
    const hitSuggestions = hitResult.suggestions;

    const handleParameterSet = useCallback(function (parameter: SetStateAction<WordParameter>): void {
      setQuery((prevQuery) => {
        const nextParameter = resolveStateAction(parameter, prevQuery.parameter);
        return {parameter: nextParameter, page: 0, showExplanation: false};
      });
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    return (
      <div styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="sticky">
            <SearchWordForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
          </div>
        </div>
        <div styleName="right">
          <div styleName="adsense">
            <GoogleAdsense clientId="9429549748934508" slotId="2898231395"/>
          </div>
          {(debouncedQuery.showExplanation && !!dictionary.explanation) ? (
            <Markdown mode="normal">
              {dictionary.explanation}
            </Markdown>
          ) : (
            <div styleName="main">
              <SuggestionCard dictionary={dictionary} suggestions={hitSuggestions}/>
              <WordList dictionary={dictionary} words={hitWords} canEdit={canEdit} showEmpty={hitSuggestions.length <= 0} pageSpec={{size: 40, hitSize, page: query.page, onPageSet: handlePageSet}}/>
            </div>
          )}
        </div>
      </div>
    );

  }
);


function serializeQuery(query: WordQuery): Search {
  const search = WordParameter.serialize(query.parameter);
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): WordQuery {
  const parameter = WordParameter.deserialize(search);
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  const showExplanation = search.size <= 0;
  return {parameter, page, showExplanation};
}

export type WordQuery = {parameter: WordParameter, page: number, showExplanation: boolean};
