
'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function NotesWorkspace() {
  const [roughNotes, setRoughNotes] = React.useState('');
  const [mainNotes, setMainNotes] = React.useState('');
  const { toast } = useToast();

  const handleCopyToMain = () => {
    setMainNotes(roughNotes);
    toast({
      title: 'Content Copied',
      description: 'Rough notes have been copied to Main Notes.',
    });
  };

  const handleTxtExport = (text: string, filename: string) => {
    if (!text.trim()) {
      toast({
        title: 'Nothing to Export',
        description: 'Main Notes are empty.',
        variant: 'destructive',
      });
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: `Notes exported as ${filename} successfully!`,
    });
  };

  const handlePdfExport = (text: string, filename:string) => {
    if (!text.trim()) {
      toast({
        title: 'Nothing to Export',
        description: 'Main Notes are empty.',
        variant: 'destructive',
      });
      return;
    }

    const doc = new jsPDF();
    
    try {
      // Attempt to use Noto Sans Gurmukhi if available (e.g., loaded via CSS)
      doc.setFont('Noto Sans Gurmukhi', 'normal');
    } catch (e) {
      console.warn("Noto Sans Gurmukhi font not found by jsPDF for Notes Workspace, falling back to default. For best results with Gurmukhi, ensure the font is globally available or embed it.", e);
      doc.setFont('Helvetica', 'normal'); // Fallback
    }
    
    doc.setFontSize(12);
    
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15; // Increased margin
    const maxLineWidth = pageWidth - margin * 2;
    
    // Split text preserve newlines from textarea
    const textLines = text.split('\n');
    let linesForPdf: string[] = [];
    textLines.forEach(line => {
        const splitLines = doc.splitTextToSize(line, maxLineWidth);
        linesForPdf = linesForPdf.concat(splitLines);
    });
    
    let cursorY = margin;
    linesForPdf.forEach((line: string) => {
      if (cursorY + 10 > pageHeight - margin) { 
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 7; 
    });
    
    doc.save(filename);
    toast({
      title: 'Export Successful',
      description: `Notes exported as ${filename} successfully!`,
    });
  };

  // Basic check if text contains Gurmukhi characters
  const containsGurmukhi = (text: string) => /[\u0A00-\u0A7F]/.test(text);

  return (
    <section className="w-full max-w-5xl mx-auto mt-10 mb-8">
      <div className="bg-card shadow-xl rounded-xl">
        <Accordion type="single" collapsible defaultValue="notes-workspace-item" className="w-full">
          <AccordionItem value="notes-workspace-item" className="border-none">
            <AccordionTrigger className="hover:no-underline w-full text-left p-6 md:p-10 focus-visible:ring-inset data-[state=open]:pb-4 md:data-[state=open]:pb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-primary">Notes Workspace</h2>
                <p className="mt-1 text-md text-muted-foreground">
                  Manually organize your thoughts, drafts, and final notes.
                </p>
              </div>
              {/* Chevron icon is part of AccordionTrigger */}
            </AccordionTrigger>
            <AccordionContent className="px-6 md:px-10 pb-6 md:pb-10 pt-0">
              {/* This div provides the spacing equivalent to the old header's mb-8 */}
              <div className="mt-2 md:mt-4"> 
                <div className="flex flex-col md:flex-row gap-x-4 gap-y-6">
                  {/* Rough Notes Column */}
                  <div className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col shadow-lg rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground">Rough Notes</CardTitle>
                        <CardDescription>Jot down your initial ideas, lyrics, or Roman Punjabi text here.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex p-4">
                        <Textarea
                          id="rough-notes-workspace"
                          placeholder="Start typing your rough notes..."
                          value={roughNotes}
                          onChange={(e) => setRoughNotes(e.target.value)}
                          className="flex-1 text-base min-h-[250px] md:min-h-[350px] rounded-md border-2 focus:border-primary focus:ring-primary"
                          aria-label="Rough Notes Input Area"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Copy Button & Separator Area */}
                  <div className="flex md:flex-col items-center justify-center gap-4 my-4 md:my-0 md:mx-2 shrink-0">
                    <Separator orientation="vertical" className="hidden md:block mx-auto h-1/3 min-h-[50px]" />
                    <Button
                      onClick={handleCopyToMain}
                      variant="outline"
                      className="w-full md:w-auto md:mt-2 md:mb-2 group hover:bg-primary/10 transition-colors duration-150"
                      aria-label="Copy Rough Notes to Main Notes"
                      title="Copy Rough Notes to Main Notes"
                    >
                      <Copy className="h-5 w-5 text-primary group-hover:text-primary-foreground md:group-hover:text-primary" />
                      <span className="ml-2 md:hidden">Copy to Main</span>
                    </Button>
                    <Separator orientation="vertical" className="hidden md:block mx-auto h-1/3 min-h-[50px]" />
                  </div>

                  {/* Main Notes Column */}
                  <div className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col shadow-lg rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground">Main Notes</CardTitle>
                        <CardDescription>Refine your notes or write the final version here (Roman or Gurmukhi).</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex p-4">
                        <Textarea
                          id="main-notes-workspace"
                          placeholder="Your polished notes go here..."
                          value={mainNotes}
                          onChange={(e) => setMainNotes(e.target.value)}
                          className={`flex-1 text-base min-h-[250px] md:min-h-[350px] rounded-md border-2 focus:border-accent focus:ring-accent ${containsGurmukhi(mainNotes) ? 'font-["Noto_Sans_Gurmukhi"]' : ''}`}
                          lang={containsGurmukhi(mainNotes) ? "pa" : "en"}
                          aria-label="Main Notes Input Area"
                        />
                      </CardContent>
                      <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2 justify-end items-center">
                        <Button 
                          onClick={() => handleTxtExport(mainNotes, 'main_notes.txt')} 
                          disabled={!mainNotes.trim()} 
                          variant="ghost" 
                          size="sm"
                          className="w-full sm:w-auto hover:bg-secondary/80 transition-colors"
                        >
                          <FileText className="mr-2 h-4 w-4" /> Export .txt
                        </Button>
                        <Button 
                          onClick={() => handlePdfExport(mainNotes, 'main_notes.pdf')} 
                          disabled={!mainNotes.trim()} 
                          variant="ghost" 
                          size="sm"
                          className="w-full sm:w-auto hover:bg-secondary/80 transition-colors"
                        >
                          <Printer className="mr-2 h-4 w-4" /> Export .pdf
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
