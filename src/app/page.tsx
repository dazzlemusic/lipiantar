'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslationModal } from '@/components/lipiantar/TranslationModal';
import { getGurmukhiTranslationAction, type TranslationResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LanguagesIcon } from 'lucide-react';

export default function LipiantarPage() {
  const [romanPunjabi, setRomanPunjabi] = React.useState<string>('');
  const [gurmukhiPunjabi, setGurmukhiPunjabi] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!romanPunjabi.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some Roman Punjabi text to translate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Open modal immediately to show loading state inside if translation takes time
    setGurmukhiPunjabi(''); // Clear previous translation
    setIsModalOpen(true); 

    const result: TranslationResult = await getGurmukhiTranslationAction(romanPunjabi);
    
    if (result.error) {
      toast({
        title: 'Translation Error',
        description: result.error,
        variant: 'destructive',
      });
      // Keep modal open for error or close it? For now, let's keep it open so user sees the error or no translation.
      // If we close, then set isModalOpen(false) here.
      // Or, better, modal handles its own loading and error state based on props.
      // Simplified: modal shows loading if isLoading prop is true. If error, translatedText is empty.
      setGurmukhiPunjabi(''); // Ensure no stale translation is shown
    } else if (result.gurmukhiText) {
      setGurmukhiPunjabi(result.gurmukhiText);
    }
    setIsLoading(false); // Loading finished, modal will update
  };

  const handleAcceptTranslation = () => {
    setRomanPunjabi(gurmukhiPunjabi); // Replace input with Gurmukhi text
    setIsModalOpen(false);
    toast({
      title: 'Translation Accepted',
      description: 'The Gurmukhi text has been copied to the input area.',
    });
  };

  const handleCancelTranslation = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background">
      <main className="w-full max-w-2xl p-6 md:p-10 bg-card shadow-xl rounded-xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
            <LanguagesIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Lipiantar</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Translate Roman Punjabi to formal Gurmukhi Punjabi with AI.
          </p>
        </header>

        <div className="space-y-6">
          <div>
            <label htmlFor="roman-punjabi-input" className="block text-sm font-medium text-foreground mb-1">
              Enter Roman Punjabi Text
            </label>
            <Textarea
              id="roman-punjabi-input"
              placeholder="Example: Type in Roman Punjabi text here ..."
              value={romanPunjabi}
              onChange={(e) => setRomanPunjabi(e.target.value)}
              rows={8}
              className="resize-none text-base border-2 focus:border-primary focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Your text will be translated into Gurmukhi script. Line breaks will be preserved.
            </p>
          </div>

          <Button
            onClick={handleTranslate}
            disabled={isLoading}
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Translate to Gurmukhi"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <LanguagesIcon className="mr-2 h-6 w-6" />
            )}
            Translate to Gurmukhi
          </Button>
        </div>
      </main>

      <TranslationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        originalText={romanPunjabi}
        translatedText={gurmukhiPunjabi}
        onAccept={handleAcceptTranslation}
        onCancel={handleCancelTranslation}
        isLoading={isLoading && isModalOpen} // Modal shows its own loader only if it's open and global loading is true
      />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lipiantar. Powered by AI.</p>
      </footer>
    </div>
  );
}
