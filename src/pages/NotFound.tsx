
const NotFound = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 md:p-8">
        
        {/* Text Content */}
        <div className="flex-1 md:pr-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-5">
            So Sorry!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-3">
            The page you are looking for cannot be found.
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-3">
            Possible Reasons:
          </p>
          
          <ul className="list-disc pl-5 mb-5 space-y-1">
            <li className="text-sm md:text-base text-gray-700">
              The address may have been typed incorrectly.
            </li>
            <li className="text-sm md:text-base text-gray-700">
              It may be a broken or outdated link.
            </li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-5 py-2 text-sm md:text-base bg-transparent border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              Go to Home page
            </button>
            <button className="px-5 py-2 text-sm md:text-base bg-transparent border border-gray-500 text-gray-500 rounded hover:bg-gray-500 hover:text-white transition-colors duration-200">
              Help
            </button>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex-1 text-center mb-5 md:mb-0">
          <img 
            src="https://res.cloudinary.com/dj9r2qksh/image/upload/v1748403508/404_vhwnlb.png" 
            alt="Error Illustration" 
            className="max-w-full h-auto w-3/5 md:w-4/5 mx-auto"
          />
        </div>
        
      </div>
    </div>
  );
}

export default NotFound