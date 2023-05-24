import { Layout, Space, Menu, theme } from 'antd';
import MixChannel from './mixChannel';
import { useState } from 'react';
import { FaderBlockType, FaderBankKnobMode } from '../interfaces/states';
import { getChannelById, getHwChannelById } from '../utils/channelFinder';

function FaderBlock({channelCount, mixer, appState, userFaderBlockConfig, bankCount, type}:{
  channelCount:number, bankCount:number, userFaderBlockConfig:any, type: FaderBlockType, mixer:any, 
  appState: {
    selectedChannel: string, selectChannel: React.Dispatch<string>, 
    bankKnobMode: FaderBankKnobMode, changeBankKnobMode: React.Dispatch<FaderBankKnobMode>
    darkMode: boolean
  }
}) {

  const { Sider, Content } = Layout;
  const { bankKnobMode, changeBankKnobMode, darkMode } = appState;

  const [activeBank, setActiveBank] = useState('1');

  const optionItems = [
    {
      key: FaderBankKnobMode.gain,
      label: 'Gain',
      title: 'Gain',
    },
    {
      key: FaderBankKnobMode.pan,
      label: 'Pan',
      title: 'Pan',
    },
  ];
    
  let bankItems = [];
  for (let i = 1; i <= bankCount; i++) bankItems.push({
    key: i,
    label: i,
    title: `Bank ${i}`,
  }) 
  
  const channelsIdentifier = userFaderBlockConfig.banks[Number(activeBank)-1].channels;

  let faderItems: JSX.Element[] = [];
  for (let i = 0; i < channelCount; i++) {
    const channel = getChannelById(channelsIdentifier[i], mixer);
    const hwChannel = getHwChannelById(channelsIdentifier[i], mixer);

    faderItems.push(<MixChannel channel={channel} hwChannel={hwChannel} appState={appState} style={{ flex: 1, padding: '10px 0' }}/>);
  }

  const flexClass = (userFaderBlockConfig.banks.length > 1) ? `flex-${channelCount}` : `flex-${channelCount-1}`;

  return (
    <div className={flexClass} style={{ width: '-webkit-fill-available', display: 'flex', overflowX: 'auto', minHeight: '100vh' }}>
      <Space className='fader-list' style={{ display: 'flex', flex: `${channelCount}`, overflowX: 'auto', columnGap: 0 }}>
          {faderItems}
      </Space>
      { userFaderBlockConfig.banks.length > 1 &&
      <Sider collapsed style={{ flex: 1 }}>
        {(type === FaderBlockType.primary) ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller', padding: '0 4px', marginTop: '5px' }}>Option<br/><Menu theme="dark" defaultSelectedKeys={[bankKnobMode]} mode="inline" items={optionItems}  onSelect={({key}) => { const newMode = (key === 'pan') ? FaderBankKnobMode.pan : FaderBankKnobMode.gain; changeBankKnobMode(newMode) }} /></div> : <></>}
        <div style={{ position: 'absolute', bottom: '50px', width: '100%', padding: '0 4px', textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 'smaller' }}>Bank<br/>
        <Menu defaultSelectedKeys={[activeBank]} theme="dark" mode="inline" items={bankItems} onSelect={({key}) => setActiveBank(key) } />
        </div>
      </Sider>
      }
    </div>
  );
}

export default FaderBlock;