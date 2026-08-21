import { useState } from 'react'
import { router } from 'expo-router'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { Host, Switch } from '@expo/ui'
import { Button, Card, Pill, SectionTitle, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { ACCENTS, localTZ } from '../core/format.js'
import { buildPlanBundle, planPrintHTML } from '../core/plan-share.js'
import { LANGS, setLang, t, useLang } from '../i18n/index.js'
import { notificationService } from '../services/notification-service.js'
import { sharingService } from '../services/sharing-service.js'
import { stateRepository } from '../services/state-repository.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

function SettingRow({ title, subtitle, children }) {
  const theme = useTheme()
  return <View style={[styles.setting, { borderColor: theme.line }]}><View style={styles.grow}><Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>{subtitle ? <Text style={[styles.settingSubtitle, { color: theme.muted }]}>{subtitle}</Text> : null}</View>{children}</View>
}

function SettingSwitch(props) {
  return <Host matchContents><Switch {...props} /></Host>
}

export default function SettingsScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const update = useStore(store => store.update)
  const reset = useStore(store => store.reset)
  const loadStarter = useStore(store => store.loadStarter)
  const [busy, setBusy] = useState(false)
  const patch = values => update(draft => Object.assign(draft, values))
  const toggleReminder = async () => {
    if (!state.reminder.on) {
      const next = { ...state, reminder: { ...state.reminder, on: true, tz: localTZ() } }
      if (!(await notificationService.syncWorkoutReminders(next, true))) return
      patch({ reminder: next.reminder })
    } else {
      patch({ reminder: { ...state.reminder, on: false } })
      notificationService.cancelWorkoutReminders().catch(() => {})
    }
  }
  const share = async task => { setBusy(true); try { await task() } finally { setBusy(false) } }
  const languageKeys = Object.keys(LANGS)
  const cycleLanguage = async () => { const next = languageKeys[(languageKeys.indexOf(state.lang) + 1) % languageKeys.length]; patch({ lang: next }); await setLang(next) }
  const resetFlow = () => Alert.alert(t('Reset all data?'), t('Routines, workouts and settings on this device will be removed.'), [{ text: t('Cancel'), style: 'cancel' }, { text: t('Reset'), style: 'destructive', onPress: reset }])
  return <Screen><Title subtitle={t('Local-only · no account · no cloud')}>{t('Settings')}</Title><SectionTitle>{t('Training')}</SectionTitle><Card style={styles.group}><SettingRow title={t('Unit')}><View style={styles.inline}><Pill selected={state.unit === 'kg'} onPress={() => patch({ unit: 'kg' })}>kg</Pill><Pill selected={state.unit === 'lb'} onPress={() => patch({ unit: 'lb' })}>lb</Pill></View></SettingRow><SettingRow title={t('Effort scale')}><View style={styles.inline}>{['none', 'rir', 'rpe'].map(value => <Pill key={value} selected={(state.effort || 'none') === value} onPress={() => patch({ effort: value })}>{value.toUpperCase()}</Pill>)}</View></SettingRow><SettingRow title={t('Rest timer')} subtitle={`${state.restSec} ${t('seconds')}`}><View style={styles.inline}><Button onPress={() => patch({ restSec: Math.max(15, state.restSec - 15) })}>−</Button><Button onPress={() => patch({ restSec: state.restSec + 15 })}>＋</Button></View></SettingRow><SettingRow title={t('Keep screen awake')}><SettingSwitch value={state.keepAwake} onValueChange={value => patch({ keepAwake: value })} /></SettingRow><SettingRow title={t('Sound & haptics')}><SettingSwitch value={state.sound} onValueChange={value => patch({ sound: value })} /></SettingRow><SettingRow title={t('Workout day reminder')} subtitle={state.reminder.time}><SettingSwitch value={state.reminder.on} onValueChange={toggleReminder} /></SettingRow></Card>
    <SectionTitle>{t('Appearance')}</SectionTitle><Card style={styles.group}><SettingRow title={t('Theme')}><View style={styles.inline}>{['dark', 'light', 'system'].map(value => <Pill key={value} selected={state.theme === value} onPress={() => patch({ theme: value })}>{t(value)}</Pill>)}</View></SettingRow><SettingRow title={t('Accent color')}><View style={styles.colors}>{Object.entries(ACCENTS).map(([name, color]) => <Pressable accessibilityLabel={name} key={name} onPress={() => patch({ accent: name })} style={[styles.color, { backgroundColor: color, borderColor: state.accent === name ? theme.text : 'transparent' }]} />)}</View></SettingRow><SettingRow title={t('Body map')}><View style={styles.inline}><Pill selected={state.body === 'male'} onPress={() => patch({ body: 'male' })}>{t('Male')}</Pill><Pill selected={state.body === 'female'} onPress={() => patch({ body: 'female' })}>{t('Female')}</Pill></View></SettingRow><SettingRow title={t('Language')} subtitle={LANGS[state.lang]}><Button onPress={cycleLanguage}>{t('Change')}</Button></SettingRow></Card>
    <SectionTitle>{t('Your data')}</SectionTitle><Card style={styles.actions}><Button onPress={() => router.push('/import')}>{t('Import backup, plan or history')}</Button><Button disabled={busy} onPress={() => share(() => sharingService.shareText('opengym-backup.json', stateRepository.exportBackup(state)))}>{t('Export training backup')}</Button><Button disabled={busy} onPress={() => share(() => sharingService.shareText('opengym-plan.json', JSON.stringify(buildPlanBundle(state, 'openGym plan'), null, 2)))}>{t('Share plan file')}</Button><Button disabled={busy} onPress={() => share(() => sharingService.sharePDF('opengym-plan.pdf', planPrintHTML(state)))}>{t('Share plan PDF')}</Button></Card>
    <SectionTitle>{t('Starter and reset')}</SectionTitle><Card style={styles.actions}><Button onPress={loadStarter}>{t('Load starter plan')}</Button><Button variant="danger" onPress={resetFlow}>{t('Reset all data')}</Button></Card>
    <SectionTitle>{t('About')}</SectionTitle><Card><Text style={[styles.about, { color: theme.text }]}>openGym · AGPL-3.0</Text><Text style={[styles.notice, { color: theme.muted }]}>Exercise data and media: Gym Visual under the project’s licensed redistribution terms. Body geometry: MuscleMap by Melih Colpan (MIT). Original openGym notices and attribution are retained in NOTICE.md.</Text><Text style={[styles.notice, { color: theme.muted }]}>No login, analytics, backend, cloud sync, subscriptions, or WebView. Your data stays in this app unless you explicitly share it.</Text></Card></Screen>
}

const styles = StyleSheet.create({ group: { paddingVertical: 0 }, setting: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }, grow: { flex: 1 }, settingTitle: { fontSize: 16, fontWeight: '650' }, settingSubtitle: { fontSize: 12, marginTop: 3 }, inline: { flexDirection: 'row', alignItems: 'center', gap: 6 }, colors: { flexDirection: 'row', flexWrap: 'wrap', width: 116, gap: 7 }, color: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 }, actions: { gap: 9 }, about: { fontSize: 16, fontWeight: '750' }, notice: { fontSize: 13, lineHeight: 19, marginTop: 10 } })
