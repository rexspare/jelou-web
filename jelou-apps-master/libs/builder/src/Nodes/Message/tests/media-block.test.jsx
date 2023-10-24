import { cleanup, fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockReactFlow } from '@mocks/reactflow'

import { UploadFile } from '@common/Headless/Tabs/Component/UploadFile'
import MediaBlockModal from '../Blocks/Image/MediaBlock.modal'

const mediaProps = (type) => {
  return {
    type,
    isOpen: true,
    closeModal: vi.fn(),
    saveUrlMedia: vi.fn(() => () => Promise.resolve())
  }
}

const modalProps = {
  isOpen: true,
  type: 'image',
  closeModal: vi.fn(),
  saveUrlMedia: vi.fn(() => () => Promise.resolve())
}

describe('MediaBlockModal', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })

  it('should render media block modal', async () => {
    const { getByTestId } = render(<MediaBlockModal {...modalProps} />)
    const title = getByTestId('body-text')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Arrastra tu documento aquí para empezar a cargar')
  })

  it('should change to URL tab', async () => {
    const { getByText } = render(<MediaBlockModal {...modalProps} />)
    const urlTab = getByText('Desde URL')
    expect(urlTab).toBeTruthy()
    fireEvent.click(urlTab)
    const urlInput = getByText('Ingresa una URL')
    expect(urlInput).toBeTruthy()
  })
})

describe('Image block', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })

  it('should render image title', () => {
    const { getByTestId } = render(<MediaBlockModal {...mediaProps('image')} />)
    const title = getByTestId('modal-title')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Imagen')
  })

  it('should render image formats', () => {
    const { getByText } = render(<UploadFile {...mediaProps('image')} />)
    const formats = getByText(/Formatos: jpeg, jpg, png/i)
    expect(formats).toBeTruthy()
  })
})

describe('Video block', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })
  it('should render video title', () => {
    const { getByTestId } = render(<MediaBlockModal {...mediaProps('video')} />)
    const title = getByTestId('modal-title')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Video')
  })

  it('should render video formats', () => {
    const { getByText } = render(<UploadFile {...mediaProps('video')} />)
    const formats = getByText(/Formatos: mp4, 3gp, quicktime/i)
    expect(formats).toBeTruthy()
  })
})

describe('Sticker block', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })
  it('should render sticker title', () => {
    const { getByTestId } = render(<MediaBlockModal {...mediaProps('sticker')} />)
    const title = getByTestId('modal-title')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Sticker')
  })

  it('should render sticker formats', () => {
    const { getByText } = render(<UploadFile {...mediaProps('sticker')} />)
    const formats = getByText(/Formatos: webp/i)
    expect(formats).toBeTruthy()
  })
})

describe('URL video tab', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })

  it('should appear error message when URL is not valid', async () => {
    const { getByText, getByPlaceholderText } = render(<MediaBlockModal {...modalProps} />)
    const urlTab = getByText('Desde URL')
    expect(urlTab).toBeTruthy()
    fireEvent.click(urlTab)

    const urlInput = getByPlaceholderText('http://')
    expect(urlInput).toBeTruthy()
    fireEvent.change(urlInput, { target: { value: 'NOT VALID URL' } })

    const saveBtn = getByText('Guardar')
    expect(saveBtn).toBeTruthy()
    fireEvent.click(saveBtn)

    expect(modalProps.saveUrlMedia).not.toHaveBeenCalled()
  })

  it('should save URL when URL is valid', async () => {
    const { getByText, getByPlaceholderText } = render(<MediaBlockModal {...modalProps} />)
    const urlTab = getByText('Desde URL')
    expect(urlTab).toBeTruthy()
    fireEvent.click(urlTab)

    const urlInput = getByPlaceholderText('http://')
    expect(urlInput).toBeTruthy()
    fireEvent.change(urlInput, { target: { value: 'https://www.youtube.com/watch?v=QH2-TGUlwu4' } })

    const saveBtn = getByText('Guardar')
    expect(saveBtn).toBeTruthy()
    fireEvent.click(saveBtn)

    expect(modalProps.saveUrlMedia).toHaveBeenCalled()
  })
})

describe('Audio block', () => {
  beforeEach(() => {
    cleanup()
    mockReactFlow()
  })

  it('should render audio title', () => {
    const { getByTestId } = render(<MediaBlockModal {...mediaProps('audio')} />)
    const title = getByTestId('modal-title')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Audio')
  })

  it('should render audio formats', () => {
    const { getByText } = render(<UploadFile {...mediaProps('audio')} />)
    const formats = getByText(/Formatos: .mp3/i)
    expect(formats).toBeTruthy()
  })
})
