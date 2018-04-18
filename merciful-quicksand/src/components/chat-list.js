import React from 'react';
import ReactDOM from 'react-dom';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

export default class ChatList extends React.Component { 
  componentDidUpdate() {
    const { messages } = this.props;
    
    if (messages.length != this.messagesLength) {
      this.scrollDown();
      this.messagesLength = messages.length;
    }
  }
  
  scrollDown() {
    const chatList = ReactDOM.findDOMNode(this.refs.chatList)
    
    setTimeout(() => chatList.scrollTop = chatList.scrollHeight, 100);
  }
  
  render () {
    const { currentUser, room, messages } = this.props;
    
    return (<div id="chatList" ref="chatList">
     <List className="chatListSubheader" subheader={<ListSubheader component="div">{room}</ListSubheader>}>
       {getListItems(currentUser, messages)}
     </List>
    </div>);
  }
}
          
function getListItems(currentUser, messages) {
  return messages.map(({ uid, email, displayName, photoURL, message }, i) => {
    const isCurrentUser = currentUser.uid == uid;
    
    return (
      <ListItem key={i} primary={message} >
         <Avatar src={photoURL} />
        <ListItemText primary={message} />
      </ListItem>
    );
  });
}