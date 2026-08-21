import { expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppTabBar } from './AppTabBar.jsx'

jest.mock('../store/useStore.js', () => ({
  useStore: selector => selector({ S: { active: null, theme: 'dark', accent: 'lime' } }),
}))

const state = {
  index: 0,
  routes: [
    { key: 'home-key', name: 'index' },
    { key: 'plan-key', name: 'plan', params: { source: 'tab' } },
  ],
}

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
}

const renderTabBar = navigation => render(
  <SafeAreaProvider initialMetrics={metrics}>
    <AppTabBar state={state} navigation={navigation} />
  </SafeAreaProvider>,
)

it('does not navigate again when the focused tab is pressed', async () => {
  const navigation = {
    emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn(),
  }
  const screen = await renderTabBar(navigation)

  await fireEvent.press(screen.getByLabelText('Home'))

  expect(navigation.emit).toHaveBeenCalledWith({ type: 'tabPress', target: 'home-key', canPreventDefault: true })
  expect(navigation.navigate).not.toHaveBeenCalled()
})

it('navigates to an unfocused tab unless its press is prevented', async () => {
  const navigation = {
    emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn(),
  }
  const screen = await renderTabBar(navigation)

  await fireEvent.press(screen.getByLabelText('Plan'))

  expect(navigation.navigate).toHaveBeenCalledWith('plan', { source: 'tab' })
})
