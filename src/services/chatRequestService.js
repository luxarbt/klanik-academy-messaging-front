export default class ChatRequestManager {
  static myInstance = null;

  _chatRequests = [];

  /**
   * @returns {ChatRequestManager}
   */
  static getInstance() {
    if (ChatRequestManager.myInstance == null) {
      ChatRequestManager.myInstance = new ChatRequestManager();
    }

    return this.myInstance;
  }

  getChatRequests() {
    return this._chatRequests;
  }

  setChatRequests(chatRequests) {
    this._chatRequests = chatRequests;
  }
}
