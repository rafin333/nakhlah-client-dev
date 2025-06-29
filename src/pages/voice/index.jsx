import React from 'react';
import { Volume2 } from 'lucide-react'
import { TextToSpeech } from '@/utils/textToSpeech';

function RVVoiceGen() {
    return (
        <div>
            <p type="button" onClick={() => TextToSpeech('ﻛِﺘَﺎﺏ')} className="pt-3 pb-1 px-3" style={{ cursor: "pointer", maxWidth: "15px" }}>
                <i className="fa fa-volume-up"></i>
                <Volume2 />
            </p>
        </div>
    )
}

export default RVVoiceGen
