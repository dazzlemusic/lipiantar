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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
  const { toast } = useToast();

  const handleTxtExport = (text: string) => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lipiantar_export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: 'Note exported as .txt successfully!',
    });
  };

  const handlePdfExport = (text: string) => {
    if (!text.trim()) return;

    const doc = new jsPDF();
    
    // Set font that supports Gurmukhi. Noto Sans Gurmukhi is a good choice.
    // This assumes "Noto Sans Gurmukhi" is loaded via @font-face or <link> in HTML,
    // and jsPDF can access it. For truly robust cross-environment PDF generation 
    // with custom fonts, embedding the .ttf font file directly into jsPDF (e.g., via VFS)
    // is the most reliable method but beyond simple text code changes.
    // If Noto Sans Gurmukhi is not found by jsPDF, it might fallback to a default font,
    // which may not render Gurmukhi characters correctly.
    try {
      doc.setFont('Noto Sans Gurmukhi', 'normal');
    } catch (e) {
      console.warn("Noto Sans Gurmukhi font not found by jsPDF, falling back to default. For best results, embed the font.", e);
      // Fallback to a standard font if Noto Sans Gurmukhi is not available.
      // This will likely not render Gurmukhi correctly.
      doc.setFont('Helvetica', 'normal');
    }
    
    doc.setFontSize(12);
    
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - margin * 2;
    
    const lines = doc.splitTextToSize(text, maxLineWidth);
    
    let cursorY = margin;
    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight - margin) { // Approximate line height as 10
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 7; // Adjust line spacing (approx font size / 2 + buffer)
    });
    
    doc.save('lipiantar_export.pdf');
    toast({
      title: 'Export Successful',
      description: 'Note exported as .pdf successfully!',
    });
  };

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
                  {/* Gurmukhi text will be rendered here using Noto Sans Gurmukhi if available */}
                  {translatedText}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="mt-auto pt-4 border-t gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading || !translatedText.trim()}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTxtExport(translatedText)} disabled={!translatedText.trim()}>
                Download as .txt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePdfExport(translatedText)} disabled={!translatedText.trim()}>
                Download as .pdf
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            onClick={onAccept} 
            disabled={isLoading || !translatedText.trim()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Accept Translation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
