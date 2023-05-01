import { Layout, Space, Menu } from 'antd';
import MixChannel from './mixChannel';

function FaderBank({channelCount, mixer, appState}:{channelCount:number, mixer:any, appState: {selectedChannel: string, selectChannel: React.Dispatch<string>}}) {

    const { Sider, Content } = Layout;
  
    const optionItems = [
      {
        key: 'gain',
        label: 'Gain',
        title: 'Gain',
      },
      {
        key: 'pan',
        label: 'Pan',
        title: 'Pan',
      },
    ];

    const bankItems = [
      {
        key: '1',
        label: '1',
        title: 'Bank 1',
      },
      {
        key: '2',
        label: '2',
        title: 'Bank 2',
      },
    ];
    
    let faderItems: JSX.Element[] = [];
    for (let i = 1; i <= channelCount; i++) {
        faderItems.push(<MixChannel channel={mixer.master.input(i)} appState={appState}/>);
    }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Space className='fader-list' style={{ display: 'flex', overflowX: 'auto' }}>
            {faderItems}
        </Space>
      </Content>
      <Sider defaultCollapsed collapsed style={{ }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller', marginTop: '5px' }}>Option</div>
        <Menu theme="dark"defaultSelectedKeys={['1']} mode="inline" items={optionItems} />
        <div style={{ flex: '1', height: '30%' }}></div>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller' }}>Bank</div>
        <Menu theme="dark"defaultSelectedKeys={['1']} mode="inline" items={bankItems} />
      </Sider>
    </Layout>
  );
}

export default FaderBank;