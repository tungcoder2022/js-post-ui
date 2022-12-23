import postApi from './api/postApi'
import { registerLightbox, setTextContent } from './utils'
import dayjs from 'dayjs'

function renderPostDetail(post) {
  if (!post) return

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  )

  // render hero image (image URL)
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`

    // editPageLink.textContent = 'Edit Post'
    editPageLink.innerHTML = '<i class="fas fa-edit"></i>Edit Post'
  }
}

;(async () => {
  try {
    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      PrevSelector: 'button[data-id="lightboxPrev"]',
      NextSelector: 'button[data-id="lightboxNext"]',
    })
    // get post id from URL
    // fetch post detail API
    // render post detail
    const searchParms = new URLSearchParams(window.location.search)
    const postId = searchParms.get('id')
    if (!postId) {
      console.log('Post not Found')

      return
    }

    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
