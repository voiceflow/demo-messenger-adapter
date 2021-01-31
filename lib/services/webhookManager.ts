import { AbstractManager } from '../utils';

class WebhookManager extends AbstractManager {
  async handleMessage(senderID: string, appID: string, message: string): Promise<any> {
    const { runtimeAxios } = this.clients;
    const versionID = await this.getVersionID(appID);
    const state = await this.getState(senderID, appID);
    const request = {
      type: 'text',
      payload: message,
    };

    // Make call to general-runtime
    const runtimeReq = {
      state,
      request,
    };
    const result = (await runtimeAxios.post(`/interact/${versionID}`, runtimeReq)) as any;
    await this.saveState(senderID, appID, result.data.state);
    const token = await this.getPageToken(appID);
    result.data.trace.forEach(async (trace: any) => {
      if (trace.type === 'speak' && trace.payload.type === 'message') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try {
          const cleanText = WebhookManager.stripSSML(trace.payload.message);
          const sendResult = await this.callSendAPI(cleanText, senderID, token);
          // eslint-disable-next-line no-console
          console.log(sendResult);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      } else if (trace.type === 'end') {
        this.clearState(senderID, appID);
      }
    });

    return 'ok';
  }

  async newSession(appID: string) {
    const { runtimeAxios } = this.clients;
    const diagramID = await this.getDiagramID(appID);
    const versionID = await this.getVersionID(appID);
    const initiateSession = {
      state: {
        stack: [
          {
            diagramID,
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
    const result = (await runtimeAxios.post(`/interact/${versionID}`, initiateSession)) as any;
    return result.data.state;
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

  async saveState(senderID: string, appID: string, state: any) {
    const { kvstore } = this.clients;
    const stateKey = `${appID}-${senderID}`;
    return kvstore.set(stateKey, state);
  }

  // Clear the state info if the conversation has reached the end
  async clearState(senderID: string, appID: string) {
    const { kvstore } = this.clients;
    const stateKey = `${appID}-${senderID}`;
    await kvstore.delete(stateKey);
  }

  async callSendAPI(text: string, recipient: string, pageAccessToken: string) {
    const { messengerAxios } = this.clients;
    const reqBody = {
      message_type: 'RESPONSE',
      recipient: {
        id: recipient,
      },
      message: {
        text,
      },
    };
    return messengerAxios.post('/me/messages', reqBody, {
      params: {
        access_token: pageAccessToken,
      },
    });
  }

  static stripSSML(input: string) {
    const regex = /(<([^>]+)>)/gi;
    return input.replace(regex, '');
  }

  // TODO: The function stubs below should be replaced by actual config persistence for production.
  //       The program VersionID, diagramID, and the FB Messenger page tokens can be obtined during the initial "account linking" process.
  async getVersionID(_appID: string) {
    // TODO: Call state store to get the messenger app/versionID map
    return 'some_version_id';
  }

  async getDiagramID(_appID: string) {
    // TODO: Get a proper state store for this
    return 'some_diagram_id';
  }

  async getPageToken(_appID: string) {
    // TODO: persist page token
    return 'some_page_token';
  }
}

export default WebhookManager;
