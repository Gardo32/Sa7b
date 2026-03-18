'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useEffect } from 'react';

interface GiftBoxProps {
  isOpen?: boolean;
}

export default function GiftBox({ isOpen = false }: GiftBoxProps) {
  const [opened, setOpened] = useState(isOpen);

  useEffect(() => {
    setOpened(isOpen);
  }, [isOpen]);

  if (!opened) return null;

  return (
    <div className="flex h-64 w-64 items-center justify-center pointer-events-none">
      <DotLottieReact
        src="https://lottie.host/3575be5e-806a-48d9-be24-26cca1657908/atXoDkR6mF.lottie"
        loop={false}
        autoplay
      />
    </div>
  );
}
