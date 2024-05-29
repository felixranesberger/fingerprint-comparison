import './style.css'
import {getCurrentBrowserFingerPrint} from '@rajesh896/broprint.js'
import { getFingerprint, setOption } from '@thumbmarkjs/thumbmarkjs'
import Fingerprint2 from '@fingerprintjs/fingerprintjs'

function updateFingerprintValue(method: string, value: string) {
    const element = document.getElementById(`${method}-value`);
    if (!element) throw new Error(`Element with id ${method}-value not found`);
    element.innerHTML = value;
}

(async () => {
    // fingerprint using broprint
    const broprintFingerprint = await getCurrentBrowserFingerPrint();
    console.log(1716989726842, broprintFingerprint);
    updateFingerprintValue('broprint', broprintFingerprint);

    // fingerprint using thumbmarkjs
    setOption('exclude', ['system.browser.version'])
    const thumbmarkFingerprint = await getFingerprint();
    updateFingerprintValue('thumbmark', thumbmarkFingerprint['hash'] ? thumbmarkFingerprint['hash'] : thumbmarkFingerprint);

    // fingerprint using fingerprintjs v3
    const { load: loadFingerprintJS } = await import('https://openfpcdn.io/fingerprintjs/v3');
    const { get: getFingerprintJSHash } = await loadFingerprintJS();
    const fingerprintJSFingerprint = await getFingerprintJSHash();
    updateFingerprintValue('fingerprintjsv3', fingerprintJSFingerprint.visitorId);

    // fingerprint using fingerprintjs v2
    requestIdleCallback(() => {
        Fingerprint2.get((components: { value: string}[] ) => {
            const values = components.map(component => component.value)
            const murmurHash = Fingerprint2.x64hash128(values.join(''), 31)
            updateFingerprintValue('fingerprintjsv2', murmurHash)
        })
    })
})();