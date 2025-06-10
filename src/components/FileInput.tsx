
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileInputProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  onFileSelect,
  accept = ".txt,.csv,.json",
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Upload File
      </Button>
    </div>
  );
};
