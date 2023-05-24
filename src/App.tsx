import React, { useState } from 'react';
import { Layout, ConfigProvider, theme, Menu, Space } from 'antd';
import './App.css';
import './clui.css';
import FaderBlock from './ui/faderBlock';
import { mixerUiConfig, userUiConfig } from './statics/config';
import { FaderBankKnobMode, FaderBlockType } from './interfaces/states';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import SoloChannel from './ui/soloChannel';
import { SoundcraftUI } from 'soundcraft-ui-connection';

declare global {
  interface Window { mixer: any; }
}

function App({mixer}: {mixer: SoundcraftUI}) {
  window.mixer = mixer;

  mixer.connect().then(() => {
    mixer.status$.subscribe(status => {
      console.log('Mixer Status:', status);
    });
  });

  const [selectedChannel, selectChannel] = useState('');
  const [bankKnobMode, changeBankKnobMode] = useState(FaderBankKnobMode.gain);
  const [darkMode, toggleDargMode] = useState(false);

  const applicationState = {
    selectedChannel: selectedChannel,
    selectChannel: selectChannel,
    bankKnobMode: bankKnobMode,
    changeBankKnobMode: changeBankKnobMode,
    darkMode: darkMode,
  };

  const { Sider, Content } = Layout;

  const [collapsed, setCollapsed] = useState(false);
  const [selectedView, setView] = useState('fader');

  const [customKeysState, setCustomKeysState] = useState([]);
  const onCustomKeyClicked = (key: string) => {
    console.log("DEBUG CustomKey", key, customKeysState);
  };
  let customKeys: ItemType[] = [];
  const userCustomKeyConfig = userUiConfig.customKeys;
  for(let i = 1; i <= mixerUiConfig.customKeysCount; i++) {
    let title = `Button ${i}`;
    if (userCustomKeyConfig && userCustomKeyConfig[i]) title = userCustomKeyConfig[i].name
    customKeys.push({
      key: i,
      label: i,
      title: title,
    })
  }

  let mainMenuItems: ItemType[] = [];
  mainMenuItems.push({
    key: 'fader',
    label: 'Fader',
    title: 'Switch View',
  })
  mainMenuItems.push({
    key: 'channel',
    label: 'Channel',
    title: 'Switch View',
  })
  const mainSidebar = <Sider collapsed onCollapse={(value) => setCollapsed(value)}>
  <div 
    onClick={() => toggleDargMode(!darkMode)} 
    style={{ height: 40, margin: 8, background: 'rgba(33, 33, 33, 1)', color: '#fff' }}
  >CL Ui<br/>{selectedChannel}</div>
  <div style={{ width: '100%', padding: '0 4px', textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller' }}>Views<br/>
  <Menu theme="dark" defaultSelectedKeys={[selectedView]} mode="inline" items={mainMenuItems} onSelect={({key}) => setView(key) } />
  </div>
  <div style={{ position: 'absolute', bottom: '50px', width: '100%', padding: '0 4px', textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller' }}>Custom Keys<br/>
    <Menu theme="dark" defaultSelectedKeys={customKeysState} mode="inline" items={customKeys} onSelect={({key}) => onCustomKeyClicked(key) } />
  </div>
</Sider>

// fader view
  let layoutContainsMasterBlock = false;
  let faderBlocks: JSX.Element[] = [];
  const userFaderBlocksConfig = userUiConfig.faderBlocks;

  mixerUiConfig.faderBlocks.forEach((faderBlockConfig) => {
    const { channelCount, bankCount, identifier, type } = faderBlockConfig;
    if (type === FaderBlockType.master) layoutContainsMasterBlock = true;
    const userFaderBlockConfig = userFaderBlocksConfig[identifier];
    faderBlocks.push(<FaderBlock 
      channelCount={channelCount} 
      bankCount={bankCount}
      userFaderBlockConfig={userFaderBlockConfig}
      type={type}
      mixer={mixer} 
      appState={applicationState} 
    />);
  });
  faderBlocks.splice((layoutContainsMasterBlock) ? faderBlocks.length-1 :faderBlocks.length, 0, mainSidebar);

  return (
  <ConfigProvider
    theme={{
      algorithm: (darkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#666',
      },
    }}
  >
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
      { selectedView === 'fader' ?
      <Space className='fader-section' style={{ display: 'flex', flex: 1, columnGap: 0 }}>
        {faderBlocks}
      </Space>
      :
      <Space className='solo-section' style={{ display: 'flex', flex: 1, columnGap: 0 }}>
        <SoloChannel mixer={mixer} appState={applicationState} />
        {mainSidebar}
      </Space>
      }
      </Content>
    </Layout>
  </ConfigProvider>
  );
}

export default App;
