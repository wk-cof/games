import type { EventType } from '../hooks/useToddlerInput';

class SynthEngine {
    private ctx: AudioContext | null = null;
    private maxVoices = 6;
    private activeVoices = 0;

    public init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public play(yPercent: number, type: EventType) {
        if (!this.ctx) return;
        if (this.activeVoices >= this.maxVoices) return; // Prevent blowout on mash

        this.activeVoices++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Map Y% (0-100) to pitch frequency. 
        // 0 is top (high pitch). 100 is bottom (low pitch).
        // Frequency range: 200Hz to 1000Hz approx.
        const baseFreq = Math.max(150, 1000 - (yPercent * 8.5));
        let duration = 1.5;

        switch (type) {
            case 'modifier':
                osc.type = 'triangle';
                osc.frequency.value = baseFreq * 0.8;
                duration = 2.0;
                break;
            case 'spacebar':
                osc.type = 'sine';
                osc.frequency.value = 100; // Deep boom
                duration = 2.5;
                break;
            case 'supernova':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 3.0);
                duration = 3.5;
                break;
            case 'standard':
            default:
                osc.type = 'sine';
                osc.frequency.value = baseFreq;
                duration = 1.5;
                break;
        }

        // Envelope
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.05); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration); // Decay

        osc.start();
        osc.stop(this.ctx.currentTime + duration);

        // Release voice when done
        osc.onended = () => {
            this.activeVoices--;
            osc.disconnect();
            gain.disconnect();
        };
    }
}

// Export singleton
export const synthEngine = new SynthEngine();
