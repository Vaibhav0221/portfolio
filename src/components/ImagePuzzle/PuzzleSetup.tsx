import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Icon } from '../ui';
import { PuzzleImage, GRID_SIZES, GridSize, isValidImageFile, createImageObjectUrl, revokeImageObjectUrl } from './puzzleUtils';
import './ImagePuzzle.css';

interface PuzzleSetupProps {
  onImageSelect: (image: PuzzleImage | { id: string; name: string; src: string; isUpload: boolean }) => void;
  onGridSelect: (grid: GridSize) => void;
  onStartGame: () => void;
  selectedImage: PuzzleImage | { id: string; name: string; src: string; isUpload: boolean } | null;
  selectedGrid: GridSize | null;
  step: 'image' | 'grid';
  onStepChange: (step: 'image' | 'grid') => void;
  onBack: () => void;
}

export function PuzzleSetup({
  onImageSelect,
  onGridSelect,
  onStartGame,
  selectedImage,
  selectedGrid,
  step,
  onStepChange,
  onBack,
}: PuzzleSetupProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImageObjectUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback((file: File) => {
    if (!isValidImageFile(file)) {
      setUploadError('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    setUploadError(null);
    setUploadedFile(file);

    if (previewUrl) {
      revokeImageObjectUrl(previewUrl);
    }

    const url = createImageObjectUrl(file);
    setPreviewUrl(url);

    // Create a temporary image object for preview
    const tempImage = {
      id: `upload-${Date.now()}`,
      name: file.name,
      src: url,
      isUpload: true,
    };

    onImageSelect(tempImage);
  }, [onImageSelect, previewUrl]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleGalleryImageClick = useCallback(
    (image: PuzzleImage) => {
      onImageSelect(image);
    },
    [onImageSelect]
  );

  const handleGridClick = useCallback(
    (grid: GridSize) => {
      onGridSelect(grid);
    },
    [onGridSelect]
  );

  const handleContinue = useCallback(() => {
    if (step === 'image' && selectedImage) {
      onStepChange('grid');
    } else if (step === 'grid' && selectedGrid) {
      onStartGame();
    }
  }, [step, selectedImage, selectedGrid, onStepChange, onStartGame]);

  const handleRemoveUpload = useCallback(() => {
    setUploadedFile(null);
    if (previewUrl) {
      revokeImageObjectUrl(previewUrl);
      setPreviewUrl(null);
    }
    onImageSelect(null as any);
  }, [previewUrl, onImageSelect]);

  // Predefined images
  const PUZZLE_IMAGES: PuzzleImage[] = [
    { id: 'hsa', name: 'HSA Project', src: '/project_images/HSA.png' },
    { id: 'quizgen', name: 'Quizgen', src: '/project_images/Quizgen.png' },
    { id: 'bdm', name: 'BDM', src: '/project_images/BDM.png' },
    { id: 'engage2value', name: 'Engage2Value', src: '/project_images/Engage2Value.png' },
    { id: 'gradebook', name: 'Gradebook', src: '/project_images/Gradebook.png' },
    { id: 'har', name: 'HAR', src: '/project_images/HAR.png' },
    { id: 'circuit', name: 'Circuit Diagram', src: '/project_images/Circuit_Diagram.png' },
    { id: 'bearing', name: 'Bearing', src: '/project_images/Bearing.png' },
    { id: 'llm', name: 'LLM Backend', src: '/project_images/LLM_Backend.png' },
    { id: 'civichron', name: 'CiviChron', src: '/project_images/CiviChron.png' },
  ];

  return (
    <div className="image-puzzle__setup" role="dialog" aria-modal="true" aria-labelledby="puzzle-setup-title">
      <div className="image-puzzle__setup-header">
        <h2 id="puzzle-setup-title" className="image-puzzle__setup-title">
          {step === 'image' ? 'Select Image' : 'Choose Grid Size'}
        </h2>
        <p className="image-puzzle__setup-subtitle">
          {step === 'image'
            ? 'Choose an image from the gallery or upload your own'
            : `Selected: ${selectedImage?.name || 'Image'} • Pick a puzzle size`}
        </p>
      </div>

      {step === 'image' && (
        <div className="image-puzzle__image-selection">
          {/* Upload area */}
          <div
            className={`image-puzzle__upload-area ${isDragOver ? 'image-puzzle__upload-area--dragover' : ''} ${
              uploadedFile ? 'image-puzzle__upload-area--has-file' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            aria-label="Upload image area"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="image-puzzle__file-input"
              aria-hidden="true"
            />

            {uploadedFile && previewUrl ? (
              <div className="image-puzzle__upload-preview">
                <img src={previewUrl} alt={uploadedFile.name} className="image-puzzle__upload-image" />
                <div className="image-puzzle__upload-info">
                  <span className="image-puzzle__upload-name">{uploadedFile.name}</span>
                  <button
                    className="image-puzzle__upload-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUpload();
                    }}
                    aria-label="Remove uploaded image"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-puzzle__upload-placeholder">
                <Icon name="download" size={48} className="image-puzzle__upload-icon" aria-hidden="true" />
                <p className="image-puzzle__upload-text">Drag & drop or click to upload</p>
                <p className="image-puzzle__upload-hint">JPG, PNG, WebP • Max 10MB</p>
              </div>
            )}

            {uploadError && <p className="image-puzzle__upload-error">{uploadError}</p>}
          </div>

          {/* Divider */}
          <div className="image-puzzle__divider">
            <span>or choose from gallery</span>
          </div>

          {/* Gallery */}
          <div className="image-puzzle__gallery" role="list" aria-label="Image gallery">
            {PUZZLE_IMAGES.map((image) => (
              <button
                key={image.id}
                className={`image-puzzle__gallery-item ${selectedImage?.id === image.id ? 'image-puzzle__gallery-item--selected' : ''}`}
                onClick={() => handleGalleryImageClick(image)}
                role="listitem"
                aria-pressed={selectedImage?.id === image.id}
                type="button"
              >
                <img src={image.src} alt={image.name} className="image-puzzle__gallery-image" loading="lazy" />
                <span className="image-puzzle__gallery-name">{image.name}</span>
                {selectedImage?.id === image.id && (
                  <span className="image-puzzle__gallery-check" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Selected image preview */}
          {selectedImage && (
            <div className="image-puzzle__selected-preview">
              <p className="image-puzzle__selected-label">Selected Image</p>
              <div className="image-puzzle__selected-image-wrapper">
                <img src={selectedImage.src} alt={selectedImage.name} className="image-puzzle__selected-image" />
              </div>
              <p className="image-puzzle__selected-name">{selectedImage.name}</p>
            </div>
          )}

          {/* Continue button */}
          <div className="image-puzzle__setup-actions">
            <Button
              variant="ghost"
              onClick={onBack}
              leftIcon={<Icon name="arrowLeft" size={16} />}
              type="button"
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!selectedImage}
              rightIcon={<Icon name="arrowRight" size={18} />}
              className="image-puzzle__continue-btn"
              type="button"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 'grid' && (
        <div className="image-puzzle__grid-selection">
          <div className="image-puzzle__grid-options" role="list" aria-label="Grid size options">
            {GRID_SIZES.map((grid) => (
              <button
                key={`${grid.rows}x${grid.cols}`}
                className={`image-puzzle__grid-option ${selectedGrid?.rows === grid.rows && selectedGrid?.cols === grid.cols ? 'image-puzzle__grid-option--selected' : ''}`}
                onClick={() => handleGridClick(grid)}
                role="listitem"
                aria-pressed={selectedGrid?.rows === grid.rows && selectedGrid?.cols === grid.cols}
                type="button"
              >
                <span className="image-puzzle__grid-label">{grid.label}</span>
                <span className="image-puzzle__grid-difficulty">{grid.difficulty}</span>
                {selectedGrid?.rows === grid.rows && selectedGrid?.cols === grid.cols && (
                  <span className="image-puzzle__grid-check" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Selected grid preview */}
          {selectedGrid && (
            <div className="image-puzzle__selected-grid-preview">
              <p className="image-puzzle__selected-label">Selected Grid</p>
              <div className="image-puzzle__grid-preview" style={{ gridTemplateColumns: `repeat(${selectedGrid.cols}, 1fr)` }}>
                {[...Array(selectedGrid.rows * selectedGrid.cols)].map((_, i) => (
                  <div key={i} className="image-puzzle__grid-preview-tile" />
                ))}
              </div>
              <p className="image-puzzle__selected-name">{selectedGrid.label} • {selectedGrid.difficulty}</p>
            </div>
          )}

          {/* Continue button */}
          <div className="image-puzzle__setup-actions">
            <Button
              variant="ghost"
              onClick={() => onStepChange('image')}
              leftIcon={<Icon name="arrowLeft" size={16} />}
              type="button"
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!selectedGrid}
              rightIcon={<Icon name="play" size={18} />}
              className="image-puzzle__continue-btn"
              type="button"
            >
              Start Puzzle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}