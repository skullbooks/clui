import React, { useState } from 'react';
import { Layout, ConfigProvider, theme, Menu } from 'antd';
import './App.css';
import './clui.css';
import { SoundcraftUI } from 'soundcraft-ui-connection';
import FaderBank from './ui/faderBank';

function App({mixer}: {mixer:SoundcraftUI}) {

  mixer.connect().then(() => {
    mixer.status$.subscribe(status => {
      console.log('Mixer Status:', status);
    });
  });

  const [selectedChannel, selectChannel] = useState('');

  const applicationState = {
    selectedChannel: selectedChannel,
    selectChannel: selectChannel
  };

  const { Sider, Content } = Layout;
  const [darkMode, toggleDargMode] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  return (
  <ConfigProvider
    theme={{
      algorithm: (darkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#9900ff',
      },
    }}
  >
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div 
          onClick={() => toggleDargMode(!darkMode)} 
          style={{ height: 40, margin: 8, background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
        >CL Ui<br/>{selectedChannel}</div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={[]} />
      </Sider>
      <Content>
        <FaderBank channelCount={8} mixer={mixer} appState={applicationState} />
      </Content>
    </Layout>
  </ConfigProvider>
  );
}

export default App;
