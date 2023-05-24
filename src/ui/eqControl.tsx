import { Layout, Space, Menu, theme, Card } from 'antd';
import { Knob } from 'primereact/knob';
import { useEffect, useState } from 'react';
import { Subscription, SubscriptionLike } from 'rxjs';
import { FaderBlockType, FaderBankKnobMode } from '../interfaces/states';
import { Channel, HwChannel, MasterChannel, SoundcraftUI } from 'soundcraft-ui-connection';
import RoundDisplay, { RoundDisplayMode } from '../components/roundDisplay';

function EqControl({mixer, channel}:{
  mixer: SoundcraftUI
  channel: Channel
}) {

  const { Sider, Content } = Layout;

  const { useToken } = theme;
  const { token } = useToken();

  const [gain1, updateGain1] = useState(.5);
  const [gain2, updateGain2] = useState(.5);
  const [gain3, updateGain3] = useState(.5);
  const [gain4, updateGain4] = useState(.5);
  const [freq1, updateFreq1] = useState(.1);
  const [freq2, updateFreq2] = useState(.4);
  const [freq3, updateFreq3] = useState(.6);
  const [freq4, updateFreq4] = useState(.9);
  const [q1, updateQ1] = useState(.3);
  const [q2, updateQ2] = useState(.3);
  const [q3, updateQ3] = useState(.3);
  const [q4, updateQ4] = useState(.3);

  const [gain, updateGain] = useState(0);
  const [gainDB, updateGainDB] = useState('0');
  const [gainDisabled, disableGain] = useState(false);

  const hwChannel: HwChannel = mixer.hw(1);

  useEffect(() => {
    console.log("INIT EQ LISTENERS");
//    updateFaderLevel(0);
//    updateFaderLevelDB('0');
    updateGain1(0.5);
    updateGain2(0.5);
    updateGain3(0.5);
    updateGain4(0.5);
    updateFreq1(.1);
    updateFreq2(.4);
    updateFreq3(.6);
    updateFreq4(.9);
    updateQ1(.3);
    updateQ2(.3);
    updateQ3(.3);
    updateQ4(.3);

    updateGain(0);
    const subscriptions: SubscriptionLike[] = [];

    let a = channel;

    subscriptions.push(channel.eqBand1Frequency$.subscribe(value => { updateFreq1(value*100);}))
    subscriptions.push(channel.eqBand1Gain$.subscribe(value => { updateGain1(value*100);}))
    subscriptions.push(channel.eqBand1Q$.subscribe(value => { updateQ1(value*100);}))

    subscriptions.push(channel.eqBand2Frequency$.subscribe(value => { updateFreq2(value*100);}))
    subscriptions.push(channel.eqBand2Gain$.subscribe(value => { updateGain2(value*100);}))
    subscriptions.push(channel.eqBand2Q$.subscribe(value => { updateQ2(value*100);}))

    subscriptions.push(channel.eqBand3Frequency$.subscribe(value => { updateFreq3(value*100);}))
    subscriptions.push(channel.eqBand3Gain$.subscribe(value => { updateGain3(value*100);}))
    subscriptions.push(channel.eqBand3Q$.subscribe(value => { updateQ3(value*100);}))

    subscriptions.push(channel.eqBand4Frequency$.subscribe(value => { updateFreq4(value*100);}))
    subscriptions.push(channel.eqBand4Gain$.subscribe(value => { updateGain4(value*100);}))
    subscriptions.push(channel.eqBand4Q$.subscribe(value => { updateQ4(value*100);}))


//    (channel.name$) ? subscriptions.push(channel.name$.subscribe(value => { updateChannelName(`${value}`);})) : updateChannelName('Master');
//    if (channel.mute$) {
//    subscriptions.push(channel.faderLevel$.subscribe(value => { updateFaderLevel(value);}));
    // eslint-disable-next-line eqeqeq
//    subscriptions.push(channel.faderLevelDB$.subscribe(value => { updateFaderLevelDB((value.toString() == '-Infinity' ) ? '-∞' : `${value}`); }));
    if (hwChannel) {
      subscriptions.push(hwChannel.gain$.subscribe(value => { updateGain(value*100);}))
      subscriptions.push(hwChannel.gainDB$.subscribe(value => { updateGainDB(`${value}`);}));
      disableGain(false);
    } else disableGain(true);

    return () => { 
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
    <Card title="Parametric EQ" bordered={false}>
        <Space size="large">
            <Space direction="vertical" align="center">
                <div style={{ position: 'relative' }}><RoundDisplay value={freq1} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorSuccessActive} rangeColor={token.colorFillContentHover}/>
                <RoundDisplay value={120-q1} min={0} max={120} mode={RoundDisplayMode.CenterBar} displaySize={170} zero={-86} width={80} height={50} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover} style={{ bottom: -8, left: '25%', position: 'absolute' }}/></div>
                <div>Knob 1</div>
                <div>Knob 2</div>
                <RoundDisplay value={gain1} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
                <div>Knob 3</div>
            </Space>
            <Space direction="vertical" align="center">
            <div style={{ position: 'relative' }}><RoundDisplay value={freq2} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorSuccessActive} rangeColor={token.colorFillContentHover}/>
                <RoundDisplay value={120-q2} min={0} max={120} mode={RoundDisplayMode.CenterBar} displaySize={170} zero={-86} width={80} height={50} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover} style={{ bottom: -8, left: '25%', position: 'absolute' }}/></div>
                <div>Knob 1</div>
                <div>Knob 2</div>
                <RoundDisplay value={gain2} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
                <div>Knob 3</div>
            </Space>
            <Space direction="vertical" align="center">
            <div style={{ position: 'relative' }}><RoundDisplay value={freq3} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorSuccessActive} rangeColor={token.colorFillContentHover}/>
                <RoundDisplay value={120-q3} min={0} max={120} mode={RoundDisplayMode.CenterBar} displaySize={170} zero={-86} width={80} height={50} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover} style={{ bottom: -8, left: '25%', position: 'absolute' }}/></div>
                <div>Knob 1</div>
                <div>Knob 2</div>
                <RoundDisplay value={gain3} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
                <div>Knob 3</div>
            </Space>
            <Space direction="vertical" align="center">
            <div style={{ position: 'relative' }}><RoundDisplay value={freq4} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorSuccessActive} rangeColor={token.colorFillContentHover}/>
                <RoundDisplay value={120-q4} min={0} max={120} mode={RoundDisplayMode.CenterBar} displaySize={170} zero={-86} width={80} height={50} valueColor={token.colorWarning} rangeColor={token.colorFillContentHover} style={{ bottom: -8, left: '25%', position: 'absolute' }}/></div>
                <div>Knob 1</div>
                <div>Knob 2</div>
                <RoundDisplay value={gain4} min={0} max={100} mode={RoundDisplayMode.Point} displaySize={180} zero={-90} width={150} height={80} valueColor={token.colorError} rangeColor={token.colorFillContentHover}/>
                <div>Knob 3</div>
            </Space>
        </Space>
  </Card>
  );
}

export default EqControl;