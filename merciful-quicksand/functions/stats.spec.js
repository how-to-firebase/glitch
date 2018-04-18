/*global describe beforeAll it expect*/
const stats = require('./stats');
const admin = require('firebase-admin')
const serviceAccount = require('../.data/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://how-to-firebase-tutorials.firebaseio.com'
});



describe('Stats', () => {
  // Set up message ref and snapshot
  const messageRef = admin.database().ref('authenticated/react-chat/Test Room/test-record');
  const message = {
    "displayName": "Chris Esplin",
    "email": "chris@quiver.is",
    "message": "Let's try this again",
    "photoURL":
      "https://lh4.googleusercontent.com/-ly98tZeA6F0/AAAAAAAAAAI/AAAAAAAAADk/G-1n2ID9bOw/photo.jpg",
    "uid": "DNhXq7T4igfchsZDIhxBWbRquF03"
  };
  let snap;
  
  beforeAll(async () => {  
    await messageRef.set(message);
    
    snap = await messageRef.once('value');
  });
  
  // Set context
  let context;
  beforeAll(() => {
    context = {
      "timestamp": "2018-03-20T11:27:57.893Z",
      "auth": {
        "uid": "DNhXq7T4igfchsZDIhxBWbRquF03"
      },
      "params": { "room": "Test Room", "key": "test-record" }
    };
  });
  
  // reset stats
  const statsRef = admin.database().ref('stats/Test Room');
  beforeAll(async () => {
    await statsRef.remove();
  });
    
  let statsResult, userStatsResult;
  beforeAll(async () => {
    await stats(snap, context);
    [statsResult, userStatsResult] = await stats(snap, context);
  });
  
  it('should initialize', () => {
    expect(typeof stats).toEqual('function');
  });
  
  it('should increment chat count', () => {
    const stats = statsResult.snapshot.val();
    expect(stats.count).toEqual(2);
  });
  
  it('should increment user chat count', () => {
    const userStats = userStatsResult.snapshot.val();
    expect(userStats).toEqual({ count: 2, lastActive: context.timestamp, lastMessage: message.message });
  });
});