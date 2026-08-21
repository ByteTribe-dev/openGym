import * as DocumentPicker from 'expo-document-picker'
import { File, Paths } from 'expo-file-system'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'

const safeName = name => name.replace(/[^a-z0-9._-]+/gi, '-').toLowerCase()

export const sharingService = {
  async pickText() {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, type: ['application/json', 'text/*'] })
    if (result.canceled) return null
    return new File(result.assets[0].uri).text()
  },
  async shareText(name, text, mimeType = 'application/json') {
    const file = new File(Paths.cache, safeName(name))
    file.write(text)
    await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: `Share ${name}` })
    return file.uri
  },
  async sharePDF(name, html) {
    const result = await Print.printToFileAsync({ html })
    await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf', dialogTitle: `Share ${name}` })
    return result.uri
  },
}
