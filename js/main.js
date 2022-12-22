import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

async function main() {
  try {
    const querryParams = {
      _page: 1,
      _limit: 5,
    }

    const response = await postApi.getAll(querryParams)
    console.log(postApi)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }

  await postApi.updateFormData({
    id: 'lea2aa9l7x3a5tg',
    title: 'Adipisci a enim 444',
  })
}

main()
