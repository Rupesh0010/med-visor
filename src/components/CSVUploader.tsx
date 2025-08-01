import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSVUploaderProps {
  onDataParsed: (data: any[], headers: string[]) => void;
  expectedHeaders?: string[];
  className?: string;
}

export function CSVUploader({ onDataParsed, expectedHeaders, className }: CSVUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setUploadStatus('error');
            toast({
              title: "CSV Parse Error",
              description: `Error parsing CSV: ${results.errors[0].message}`,
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }

          const data = results.data as any[];
          const headers = results.meta.fields || [];

          // Validate headers if expected headers are provided
          if (expectedHeaders && expectedHeaders.length > 0) {
            const missingHeaders = expectedHeaders.filter(
              header => !headers.includes(header)
            );
            
            if (missingHeaders.length > 0) {
              setUploadStatus('error');
              toast({
                title: "Missing Required Headers",
                description: `Missing columns: ${missingHeaders.join(', ')}`,
                variant: "destructive",
              });
              setIsProcessing(false);
              return;
            }
          }

          setUploadStatus('success');
          onDataParsed(data, headers);
          toast({
            title: "CSV Uploaded Successfully",
            description: `Processed ${data.length} rows with ${headers.length} columns`,
          });
          setIsProcessing(false);
        },
        error: (error) => {
          setUploadStatus('error');
          toast({
            title: "Upload Error",
            description: error.message,
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Upload Error",
        description: "Failed to process the CSV file",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }, [onDataParsed, expectedHeaders, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
    disabled: isProcessing
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-success" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-destructive" />;
      default:
        return <Upload className="w-8 h-8 text-primary" />;
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing CSV...";
    switch (uploadStatus) {
      case 'success':
        return "CSV uploaded successfully!";
      case 'error':
        return "Upload failed. Please try again.";
      default:
        return isDragActive ? "Drop the CSV file here..." : "Drag & drop a CSV file here, or click to select";
    }
  };

  return (
    <Card className={cn("shadow-card", className)}>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive ? "border-primary bg-primary-light" : "border-border hover:border-primary/50",
            isProcessing && "cursor-not-allowed opacity-50",
            uploadStatus === 'success' && "border-success bg-success-light",
            uploadStatus === 'error' && "border-destructive bg-destructive/10"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <div className="animate-spin">
                <FileSpreadsheet className="w-8 h-8 text-primary" />
              </div>
            ) : (
              getStatusIcon()
            )}
            
            <div>
              <p className="text-lg font-medium text-card-foreground mb-2">
                {getStatusText()}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports CSV files up to 10MB
              </p>
              {expectedHeaders && (
                <p className="text-xs text-muted-foreground mt-2">
                  Expected headers: {expectedHeaders.join(', ')}
                </p>
              )}
            </div>
            
            {!isProcessing && uploadStatus !== 'success' && (
              <Button variant="medical">
                Select CSV File
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}