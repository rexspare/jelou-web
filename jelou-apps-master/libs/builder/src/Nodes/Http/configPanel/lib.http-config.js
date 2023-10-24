import ow from 'ow'

export const validateHttpForm = data => {
  try {
    ow(data.key, ow.string.nonEmpty.minLength(2).message('The key is required'))
    ow(data.value, ow.string.nonEmpty.minLength(2).message('The value is required'))

    return Promise.resolve()
  } catch (error) {
    // console.error({ error })
    return Promise.reject(error)
  }
}
