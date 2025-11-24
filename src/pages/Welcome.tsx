import { useConnection } from "@/context/ConnectionContext";
import { generateRandomId } from "@/utils/number";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type CollabOperation = "join" | "create";

const Welcome = () => {
  const [activeOperation, setActiveOperation] =
    useState<CollabOperation>("create");
  const [name, setName] = useState("");
  const [deckId, setDeckId] = useState("");
  const navigate = useNavigate();
  const { setUserName } = useConnection();
  const { deckId: paramDeckId } = useParams();
  const [searchParams] = useSearchParams();

  const randomId = generateRandomId(6);

  const handleSubmit = () => {
    setUserName(name);

    const permissibleSlides = searchParams.get("permissibleSlides");
    if (deckId && activeOperation === "join") {
      navigate(`/deck/${deckId}?permissibleSlides=${permissibleSlides}`);
    } else {
      navigate(`/deck/${randomId}?permissibleSlides=all`);
    }
  };

  const handleSelectOperation = (op: CollabOperation) => {
    setActiveOperation(op);
  };

  useEffect(() => {
    if (paramDeckId) {
      setDeckId(paramDeckId);
      setActiveOperation("join");
    }
  }, [paramDeckId]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-8xl text-amber-500 uppercase font-medium mb-8">
        S<span className="text-6xl text-gray-300">lide</span> E
        <span className="text-6xl text-gray-300">ditor</span>
      </h1>
      <h2 className="text-4xl text-gray-100 mb-5">Welcome User!</h2>
      <h3 className="text-2xl text-amber-500 text-center mb-10">
        Before we start, let's get some information
      </h3>

      <div className="flex justify-center mb-5">
        <button
          className={`cursor-pointer px-8 py-2 border-2 ${
            activeOperation === "create"
              ? "bg-amber-500 border-amber-600 text-gray-800"
              : "bg-transparent border-gray-700 text-gray-200 hover:bg-amber-500/90 hover:text-gray-800"
          } focus-visible:outline-none duration-200 ease-in-out transition-colors text-xl font-medium uppercase rounded-tl-md`}
          onClick={() => {
            handleSelectOperation("create");
          }}
        >
          Create Deck
        </button>
        <button
          className={`cursor-pointer px-8 py-2 border-2 ${
            activeOperation === "join"
              ? "bg-amber-500 border-amber-600 text-gray-800"
              : "bg-transparent border-gray-700 text-gray-200 hover:bg-amber-500/90 hover:text-gray-800"
          } focus-visible:outline-none duration-200 ease-in-out transition-colors text-xl font-medium uppercase rounded-br-md`}
          onClick={() => {
            handleSelectOperation("join");
          }}
        >
          Join Deck
        </button>
      </div>
      <div className="flex flex-col items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter your Name here ..."
          className="border-b-2 text-xl text-gray-100 px-4 py-2 focus-visible:outline-none focus-visible:border-blue-500 transition-colors duration-200 ease-in-out text-center"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {activeOperation === "join" && (
          <input
            type="text"
            placeholder="Enter Deck ID here ..."
            className="border-b-2 text-xl text-gray-100 disabled:text-gray-300 px-4 py-2 focus-visible:outline-none focus-visible:border-blue-500 transition-colors duration-200 ease-in-out text-center"
            maxLength={6}
            onChange={(e) => {
              setDeckId(e.target.value);
            }}
            value={deckId}
            disabled={!!paramDeckId}
          />
        )}
      </div>

      <div className="flex justify-center mt-5">
        <button
          className="cursor-pointer px-10 py-3 border-2 transition-colors ease-in-out duration-200 text-xl uppercase rounded-sm bg-transparent border-gray-500 text-gray-100 hover:bg-amber-500 hover:text-gray-800 hover:border-amber-700"
          onClick={handleSubmit}
        >
          {activeOperation === "join" ? "Join Deck" : "Create Deck"}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
