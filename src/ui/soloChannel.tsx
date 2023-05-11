import { Layout, Space, Menu, theme } from 'antd';
import { Knob } from 'primereact/knob';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { FaderBlockType, FaderBankKnobMode } from '../interfaces/states';
import { HwChannel, MasterChannel } from 'soundcraft-ui-connection';
import EqControl from './eqControl';
import RoundDisplay, { RoundDisplayMode } from '../components/roundDisplay';

function SoloChannel({mixer, appState}:{
  mixer:any, 
  appState: {
    selectedChannel: string, selectChannel: React.Dispatch<string>, 
    bankKnobMode: FaderBankKnobMode, changeBankKnobMode: React.Dispatch<FaderBankKnobMode>
    darkMode: boolean
  }
}) {

  const { Sider, Content } = Layout;

  /*
  let faderItems: JSX.Element[] = [];
  for (let i = 0; i < channelCount; i++) {
    const identifier = (!channelsIdentifier[i]) ? [] : channelsIdentifier[i].split('.');
    let channel;
    let hwChannel = null;

    switch (identifier[0]) {
      case 'i':
        channel = mixer.master.input(Number(identifier[1])+1);
        hwChannel = mixer.hw(Number(identifier[1])+1);
        break;
      case 'a':
        channel = mixer.master.aux(Number(identifier[1])+1);
        break;
      case 'f':
        channel = mixer.master.fx(Number(identifier[1])+1);
        break;
      case 'l':
        channel = mixer.master.line(Number(identifier[1])+1);
        break;
      case 'p':
        channel = mixer.master.player(Number(identifier[1])+1);
        break;
      case 's':
        channel = mixer.master.sub(Number(identifier[1])+1);
        break;
      case 'v':
        channel = mixer.master.vca(Number(identifier[1])+1);
        break;
      case 'm':
        channel = mixer.master;
        break;
      default:
    channel = mixer.master.input(100);
    }
    faderItems.push(<MixChannel channel={channel} hwChannel={hwChannel} appState={appState} style={{ flex: 1, padding: '10px 0' }}/>);
  }

  const flexClass = (userFaderBlockConfig.banks.length > 1) ? `flex-${channelCount}` : `flex-${channelCount-1}`;
*/
const { useToken } = theme;
const { token } = useToken();

const [gain, updateGain] = useState(0);
const [gainDB, updateGainDB] = useState('0');
const [gainDisabled, disableGain] = useState(false);

const channel: MasterChannel = mixer.master.input(1);
const hwChannel: HwChannel = mixer.hw(1);

useEffect(() => {
    console.log("INIT CHANNEL LISTENERS");
//    updateFaderLevel(0);
//    updateFaderLevelDB('0');
    updateGain(0);
    updateGainDB('0');
//    updatePan(0);
    const subscriptions: Subscription[] = [];
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
    hwChannel.setGain(e.value/100);
  }

  

  return (
    <div className='flex-1' style={{ width: '-webkit-fill-available', display: 'flex', overflowX: 'auto', minHeight: '100vh', padding: '10px', columnGap: '10px' }}>
          <Knob value={knobConfig.value} valueTemplate={knobConfig.label} size={60} min={knobConfig.min} max={knobConfig.max} disabled={knobConfig.disabled}
    valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover} textColor={token.colorTextDescription} strokeWidth={20}
    onChange={onPanChange} />

        <EqControl mixer={mixer}/>
    </div>
  );
}

export default SoloChannel;