"use strict";
// Fix for inquirer trapping SIGINT
// See: https://github.com/SBoudrias/Inquirer.js/issues/293#issuecomment-422890996
Object.defineProperty(exports, "__esModule", { value: true });
class SignalRef {
    constructor(signal, handler) {
        this.signal = signal;
        this.handler = handler;
        process.on(this.signal, this.handler);
        // This will run a no-op function every 10 seconds.
        // This is to keep the event loop alive, since a
        // signal handler otherwise does _not_. This is the
        // fundamental difference between using `process.on`
        // directly and using a SignalRef instance.
        this.interval = setInterval(() => { }, 10000);
    }
    unref() {
        clearInterval(this.interval);
        process.removeListener(this.signal, this.handler);
    }
}
exports.SignalRef = SignalRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbmFsUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2lnbmFsUmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7QUFDbkMsa0ZBQWtGOztBQUVsRixNQUFhLFNBQVM7SUFJbEIsWUFBWSxNQUFNLEVBQUUsT0FBTztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUV0QixPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXJDLG1EQUFtRDtRQUNuRCxnREFBZ0Q7UUFDaEQsbURBQW1EO1FBQ25ELG9EQUFvRDtRQUNwRCwyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFFRCxLQUFLO1FBQ0QsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM1QixPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3JELENBQUM7Q0FDSjtBQXRCRCw4QkFzQkMifQ==