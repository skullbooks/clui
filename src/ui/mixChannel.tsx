import { Space, Slider, Button } from 'antd';
import React, { useState } from 'react';
import { MasterChannel } from 'soundcraft-ui-connection';

function MixChannel({channel, appState}: {channel:MasterChannel, appState: {selectedChannel: string, selectChannel: React.Dispatch<string>}}) {
  const {selectedChannel, selectChannel} = appState;
  const [initState, setInitState] = useState(false);

  const channelNumber = Number(channel.fullChannelId.split('.')[1])+1;

  const [channelName, updateChannelName] = useState(`${channelNumber}`);
  const [mute, updateMuteState] = useState(true);
  const [faderLevel, updateFaderLevel] = useState(0);
  const [faderLevelDB, updateFaderLevelDB] = useState('');

  function initSubscriptions(channel: MasterChannel) {
    console.log("INIT CHANNEL LISTENERS", channel.fullChannelId);
    setInitState(true);
    channel.name$.subscribe(value => { updateChannelName(`${value}`);});
    channel.mute$.subscribe(value => { updateMuteState((value)? true : false);});
    channel.faderLevel$.subscribe(value => { updateFaderLevel(value);});
    // eslint-disable-next-line eqeqeq
    channel.faderLevelDB$.subscribe(value => { updateFaderLevelDB((value.toString() == '-Infinity' ) ? '-∞' : `${value}`); });
  }
  if (!initState) initSubscriptions(channel);

  const onFaderChange = (value: number) => {
    channel.setFaderLevel(value/100);
  };

  const onToggleMute = () => {
    channel.setMute((mute) ? 0 : 1 );
  };

  const onSelectChannel = () => {
    selectChannel(channel.fullChannelId);
  }
  return (
<Space className='channel-strip' direction="vertical">
  <div style={{ height: '60px', lineHeight: '60px' }}>KNOB</div>
  <Button onClick={onSelectChannel} type={(selectedChannel == channel.fullChannelId) ? 'primary' : 'default'}>SEL</Button>
  <div><span>CH {channelNumber}</span><br/>{channelName}</div>
  <Button onClick={onToggleMute} danger type={(mute) ? 'primary' : 'default'} >ON</Button>
  <div style={{ fontSize: 'smaller' }}>{faderLevelDB} dB</div>
  <Slider 
    vertical 
    value={faderLevel*100}
    onChange={onFaderChange}
    tooltip={{open: false}}
    min={0} 
    max={100}
    marks={{
      0: '-∞',
      76.5: '0 dB',
      100: '10 dB',

    }}
    step={0.0001}
    className='channel-fader'
  />
</Space>
  );
}

export default MixChannel;