import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactFlowProvider } from 'reactflow'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DBNodeToReactFlowNode } from '@/helpers/utils'
import { nodesMock } from '@mocks/data'
import { QuickRepliesPanel } from '../configPanel/QuickReplies'

const user = userEvent.setup()
const nodeMock = DBNodeToReactFlowNode(nodesMock.data[1])
const MESSAGE_ID_TEST = '1-test'

vi.mock('@/Stores', async () => {
  const actual = await vi.importActual('@/Stores')

  return {
    ...actual,
    useWorkflowStore: vi.fn().mockReturnValue({
      id: '1'
    })
  }
})

describe('Message configuration', () => {
  beforeEach(cleanup)

  it('should write text and option', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <ReactFlowProvider>
        <QuickRepliesPanel dataNode={nodeMock} messageId={MESSAGE_ID_TEST} quickReplies={[]} text='' />
      </ReactFlowProvider>
    )

    const inputText = getByPlaceholderText('Haz clic para escribir')
    expect(inputText).toBeTruthy()

    expect(inputText.value).toBe('')
    await user.type(inputText, 'Hola mundo')
    expect(inputText.value).toBe('Hola mundo')

    const btnAddOption = getByText('+ Agregar nuevo botón')
    expect(btnAddOption).toBeTruthy()

    await user.click(btnAddOption)
    expect(getAllByText('optionItem')).toHaveLength(1)

    const inputOption = getByPlaceholderText('Escribe tu opción')
    expect(inputOption).toBeTruthy()

    expect(inputOption.value).toBe('')
    await user.type(inputOption, 'Hola mundo')
    expect(inputOption.value).toBe('Hola mundo')
  })

  it('should validate the dont have more than 3 options', async () => {
    const { getByText, getAllByText } = render(
      <ReactFlowProvider>
        <QuickRepliesPanel
          dataNode={nodeMock}
          messageId={MESSAGE_ID_TEST}
          quickReplies={[]}
          text=''
        />
      </ReactFlowProvider>
    )

    const btnAddOption = getByText('+ Agregar nuevo botón')
    expect(btnAddOption).toBeTruthy()

    await user.click(btnAddOption)
    await user.click(btnAddOption)
    await user.click(btnAddOption)
    expect(getAllByText('optionItem')).toHaveLength(3)

    await user.click(btnAddOption)
    expect(getAllByText('optionItem')).toHaveLength(3)
  })
})
