export type CopyToClipboardParam = {
  content: string
  onsuccess?: () => void
  onerror?: (error: Error) => void
}

export const copyToClipboard = async ({ content, onsuccess = () => null, onerror = () => null }: CopyToClipboardParam) => {
  try {
    await navigator.clipboard.writeText(content)
    onsuccess()
  } catch (error) {
    onerror(error as Error)
  }
}