import { AbstractManager } from '../utils';

class WebhookManager extends AbstractManager {
  async handleMessage(senderID: string, appID: string, message: string): Promise<any[]> {
    const { axios } = this.clients;
    const versionID = this.getVersionID(appID);
    const state = this.getState(senderID, appID);
    const request = {
      type: 'text',
      payload: message,
    };

    const runtimeReq = {
      state,
      request,
    };
    const result = (await axios.post(`/interact/${versionID}`, runtimeReq)) as any;
    const retArr: any[] = [];
    result.trace.forEach((trace: any) => {
      if (trace.type === 'speak' && trace.payload.type === 'message') {
        retArr.push({
          text: trace.payload.message,
        });
      }
    });
    return retArr;
  }

  async getVersionID(_appID: string) {
    // TODO: Call state store to get the messenger app/versionID map
    return '6000dcbcc668b50006399b9a';
  }

  async newSession(appID: string) {
    const { axios } = this.clients;
    const versionID = this.getVersionID(appID);
    const initiateSession = {
      state: {
        stack: [
          {
            diagramID: this.getVersionID(appID),
            storage: {},
            variables: {},
          },
        ],
        turn: {},
        storage: {},
        variables: {
          timestamp: 0,
          sessions: 1,
          user_id: 'TEST_USER',
          platform: 'general',
        },
      },
      request: null,
    };

    // POST to general-runtime
    const { state } = (await axios.post(`/interact/${versionID}`, initiateSession)) as any;
    return state;
  }

  // Fetch the conversation state from persistence
  async getState(senderID: string, appID: string) {
    const { kvstore } = this.clients;
    const stateKey = `${appID}-${senderID}`;
    const result = await kvstore.get(stateKey);
    if (!result) {
      // No prior state; create new state
      const newSessionState = await this.newSession(appID);
      kvstore.set(stateKey, newSessionState);
      return newSessionState;
    }
    return result;
  }
}

export default WebhookManager;
