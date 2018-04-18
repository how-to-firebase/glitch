module.exports = function stats(snap, context) {
  const { timestamp } = context;
  const { room, key } = context.params;
  const { uid } = context.auth;
  const { message } = snap.val();

  const statsRef = snap.ref.root.child(`stats/${room}`);
  const userStatsRef = statsRef.child('users').child(uid);

  const statsPromise = statsRef.transaction(stats => {
    if (!stats) {
      stats = {}
    }

    if (!stats.count) {
      stats.count = 0; 
    }

    stats.count += 1;

    return stats;
  });
  
  const userStatsPromise = userStatsRef.transaction(userStats => {
    if (!userStats) {
      userStats = {};
    }

    if (!userStats.count) {
      userStats.count = 0;
    }

    userStats.count += 1;
    userStats.lastActive = timestamp;
    userStats.lastMessage = message;
    return userStats;
  });
  
  return Promise.all([statsPromise, userStatsPromise]);
} 

// Context sample
// {
//   "eventId": "eb6H4zSgQABVKKifYOV24u0+Z0k=",
//   "timestamp": "2018-03-20T11:27:57.893Z",
//   "eventType": "google.firebase.database.ref.create",
//   "resource": {
//     "service": "firebaseio.com",
//     "name":
//       "projects/_/instances/how-to-firebase-tutorials/refs/authenticated/react-chat/Default Chat Room/-L829b5QxEoINb1ft39v"
//   },
//   "authType": "USER",
//   "auth": {
//     "uid": "DNhXq7T4igfchsZDIhxBWbRquF03",
//     "token": {
//       "name": "Chris Esplin",
//       "email_verified": true,
//       "email": "chris@quiver.is",
//       "exp": 1521548871,
//       "user_id": "DNhXq7T4igfchsZDIhxBWbRquF03",
//       "picture":
//         "https://lh4.googleusercontent.com/-ly98tZeA6F0/AAAAAAAAAAI/AAAAAAAAADk/G-1n2ID9bOw/photo.jpg",
//       "iat": 1521545271,
//       "sub": "DNhXq7T4igfchsZDIhxBWbRquF03",
//       "aud": "how-to-firebase-tutorials",
//       "auth_time": 1521545271,
//       "iss": "https://securetoken.google.com/how-to-firebase-tutorials",
//       "firebase": {
//         "identities": { "google.com": ["116279478330828791198"], "email": ["chris@quiver.is"] },
//         "sign_in_provider": "google.com"
//       }
//     }
//   },
//   "params": { "room": "Default Chat Room", "key": "-L829b5QxEoINb1ft39v" }
// }
