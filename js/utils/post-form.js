import { fromPairs } from 'lodash.debounce'
import { setBackgroundImage, setFielValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValues(form, formValues) {
  setFielValue(form, '[name="title"]', formValues?.title)
  setFielValue(form, '[name="author"]', formValues?.author)
  setFielValue(form, '[name="description"]', formValues?.description)

  setFielValue(form, '[name="imageUrl"]', formValues?.imageUrl) // hidden feild
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const formValues = {}

  // S1: query each input and add to value object
  //   ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`)
  //     if (field) formValues[name] = field.value
  //   })

  // S2: using form data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path
        // ignore if the field is already logged
        if (errorLog[name]) continue

        // set field error and mark as logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }
  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function showLoading(form) {
  const button = document.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving ...'
  }
}
function hideLoading(form) {
  const button = document.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  setFormValues(form, defaultValues)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // prevent other submission
    if (submitting) return

    showLoading(form)
    submitting = true

    // get form values
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id

    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
    const isValid = await validatePostForm(form, formValues)
    if (!isValid) return

    await onSubmit?.(formValues)

    hideLoading(form)

    submitting = false
  })
}
