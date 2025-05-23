'use client';

import type * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface TranslationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  translatedText: string;
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean; 
}

export function TranslationModal({
  isOpen,
  onOpenChange,
  originalText,
  translatedText,
  onAccept,
  onCancel,
  isLoading = false,
}: TranslationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Translation Suggestion</DialogTitle>
          <DialogDescription>
            Review the AI-generated Gurmukhi Punjabi translation.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Translating your text...</p>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto py-4 px-1">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Original (Roman Punjabi)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm font-sans p-2 border rounded-md min-h-[100px] bg-muted/20">
                  {originalText}
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Suggested (Gurmukhi Punjabi)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div lang="pa" className="whitespace-pre-wrap text-sm font-sans p-2 border rounded-md min-h-[100px] bg-muted/20">
                  {/* Gurmukhi text will be rendered here using appropriate system font */}
                  {translatedText}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={onAccept} 
            disabled={isLoading || !translatedText}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Accept Translation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
