
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/Header';
import { analyzeCode } from '@/utils/codeAnalysis';

const CodeGuard = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    status: 'safe' | 'warning' | 'error';
    message: string;
    details?: string[];
  }>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(code);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysis({
        status: 'error',
        message: 'שגיאה בניתוח הקוד',
        details: ['לא ניתן היה לנתח את הקוד שהוזן.']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setCode('');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            חזרה
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            CodeGuard
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-6 max-w-2xl">
          הכנס קוד JavaScript או TypeScript לבדיקה וניתוח. המערכת תסרוק את הקוד לזיהוי בעיות אבטחה, שגיאות נפוצות או דפוסי קוד חשודים.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-muted-foreground" />
                הכנס קוד לניתוח
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                placeholder="// הכנס קוד JavaScript או TypeScript כאן..."
                className="h-full min-h-[300px] font-mono text-sm resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                dir="ltr"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={clearAnalysis}
                disabled={isAnalyzing || !code.trim()}
              >
                נקה
              </Button>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
              >
                {isAnalyzing ? 'מנתח...' : 'נתח קוד'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                תוצאות הניתוח
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {!analysis && !isAnalyzing && (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  הכנס קוד ולחץ על "נתח קוד" כדי לראות תוצאות
                </div>
              )}
              
              {isAnalyzing && (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-center">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>מנתח את הקוד...</p>
                  </div>
                </div>
              )}
              
              {analysis && !isAnalyzing && (
                <div className="space-y-4">
                  <Alert variant={
                    analysis.status === 'safe' ? 'default' : 
                    analysis.status === 'warning' ? 'warning' : 'destructive'
                  }>
                    {analysis.status === 'safe' && <CheckCircle className="h-4 w-4" />}
                    {analysis.status === 'warning' && <AlertCircle className="h-4 w-4" />}
                    {analysis.status === 'error' && <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>
                      {analysis.status === 'safe' && 'קוד בטוח'}
                      {analysis.status === 'warning' && 'אזהרה'}
                      {analysis.status === 'error' && 'בעיה נמצאה'}
                    </AlertTitle>
                    <AlertDescription>
                      {analysis.message}
                    </AlertDescription>
                  </Alert>
                  
                  {analysis.details && analysis.details.length > 0 && (
                    <div className="bg-muted p-4 rounded-md space-y-2 max-h-[300px] overflow-y-auto">
                      <h3 className="font-medium">פרטים:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.details.map((detail, index) => (
                          <li key={index} className="text-sm">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CodeGuard;
