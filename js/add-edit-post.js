import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  // console.log('submit form parent', formValues)
  try {
    // check add/edit mode
    // S1: based on search params (check id)
    // S2: check id in formValues
    // call API

    // let savePost = null
    // if (formValues.id) {
    //   savePost = await postApi.update(formValues)
    // } else {
    //   savePost = await postApi.add(formValues)
    // }

    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show success message
    toast.success('Save post successfully')

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`post-detail.html?id=${savePost.id}`)
    }, 1000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
