import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes';
import { store } from '@/store';
import './App.css';
import './index.css';




function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
