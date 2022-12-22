import postApi from './api/postApi'
import { initPagination, initSearch, renderPagination, renderPostList } from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

// main
;(async () => {
  try {
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)

    const querryParams = url.searchParams
    initPagination({
      elementId: 'pagination',
      defaultParams: querryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementId: 'searchInput',
      defaultParams: querryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postApi.getAll(querryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }
})()
