import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,TagFilterList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow, RangeFilter
} from "searchkit";

require("./index.scss");

const host = "http://itemsapi.com:5000/api/v1/items/npmjs/"
const searchkit = new SearchkitManager(host)

const NpmItem = (props)=> {
	let {result, bemBlocks} = props
	let avatar = _.first(result._source.avatars)
	console.log(avatar)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={result._source.repo} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={_.first(result._source.avatars)} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title")}>
					{result._source.name}
        </div>
      </a>
    </div>
  )
}

const NpmListItem = (props)=> {
  const {bemBlocks, result} = props

  const source:any = result._source
  const { name, short_description, tags, repo, avatars } = source;
	let avatar = _.first(avatars)

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={avatar}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={repo} target="_blank"><h2 className={bemBlocks.item("title")}>{name}</h2></a>
        <ul className={bemBlocks.item("tags")}>
          <li>Tags: <TagFilterList field="tags" values={tags} /></li>
        </ul>
        <div className={bemBlocks.item("text")}>{short_description}</div>
      </div>
    </div>
  )
}

// const MovieHitsGridItem = (props)=> {
//   const {bemBlocks, result} = props
//   let url = "http://www.imdb.com/title/" + result._source.imdbId
//   const source:any = _.extend({}, result._source, result.highlight)
//   return (
//     <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
//       <a href={url} target="_blank">
//         <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
//         <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
//         </div>
//       </a>
//     </div>
//   )
// }

export class App extends React.Component {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							queryFields={["title^5", "tags"]}
							prefixQueryFields={["title^5", "tags"]}
		        />
		      </TopBar>
		      <LayoutBody>
		        <SideBar>

							<RefinementListFilter
								title="Tags" id="tags" field="tags" size={20} operator="AND"
							/>
							<RefinementListFilter
								title="Collaborators" id="Collaborators" field="collaborators" size={10} operator="OR"
								translations={{"":"No License"}}
							/>
							<RefinementListFilter
								title="License" id="license" field="license" size={10} operator="OR"
								translations={{"":"No License"}}
							/>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
										<SortingSelector options={[
											{label:"Relevance", field:"_score", order:"desc"},
											{label:"Downloads", field:"downloads_last_month", order:"desc"}
										]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
		          <Hits mod="sk-hits-list" hitsPerPage={10} itemComponent={NpmListItem}/>
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
