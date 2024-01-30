"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type GameObject = {
  currentPlayer: number;
  stack: string[];
  deck: string[];
  hands: string[][];
};

const initValues = {
  currentPlayer: 0,
  stack: ["3"],
  deck: ["1", "2", "3", "1", "2", "2", "1", "3"],
  hands: [["1", "2", "3"], ["3", "1"], ["3"]],
};

export default function Home() {
  const [gameObject, setGameObject] = useState<GameObject>(initValues);

  // Define the function playCard with index as a parameter
  const playCard = (index: number): void => {
    // Destructure properties from gameObject for easier access
    const { hands, currentPlayer, stack } = gameObject;

    // Parse the current player's card and the top card of the stack
    const currentCard = parseInt(hands[currentPlayer][index]);
    const topStackCard = parseInt(stack[0]);

    // Define the conditions for a valid card play
    const isValidPlay =
      currentCard === topStackCard ||
      currentCard === topStackCard + 1 ||
      (topStackCard === 3 && currentCard === 1);

    // If the play is not valid, return early
    if (!isValidPlay) return;

    // Create a new stack with the current card at the top
    const newStack = [hands[currentPlayer][index], ...stack];

    // Create a new set of hands without the played card
    const newHands = hands.map((hand, playerIndex) =>
      playerIndex === currentPlayer
        ? hand.filter((_, cardIndex) => cardIndex !== index)
        : hand
    );

    // Determine the next player
    const nextPlayer = (currentPlayer + 1) % hands.length;

    // Update the game object state
    setGameObject({
      ...gameObject,
      currentPlayer: nextPlayer,
      stack: newStack,
      hands: newHands,
    });

    // If the current player has no cards left, they win!
    if (newHands[currentPlayer].length === 0) {
      toast(`Player ${currentPlayer} wins!`);
    }
  };

  // Define a function to shuffle an array
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const takeCard = () => {
    // Use destructuring to create copies of the deck, hands, and stack
    let { deck: newDeck, hands: newHands, stack: newStack } = { ...gameObject };

    // Check if the deck is empty
    if (newDeck.length === 0) {
      // If the deck is empty, shuffle the stack (excluding the first card) and use it as the new deck
      newDeck = shuffleArray(newStack.slice(1));
      newStack = newStack.slice(0, 1);
    }

    // Add the top card of the deck to the current player's hand
    newHands[gameObject.currentPlayer].push(newDeck[0]);

    // Sort the current player's hand
    newHands[gameObject.currentPlayer].sort();

    // Remove the top card from the deck
    newDeck.shift();

    // Determine the next player
    const nextPlayer =
      gameObject.currentPlayer + 1 === gameObject.hands.length
        ? 0
        : gameObject.currentPlayer + 1;

    // Update the game object
    setGameObject({
      ...gameObject,
      currentPlayer: nextPlayer,
      deck: newDeck,
      hands: newHands,
      stack: newStack,
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="text-6xl p-3">Lama</div>
      <div className="flex gap-4">
        <div className="border  m-auto p-6 text-9xl rounded shadow-2xl shadow-sky-950 ">
          {gameObject.stack[0]}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 justify-between p-4 ">
        {gameObject.hands.map((_, index) => (
          <div
            className={`${
              gameObject.currentPlayer === index ? "border-sky-950" : ""
            }  p-4 relative border rounded`}
          >
            <div className="text-xs absolute top-2 right-2 ">User {index}</div>
            <div className="grid col-auto gap-4 items-center">
              {gameObject.hands[index].map((card, i) => (
                <button
                  className="border p-5 rounded text-xl hover:bg-neutral-800/50 cursor-pointer"
                  key={i}
                  onClick={() => playCard(i)}
                  disabled={gameObject.currentPlayer !== index}
                >
                  {card}
                </button>
              ))}
            </div>
            {gameObject.currentPlayer === index && (
              <Button onClick={takeCard} className="w-full h-9 mt-4">
                Take card
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
