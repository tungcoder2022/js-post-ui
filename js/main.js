import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

console.log('hello world')

function main() {
  //   const response = axiosClient('/posts')
  //   console.log(response)
  const querryParams = {
    _page: 1,
    _limit: 5,
  }

  const response = postApi.getAll(querryParams)
  console.log(postApi)
}

main()
