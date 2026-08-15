import Login from './components/Login';
import App from './App';
import { useAdminStore } from './store/useAdminStore';

function Root() {
  const authed = useAdminStore((state) => state.authed);
  return authed ? <App /> : <Login />;
}

export default Root;
