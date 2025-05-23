
'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslationModal } from '@/components/lipiantar/TranslationModal';
import { getGurmukhiTranslationAction, type TranslationResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LanguagesIcon, Copy, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator as PageSeparator } from '@/components/ui/separator';
import { NotesWorkspace } from '@/components/lipiantar/NotesWorkspace';


export default function LipiantarPage() {
  const [romanPunjabi, setRomanPunjabi] = React.useState<string>('');
  const [gurmukhiPunjabi, setGurmukhiPunjabi] = React.useState<string>(''); // For the translation modal output
  const [mainNotesContent, setMainNotesContent] = React.useState<string>(''); // For the "Main Notes" textarea in translation section
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
    setGurmukhiPunjabi('');
    setIsModalOpen(true);

    const result: TranslationResult = await getGurmukhiTranslationAction(romanPunjabi);

    if (result.error) {
      toast({
        title: 'Translation Error',
        description: result.error,
        variant: 'destructive',
      });
      setGurmukhiPunjabi('');
    } else if (result.gurmukhiText) {
      setGurmukhiPunjabi(result.gurmukhiText);
    }
    setIsLoading(false);
  };

  const handleAcceptTranslation = () => {
    setMainNotesContent(gurmukhiPunjabi); // Populate Main Notes with Gurmukhi text
    setIsModalOpen(false);
    toast({
      title: 'Translation Accepted',
      description: 'The Gurmukhi text has been copied to the Main Notes area.',
    });
  };

  const handleCancelTranslation = () => {
    setIsModalOpen(false);
  };

  const handleCopyToTranslateInput = () => {
    setRomanPunjabi(mainNotesContent);
    toast({
      title: "Content Copied",
      description: "Main Notes content copied to Roman Punjabi input for re-translation."
    })
  }

  // Basic check if text contains Gurmukhi characters
  const containsGurmukhi = (text: string) => /[\u0A00-\u0A7F]/.test(text);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
      <header className="mb-8 mt-8 text-center w-full max-w-4xl">
        <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
          <LanguagesIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">Lipiantar AI</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Translate Roman Punjabi to formal Gurmukhi Punjabi with AI.
        </p>
      </header>

      {/* New Notes Workspace Section - Moved to the top */}
      <NotesWorkspace />

      {/* Separator between Notes Workspace and Lipiantar AI */}
      <PageSeparator className="my-10 md:my-16 w-full max-w-4xl border-dashed border-border/50" />

      {/* AI Translation Tool Section */}
      <main className="w-full max-w-4xl p-6 md:p-10 bg-card shadow-xl rounded-xl">
        <header className="mb-8 text-center">
          {/* <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
            <LanguagesIcon className="h-10 w-10 text-primary" />
          </div> */}
          <h2 className="text-3xl font-bold text-primary">AI Translation Tool</h2>
          <p className="mt-2 text-md text-muted-foreground">
            Use AI to translate your Roman Punjabi text.
          </p>
        </header>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-6 items-start">
          {/* Left Column: Roman Punjabi Input */}
          <Card className="flex flex-col shadow-md rounded-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl">Rough Notes (Roman Punjabi)</CardTitle>
              <CardDescription>Enter your Roman Punjabi text here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <Textarea
                id="roman-punjabi-input"
                placeholder="Example: Ho jadd vi bole janta munh nu laave tala..."
                value={romanPunjabi}
                onChange={(e) => setRomanPunjabi(e.target.value)}
                className="w-full min-h-[200px] md:min-h-[250px] text-base rounded-md border-2 focus:border-primary focus:ring-primary"
                aria-label="Roman Punjabi Input Area"
              />
            </CardContent>
          </Card>

          {/* Middle Column: Translate Button (Desktop) / Stacked Controls (Mobile) */}
          <div className="flex flex-col items-center justify-center gap-4 my-auto">
             <PageSeparator orientation="vertical" className="hidden md:block mx-auto h-1/3 min-h-[50px]" />
            <Button
              onClick={handleTranslate}
              disabled={isLoading}
              className="w-full md:w-auto text-md py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-md transition-transform hover:scale-105"
              aria-label="Translate to Gurmukhi"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-0 md:mr-2 h-5 w-5" />
              )}
              <span className="hidden md:inline">Translate</span>
            </Button>
            <PageSeparator orientation="vertical" className="hidden md:block mx-auto h-1/3 min-h-[50px]" />
          </div>

          {/* Right Column: Main Notes (Gurmukhi Output) */}
          <Card className="flex flex-col shadow-md rounded-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl">Main Notes (Gurmukhi)</CardTitle>
              <CardDescription>Translated Gurmukhi text will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <Textarea
                id="gurmukhi-output-area"
                placeholder="Gurmukhi translation..."
                value={mainNotesContent}
                onChange={(e) => setMainNotesContent(e.target.value)}
                readOnly={!isModalOpen && !gurmukhiPunjabi} // Mostly read-only, editable via modal acceptance
                className={`w-full min-h-[200px] md:min-h-[250px] text-base rounded-md border-2 focus:border-accent focus:ring-accent ${containsGurmukhi(mainNotesContent) ? 'font-["Noto_Sans_Gurmukhi"]' : ''}`}
                lang={containsGurmukhi(mainNotesContent) ? "pa" : "en"}
                aria-label="Gurmukhi Output Area"
              />
            </CardContent>
             <div className="p-2 flex justify-end">
                <Button
                    onClick={handleCopyToTranslateInput}
                    variant="ghost"
                    size="sm"
                    title="Copy to Rough Notes for re-translation"
                    disabled={!mainNotesContent.trim()}
                    className="text-xs"
                >
                    <Copy className="mr-1 h-3 w-3" /> Re-translate
                </Button>
            </div>
          </Card>
        </div>
      </main>

      <TranslationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        originalText={romanPunjabi}
        translatedText={gurmukhiPunjabi}
        onAccept={handleAcceptTranslation}
        onCancel={handleCancelTranslation}
        isLoading={isLoading && isModalOpen}
      />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lipiantar. Crafted with care.</p>
      </footer>
    </div>
  );
}
