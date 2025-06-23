// app/screens/SettingsDrawer/index.tsx
import SupportButton from '@components/buttons/SupportButton'
import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'
import { Text, View, TextInput, Button } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import AppModeToggle from './AppModeToggle'
import RouteList from './RouteList'
import UserInfo from './UserInfo'
import { sendPrompt } from '../../../lib/tcp-client' // New import for TCP client
import { useState } from 'react' // New import for state management

const SettingsDrawer = () => {
    const { color, spacing } = Theme.useTheme()
    const [devMode] = useMMKVBoolean(AppSettings.DevMode)
    
    // New state for TCP testing
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')

    // New function to test TCP backend
    const testTcp = async () => {
        try {
            const output = await sendPrompt('qwen3', prompt, 'math_specialist')
            setResponse(output)
        } catch (error) {
            setResponse(`Error: ${error.message}`)
        }
    }

    return (
        <Drawer.Body
            drawerID={Drawer.ID.SETTINGS}
            drawerStyle={{
                width: '60%',
                paddingBottom: spacing.xl2,
            }}>
            <UserInfo />
            <AppModeToggle />
            <RouteList />
            {/* New TCP testing section */}
            <View style={{ marginHorizontal: spacing.xl2, marginTop: spacing.l }}>
                <Text style={{ color: color.text._300, marginBottom: spacing.s }}>
                    Swarm TCP Backend Test
                </Text>
                <TextInput
                    placeholder="Enter prompt"
                    value={prompt}
                    onChangeText={setPrompt}
                    style={{
                        borderWidth: 1,
                        borderColor: color.border._300,
                        padding: spacing.s,
                        marginBottom: spacing.s,
                        color: color.text._900,
                    }}
                />
                <Button title="Test TCP" onPress={testTcp} />
                <Text style={{ color: color.text._300, marginTop: spacing.s }}>
                    Response: {response}
                </Text>
            </View>
            <Text
                style={{
                    alignSelf: 'center',
                    color: color.text._300,
                    marginTop: spacing.l,
                    marginBottom: spacing.xl2,
                }}>
                {__DEV__ && 'DEV BUILD\t'}
                {devMode && 'DEV MODE\t'}
                {'v' + appConfig.expo.version}
            </Text>
            <View style={{ marginHorizontal: spacing.xl2 }}>
                <SupportButton />
            </View>
        </Drawer.Body>
    )
}

export default SettingsDrawer
