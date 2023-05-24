import { Space, Slider, Button, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Subscription, SubscriptionLike } from 'rxjs';
import { HwChannel, MasterBus, MasterChannel } from 'soundcraft-ui-connection';
import { Knob } from 'primereact/knob';
import { FaderBankKnobMode } from '../interfaces/states';

function MixChannel({channel, hwChannel, appState, style}: {
  channel: MasterChannel,
  hwChannel:  HwChannel | null ,
  appState: {
    selectedChannel: string, selectChannel: React.Dispatch<string>, 
    bankKnobMode: FaderBankKnobMode}, 
  style: any
}) {
  const {selectedChannel, selectChannel, bankKnobMode } = appState;
  const channelId = channel.fullChannelId;
  const { useToken } = theme;
  const { token } = useToken();

  const channelNumber = (channelId) ? Number(channelId.split('.')[1])+1 : 'M';

  const [channelName, updateChannelName] = useState(`${channelNumber}`);
  const [mute, updateMuteState] = useState(true);
  const [muteDisabled, disableMute] = useState(false);
  const [faderLevel, updateFaderLevel] = useState(0);
  const [faderLevelDB, updateFaderLevelDB] = useState('');
  const [gain, updateGain] = useState(0);
  const [gainDB, updateGainDB] = useState('0');
  const [gainDisabled, disableGain] = useState(false);
  const [pan, updatePan] = useState(0);

  useEffect(() => {
    console.log("INIT CHANNEL LISTENERS", channelId);
    updateFaderLevel(0);
    updateFaderLevelDB('0');
    updateGain(0);
    updateGainDB('0');
    updatePan(0);
    const subscriptions: SubscriptionLike[] = [];
    (channel.name$) ? subscriptions.push(channel.name$.subscribe(value => { updateChannelName(`${value}`);})) : updateChannelName('Master');
    if (channel.mute$) {
      subscriptions.push(channel.mute$.subscribe(value => { updateMuteState((value)? true : false);}));
      disableMute(false);
    } else disableMute(true);
    subscriptions.push(channel.faderLevel$.subscribe(value => { updateFaderLevel(value);}));
    // eslint-disable-next-line eqeqeq
    subscriptions.push(channel.faderLevelDB$.subscribe(value => { updateFaderLevelDB((value.toString() == '-Infinity' ) ? '-∞' : `${value}`); }));
   
    if (hwChannel) {
      subscriptions.push(hwChannel.gain$.subscribe(value => { updateGain(value*100);}))
      subscriptions.push(hwChannel.gainDB$.subscribe(value => { updateGainDB(`${value}`);}));
      disableGain(false);
    } else disableGain(true);
    subscriptions.push(channel.pan$.subscribe(value => { updatePan((value-0.5)*100);}));

    return () => { 
      console.log("DISCONECT", channelId);
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, [channel, hwChannel, channelId]);


  const onFaderChange = (value: number) => {
    channel.setFaderLevel(value/100);
  };

  const onToggleMute = () => {
    channel.setMute((mute) ? 0 : 1 );
  };

  const onSelectChannel = () => {
    selectChannel(channelId);
  }

  const knobConfig = (bankKnobMode === FaderBankKnobMode.pan) ? {
    min: -50,
    max: 50,
    value: pan,
    label: (pan < 0) ? `L ${Math.round(pan)*-1}` : (pan == 0) ? 'C' : `R ${Math.round(pan)}`,
    disabled: false
  } : {
    min: 0,
    max: 100,
    value: gain,
    label: (gainDisabled) ? '-' : `${gainDB}`,
    disabled: gainDisabled
  }

  const onPanChange = (e: any) => {
    if ((bankKnobMode === FaderBankKnobMode.gain) && hwChannel) hwChannel.setGain(e.value/100);
    if ((bankKnobMode === FaderBankKnobMode.pan)) channel.pan((e.value/100)+0.5);
  }

  return (
<Space className='channel-strip' direction="vertical" style={style}>
  <div style={{ height: '60px', lineHeight: '60px', paddingTop: '5px' }}>
    <Knob value={knobConfig.value} valueTemplate={knobConfig.label} size={60} min={knobConfig.min} max={knobConfig.max} disabled={knobConfig.disabled}
    valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover} textColor={token.colorTextDescription} strokeWidth={20}
    onChange={onPanChange} />
  </div>
  <Button className={channelId+"-selectBtn"} onClick={onSelectChannel} type={(selectedChannel === channelId) ? 'primary' : 'default'}>SEL</Button>
  <div className='channel-label' style={{ background: `${token.colorInfoBg}`, borderColor: `${token.colorInfoBorder}`, color: `${token.colorInfoText}`}}><span>CH {channelNumber}</span><br/>{channelName}</div>
  <Button className={channelId+"-muteBtn"} onClick={onToggleMute} danger disabled={muteDisabled} type={(mute || (mute && !muteDisabled)) ? 'primary' : 'default'} >ON</Button>
  <div style={{ fontSize: 'smaller', color: token.colorTextDescription }}>{faderLevelDB} dB</div>
  <Slider
    className={channelId+"-channelFader channel-fader"}
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
  />
</Space>
  );
}

export default MixChannel;