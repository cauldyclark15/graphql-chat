import React, { Component } from 'react';

import Chatbox from './Chatbox';

class ChatContainer extends Component {
  componentDidMount() {
    this.props.subscribeToMoreChat();
  }

  componentDidUpdate() {
    this.boxRef.scrollTop = this.boxRef.scrollHeight;
  }

  render() {
    const { chats } = this.props;

    return (
      <div
        ref={node => {
          this.boxRef = node;
        }}
        style={{
          overflow: 'auto',
          height: 600,
          marginBottom: 50
        }}
      >
        {chats.map(message => <Chatbox key={message.id} message={message} />)}
      </div>
    );
  }
}

export default ChatContainer;
