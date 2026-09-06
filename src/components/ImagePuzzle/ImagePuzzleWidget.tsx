import { useState, useCallback } from 'react';
import { ImagePuzzle } from './ImagePuzzle';
import './ImagePuzzle.css';

export function ImagePuzzleWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Floating launcher button */}
      <button
        className="image-puzzle__floating-button"
        onClick={toggleModal}
        aria-label={isOpen ? 'Close image puzzle' : 'Open image puzzle'}
        aria-expanded={isOpen}
        aria-controls="image-puzzle-modal"
        title="Play Image Puzzle"
        type="button"
      >
        <span className="image-puzzle__floating-icon" aria-hidden={true}>🧩</span>
      </button>

      {/* Modal */}
      <ImagePuzzle isOpen={isOpen} onClose={handleClose} />
    </>
  );
}