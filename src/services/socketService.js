export default class SocketManager {
  static myInstance = null;

  _socket = "";

  /**
   * @returns {SocketManager}
   */
  static getInstance() {
    if (SocketManager.myInstance == null) {
      SocketManager.myInstance = new SocketManager();
    }

    return this.myInstance;
  }

  getSocket() {
    return this._socket;
  }

  setSocket(socket) {
    this._socket = socket;
  }
}
