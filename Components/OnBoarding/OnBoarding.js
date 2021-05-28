import React from 'react';
import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// be carefully images correctly imported from right path
const img1 = require('../../assets/boarding1.png');
const img2 = require('../../assets/boarding2.png');
const img3 = require('../../assets/boarding3.png');
const img4 = require('../../assets/boarding4.png');

const OnBoarding = (props) => {
    return (
        <>
            <Onboarding
                onSkip={props.onLoadFunc}
                onDone={props.onLoadFunc}
                pages={[
                    {
                        backgroundColor: '#fff',
                        image: <Image source={img1} resizeMode="cover" style={{ width: 400, height: 200 }} />,
                        title: 'Registrati con una Email anonima',
                        subtitle: 'puoi inventare una email senza avere bisogno di confermarla',
                    },
                    {
                        backgroundColor: '#fff',
                        image: <Image source={img2} resizeMode="cover" style={{ width: 300, height: 200 }} />,
                        title: 'Genera la chiave RSA',
                        subtitle: 'Subito dopo esserti registrato ed aver effettuato il login, vai su impostazioni e genera la chiave. Una volta generata la chiave potrai iniziare ad avviare una conversazione end-to-end',
                    },
                    {
                        backgroundColor: '#fff',
                        image: <Image source={img3} resizeMode="cover" style={{ width: 300, height: 100 }} />,
                        title: 'Invia messaggi crittografati',
                        subtitle: 'avvia conversazioni private e sentiti libero di comunicare con messaggi crittografati e indecifrabili al 100%',
                    },
                    {
                        backgroundColor: '#5CCC9A',
                        image: <Image source={img4} resizeMode="cover" style={{ width: 500, height: 200 }} />,
                        title: 'Inizia',
                        subtitle: "Hai completato la guida, inizia ora!",
                    },
                ]}
            />
        </>
    );
};

export default OnBoarding;