import { useState } from 'react'
import { router } from 'expo-router'
import { StyleSheet, Text } from 'react-native'
import { Button, Card, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { mergeImport, parseImport } from '../core/import-csv.js'
import { mergePlan, parsePlan } from '../core/plan-share.js'
import { t, useLang } from '../i18n/index.js'
import { sharingService } from '../services/sharing-service.js'
import { stateRepository } from '../services/state-repository.js'
import { DEF, useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function ImportScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const update = useStore(store => store.update)
  const replaceState = useStore(store => store.replaceState)
  const [status, setStatus] = useState('')
  const pick = async kind => {
    setStatus(t('Choose a file…'))
    try {
      const text = await sharingService.pickText()
      if (!text) { setStatus(''); return }
      if (kind === 'history') {
        const parsed = parseImport(text, { unit: state.unit })
        if (parsed.error) throw new Error(t('Unrecognised training export.'))
        let result
        update(draft => { result = mergeImport(draft, parsed) })
        setStatus(t('{0} items imported · {1} skipped', result.added, result.skipped))
        return
      }
      const raw = JSON.parse(text)
      if (raw.opengym_plan) {
        const bundle = parsePlan(raw)
        update(draft => mergePlan(draft, bundle, { schedule: true }))
        setStatus(t('{0} routines imported', bundle.routineCount))
      } else {
        replaceState(stateRepository.importBackup(raw, DEF))
        setStatus(t('Backup restored'))
      }
    } catch (error) { setStatus(error.message || t('Import failed')) }
  }
  return <Screen><Title subtitle={t('Files are read locally and never uploaded')}>{t('Import')}</Title><Card style={styles.actions}><Button variant="primary" onPress={() => pick('json')}>{t('Choose backup or plan JSON')}</Button><Text style={[styles.help, { color: theme.muted }]}>{t('Restores an openGym backup, or merges a shared plan and its weekly schedule.')}</Text></Card><Card style={styles.actions}><Button onPress={() => pick('history')}>{t('Choose CSV or Apple Health export')}</Button><Text style={[styles.help, { color: theme.muted }]}>{t('Supports FitNotes, Strong, Hevy, compatible CSV files, and Apple Health body-weight XML.')}</Text></Card>{status ? <Card><Text style={{ color: theme.text, textAlign: 'center' }}>{status}</Text></Card> : null}<Button onPress={() => router.back()}>{t('Done')}</Button></Screen>
}

const styles = StyleSheet.create({ actions: { gap: 10 }, help: { fontSize: 13, lineHeight: 19 } })
