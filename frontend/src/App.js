import { Route } from 'react-router-dom';
import './App.css';
import Chatpage from './Pages/Chatpage.js';
import Homepage from './Pages/Homepage.js';
function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
/* When we write in this manner and try to hit 
http://localhost:3000/chats 
- It will give Homepage and chatpage content 
<Route path="/" component={Homepage} />
<Route path="/chats" component={Chatpage} />
- solution 
use exact keyword with Homepage
<Route path="/" component={Homepage} exact/>
*/