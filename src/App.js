import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ChatContainer from './ChatContainer';
import './App.css';

const ALL_CHATS_QUERY = gql`
  query allChats {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation createChat($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      createdAt
      from
      content
    }
  }
`;

const CHAT_SUBSCRIPTION = gql`
  subscription {
    Chat(filter: { mutation_in: [CREATED] }) {
      node {
        id
        from
        content
        createdAt
      }
    }
  }
`;

class App extends Component {
  state = {
    from: 'anonymous',
    content: ''
  };

  componentDidMount() {
    const from = window.prompt('username');
    from && this.setState({ from });
  }

  render() {
    const { content, from } = this.state;
    return (
      <Query query={ALL_CHATS_QUERY}>
        {({ data, loading, refetch, subscribeToMore }) => (
          <div className="App">
            <div className="container">
              <h2>Chats</h2>
              <div>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <ChatContainer
                    chats={data.allChats || []}
                    subscribeToMoreChat={() =>
                      subscribeToMore({
                        document: CHAT_SUBSCRIPTION,
                        updateQuery: (previous, { subscriptionData }) => {
                          if (!subscriptionData.data) return previous;
                          const newChatLinks = [
                            ...previous.allChats,
                            subscriptionData.data.Chat.node
                          ];
                          const result = {
                            ...previous,
                            allChats: newChatLinks
                          };
                          return result;
                        }
                      })
                    }
                  />
                )}
              </div>
              <Mutation
                mutation={CREATE_CHAT_MUTATION}
                variables={{ content, from }}
              >
                {(createChat, { loading, data }) => (
                  <div>
                    <input
                      value={content}
                      onChange={e => this.setState({ content: e.target.value })}
                      type="text"
                      placeholder="Start typing"
                      onKeyPress={async e => {
                        if (e.charCode === 13) {
                          await createChat();
                          this.setState({ content: '' });
                        }
                      }}
                    />
                  </div>
                )}
              </Mutation>
            </div>
          </div>
        )}
      </Query>
    );
  }
}

export default App;
