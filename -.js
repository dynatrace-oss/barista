function (preview, force) {
        if (firstSignal === false) {
            //There are no actions to be sent, but maybe we have to send some events?
            if (!this.currentBeacon) {
                this.currentBeacon = new Beacon();
            }
            //#IF APM
            //Add the current ServerID to the signal, so the javaagent/ws agent can decide where to send this beaconsignal
            if (getNumericConfigValue('bp') == 1) {
                this.currentBeacon['a'](serverIdParamKey, coreAgent['gcSId'](), false);
            }
            //#ENDIF
            if (config['bs']) {
                this.currentBeacon['a']('bs', '1', false);
            }
            onlyExecuteIfEnabled(callSendSignalListeners, [preview, force, this];
            //Has a new value been added with a SendSignalListener?
            if (!this.currentBeacon['sts']()) {
                this.currentBeacon = null;
            }
        }
    }