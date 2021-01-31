import VError from '@voiceflow/verror';

import logger from '@/logger';
import { Request, Response } from '@/types';

import { AbstractController, route } from '../utils';

class WebhookController extends AbstractController {
  @route()
  async get(req: Request, res: Response) {
    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === this.config.VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        logger.info('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      }
      // Responds with '403 Forbidden' if verify tokens do not match
      throw new VError('Forbidden', VError.HTTP_STATUS.FORBIDDEN);
    } else {
      // Boilerplate GET response
      return 'ok';
    }
  }

  @route()
  async post(req: Request) {
    const { webhookManager } = this.services;

    const { body } = req;
    if (body.object !== 'page') {
      throw new VError('Not Found', VError.HTTP_STATUS.NOT_FOUND);
    }

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach((entry: any) => {
      // Gets the body of the webhook event
      const webhookEvent = entry.messaging[0];

      // Discard uninteresting events
      if ('read' in webhookEvent) {
        // console.log("Got a read event");
        return;
      }

      if ('delivery' in webhookEvent) {
        // console.log("Got a delivery event");
        return;
      }

      // SenderID -> Who is interacting with the app?
      // AppID -> What is the target "skill"?
      // Message -> Text
      return webhookManager.handleMessage(webhookEvent.sender.id, webhookEvent.recipient.id, webhookEvent.message.text);
    });

    return 'EVENT_RECEIVED';
  }
}

export default WebhookController;
