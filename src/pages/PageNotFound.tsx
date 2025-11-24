import {MagnifyingGlassIcon} from '@heroicons/react/24/solid'

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        <MagnifyingGlassIcon className='size-36 text-amber-500 animate-bounce' />
        <h1 className="text-6xl text-amber-500 font-semibold uppercase"><span className="text-8xl">O</span>ops!</h1>
        <h3 className="text-2xl text-amber-600">The Page you are looking for, is Missing</h3>
      </div>
    </div>
  );
};

export default PageNotFound;
