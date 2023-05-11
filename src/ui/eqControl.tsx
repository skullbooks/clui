import { Layout, Space, Menu, theme, Card } from 'antd';
import { Knob } from 'primereact/knob';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { FaderBlockType, FaderBankKnobMode } from '../interfaces/states';
import { HwChannel, MasterChannel } from 'soundcraft-ui-connection';
import RoundDisplay, { RoundDisplayMode } from '../components/roundDisplay';

function EqControl({mixer}:{
  mixer:any
}) {

  const { Sider, Content } = Layout;

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
    <Card title="Parametric EQ" bordered={false} style={{ width: 300 }}>
        <RoundDisplay value={gain} min={0} max={100} displaySize={300} zero={-150} width={60} valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} displaySize={180} zero={-90} strokeWidth={20} height={80} valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} displaySize={160} zero={-80} width={100} height={50} valueColor={token.colorPrimary} rangeColor={token.colorFillContentHover}/>

        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={300} zero={-150} width={60} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} strokeWidth={20} height={80} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={160} zero={-80} width={100} height={50} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>

        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.CenterBar} displaySize={300} zero={-150} width={60} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.CenterBar} displaySize={180} zero={-90} strokeWidth={20} height={80} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover}/>
        <RoundDisplay value={gain} min={0} max={100} mode={RoundDisplayMode.CenterBar} displaySize={160} zero={-80} width={100} height={50} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover}/>
  </Card>
  );
}

export default EqControl;