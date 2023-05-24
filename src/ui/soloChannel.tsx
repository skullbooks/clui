import { Layout, Space, Menu, theme } from 'antd';
import { Knob } from 'primereact/knob';
import { useEffect, useState } from 'react';
import { Subscription, SubscriptionLike } from 'rxjs';
import { FaderBlockType, FaderBankKnobMode } from '../interfaces/states';
import { HwChannel, MasterChannel } from 'soundcraft-ui-connection';
import EqControl from './eqControl';
import RoundDisplay, { RoundDisplayMode } from '../components/roundDisplay';
import { getChannelById, getHwChannelById } from '../utils/channelFinder';

function SoloChannel({mixer, appState}:{
  mixer:any, 
  appState: {
    selectedChannel: string, selectChannel: React.Dispatch<string>, 
    bankKnobMode: FaderBankKnobMode, changeBankKnobMode: React.Dispatch<FaderBankKnobMode>
    darkMode: boolean
  }
}) {

  const { Sider, Content } = Layout;
  const {selectedChannel} = appState;


const { useToken } = theme;
const { token } = useToken();

const [gain, updateGain] = useState(0);
const [gainDB, updateGainDB] = useState('0');
const [gainDisabled, disableGain] = useState(false);

const channel = getChannelById(selectedChannel, mixer);
const hwChannel = getHwChannelById(selectedChannel, mixer);

useEffect(() => {
    console.log("INIT CHANNEL LISTENERS");
//    updateFaderLevel(0);
//    updateFaderLevelDB('0');
    updateGain(0);
    updateGainDB('0');
//    updatePan(0);
    const subscriptions: SubscriptionLike[] = [];
//    (channel.name$) ? subscriptions.push(channel.name$.subscribe(value => { updateChannelName(`${value}`);})) : updateChannelName('Master');
//    if (channel.mute$) {
//      subscriptions.push(channel.mute$.subscribe(value => { updateMuteState((value)? true : false);}));
//      disableMute(false);
//    } else disableMute(true);
//    subscriptions.push(channel.faderLevel$.subscribe(value => { updateFaderLevel(value);}));
    // eslint-disable-next-line eqeqeq
//    subscriptions.push(channel.faderLevelDB$.subscribe(value => { updateFaderLevelDB((value.toString() == '-Infinity' ) ? '-∞' : `${value}`); }));
    if (hwChannel) {
      subscriptions.push(hwChannel.gain$.subscribe(value => { updateGain(value*100);}))
      subscriptions.push(hwChannel.gainDB$.subscribe(value => { updateGainDB(`${value}`);}));
      disableGain(false);
    } else disableGain(true);
//    subscriptions.push(channel.pan$.subscribe(value => { updatePan((value-0.5)*100);}));

    return () => { 
      console.log("DISCONECT");
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, [channel, hwChannel]);

const knobConfig = {
    min: 0,
    max: 100,
    value: gain,
    label: (gainDisabled) ? '-' : `${gainDB}`,
    disabled: gainDisabled
  }
  const onPanChange = (e: any) => {
    if (hwChannel) hwChannel.setGain(e.value/100);
  }

  

  return (
    <div className='flex-1' style={{ width: '-webkit-fill-available', display: 'flex', overflowX: 'auto', minHeight: '100vh', padding: '10px', columnGap: '10px' }}>
          <Knob value={knobConfig.value} valueTemplate={knobConfig.label} size={60} min={knobConfig.min} max={knobConfig.max} disabled={knobConfig.disabled}
    valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover} textColor={token.colorTextDescription} strokeWidth={20}
    onChange={onPanChange} />

        <EqControl mixer={mixer} channel={channel}/>
    </div>
  );
}

export default SoloChannel;