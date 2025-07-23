import React, { useState, useCallback, useMemo, useRef, useContext, useEffect, createContext } from 'react';

// Theme Context cho useContext example
const ThemeContext = createContext();

// Custom Hook: useCounter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

// Custom Hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Component con để demo useCallback
const ChildComponent = React.memo(({ onButtonClick, data }) => {
  console.log('ChildComponent rendered');
  
  return (
    <div className="border p-4 mb-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Child Component (React.memo)</h3>
      <p>Data: {data}</p>
      <button 
        onClick={onButtonClick}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Click me from child
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Check console - component chỉ re-render khi props thay đổi
      </p>
    </div>
  );
});

// Component chính
function AdvancedHooksDemo() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState(['apple', 'banana', 'orange']);
  const [searchTerm, setSearchTerm] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  
  // Theme từ context
  const theme = useContext(ThemeContext);
  
  // Custom hooks
  const { count, increment, decrement, reset } = useCounter(0);
  const [savedText, setSavedText] = useLocalStorage('demo-text', '');

  // useRef examples
  const inputRef = useRef(null);
  const renderCountRef = useRef(0);
  const previousSearchTerm = useRef('');

  // Track renders
  useEffect(() => {
    renderCountRef.current += 1;
    setRenderCount(renderCountRef.current);
  });

  // useCallback - Function chỉ tạo mới khi count thay đổi
  const handleChildClick = useCallback(() => {
    console.log('Button clicked from child, current count:', count);
    increment();
  }, [count, increment]);

  // useCallback - Function không bao giờ thay đổi
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // useMemo - Expensive calculation chỉ chạy khi items hoặc searchTerm thay đổi
  const filteredItems = useMemo(() => {
    console.log('Filtering items...'); // Check console để thấy khi nào chạy
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // useMemo - Expensive stats calculation
  const itemStats = useMemo(() => {
    console.log('Calculating stats...');
    const totalItems = items.length;
    const filteredCount = filteredItems.length;
    const averageLength = items.reduce((sum, item) => sum + item.length, 0) / totalItems;
    
    return {
      totalItems,
      filteredCount,
      averageLength: averageLength.toFixed(1)
    };
  }, [items, filteredItems]);

  // Track previous search term với useRef
  useEffect(() => {
    previousSearchTerm.current = searchTerm;
  }, [searchTerm]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems(prev => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Advanced React Hooks Demo</h1>
      
      <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
        <p>Render count: {renderCount} | Theme: {theme}</p>
        <p>Previous search: "{previousSearchTerm.current}"</p>
      </div>

      {/* useRef Example */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">1. useRef Example</h2>
        <div className="flex gap-2 mb-2">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something..."
            className="border px-3 py-2 rounded flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button 
            onClick={focusInput}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Focus Input
          </button>
          <button 
            onClick={addItem}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Item
          </button>
        </div>
        <p className="text-sm text-gray-600">useRef để access DOM element và store mutable values</p>
      </section>

      {/* useCallback Example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. useCallback Example</h2>
        <ChildComponent 
          onButtonClick={handleChildClick}
          data={`Count: ${count}`}
        />
        <div className="flex gap-2">
          <button onClick={increment} className="bg-blue-500 text-white px-3 py-1 rounded">+</button>
          <button onClick={decrement} className="bg-red-500 text-white px-3 py-1 rounded">-</button>
          <button onClick={reset} className="bg-gray-500 text-white px-3 py-1 rounded">Reset</button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          useCallback ngăn child component re-render không cần thiết
        </p>
      </section>

      {/* useMemo Example */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">3. useMemo Example</h2>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items..."
          className="border px-3 py-2 rounded mb-3 w-full"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Filtered Items:</h3>
            <ul className="list-disc list-inside">
              {filteredItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Stats (useMemo):</h3>
            <ul className="space-y-1">
              <li>Total items: {itemStats.totalItems}</li>
              <li>Filtered: {itemStats.filteredCount}</li>
              <li>Avg length: {itemStats.averageLength}</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Check console - useMemo chỉ tính toán lại khi dependencies thay đổi
        </p>
      </section>

      {/* Custom Hooks Example */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">4. Custom Hooks Example</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold">useCounter Hook:</h3>
          <p>Count: {count}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">useLocalStorage Hook:</h3>
          <input
            value={savedText}
            onChange={(e) => setSavedText(e.target.value)}
            placeholder="This will be saved to localStorage"
            className="border px-3 py-2 rounded w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Text được tự động lưu vào localStorage
          </p>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="p-4 bg-yellow-100 text-yellow-800 rounded">
        <h3 className="font-semibold mb-2">🚀 Performance Tips:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>useCallback: Dùng khi pass function xuống child components</li>
          <li>useMemo: Dùng cho expensive calculations hoặc complex objects</li>
          <li>useRef: Dùng để access DOM hoặc store values không trigger re-render</li>
          <li>React.memo: Wrap child components để tránh unnecessary re-renders</li>
          <li>Custom hooks: Tách logic để reuse giữa components</li>
        </ul>
      </section>
    </div>
  );
}

// Theme Provider Component
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className="min-h-screen">
        <div className="text-center py-4 bg-gray-100">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Toggle Theme ({theme})
          </button>
          <p className="text-sm text-gray-600 mt-2">useContext example - theme được share xuống components</p>
        </div>
        <AdvancedHooksDemo />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;