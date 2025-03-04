
interface AnalysisResult {
  status: 'safe' | 'warning' | 'error';
  message: string;
  details?: string[];
}

// דפוסים בעייתיים לזיהוי בקוד
const PATTERNS = {
  eval: {
    regex: /eval\s*\(/g,
    message: 'שימוש ב-eval() עלול להוות סיכון אבטחה',
    severity: 'error',
  },
  innerHtml: {
    regex: /\.innerHTML\s*=|\.innerHtml\s*=/gi,
    message: 'שימוש ב-innerHTML עלול לגרום להתקפת XSS',
    severity: 'warning',
  },
  sqlInjection: {
    regex: /SELECT\s+.*FROM\s+.*WHERE.*=\s*['"].*\$\{.*\}/gi,
    message: 'הזרקת SQL אפשרית זוהתה',
    severity: 'error',
  },
  consoleLog: {
    regex: /console\.log\s*\(/g,
    message: 'console.log עדיין בקוד - זה לא לייצור',
    severity: 'warning',
  },
  document: {
    regex: /document\.write\s*\(/g,
    message: 'שימוש ב-document.write() מהווה סיכון אבטחה',
    severity: 'error',
  },
  noTypeAnnotations: {
    regex: /function\s+\w+\s*\(\s*(\w+)(\s*,\s*\w+)*\s*\)/g,
    message: 'פונקציות ללא הגדרות סוג מקשות על תחזוקה',
    severity: 'warning',
  },
  hardcodedSecrets: {
    regex: /const\s+(api[Kk]ey|secret|password|auth[Tt]oken)\s*=\s*['"][^'"]+['"]/g,
    message: 'פרטי אבטחה מקודדים קשיח בקוד',
    severity: 'error',
  },
};

// ניתוח בסיסי של קוד - בפרויקט אמיתי זה יכול להיות הרבה יותר מתוחכם
export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  // אנו יוצרים השהיה מלאכותית כדי לדמות תהליך ניתוח
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!code || code.trim() === '') {
    return {
      status: 'error',
      message: 'לא הוזן קוד לניתוח',
    };
  }
  
  const issues: { message: string; severity: string }[] = [];
  
  // בדיקת דפוסים בעייתיים
  Object.values(PATTERNS).forEach(pattern => {
    const matches = code.match(pattern.regex);
    if (matches && matches.length > 0) {
      issues.push({
        message: pattern.message,
        severity: pattern.severity,
      });
    }
  });
  
  // ניתוח נוסף של מורכבות הקוד
  const lines = code.split('\n');
  const longLines = lines.filter(line => line.length > 100).length;
  const totalLines = lines.length;
  
  if (longLines > 0) {
    issues.push({
      message: `נמצאו ${longLines} שורות ארוכות מדי (מעל 100 תווים)`,
      severity: 'warning',
    });
  }
  
  // בדיקת סוגריים וטאבים לא עקביים
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    issues.push({
      message: `חוסר התאמה בסוגריים מסולסלים: ${openBraces} פתוחים לעומת ${closeBraces} סגורים`,
      severity: 'error',
    });
  }
  
  // יצירת התוצאה הסופית
  if (issues.length === 0) {
    return {
      status: 'safe',
      message: 'לא נמצאו בעיות בקוד',
      details: ['הקוד נראה נקי מבעיות נפוצות', `מספר שורות הקוד: ${totalLines}`],
    };
  }
  
  const errorCount = issues.filter(issue => issue.severity === 'error').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;
  
  const status = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'safe';
  const details = issues.map(issue => issue.message);
  
  return {
    status,
    message: `נמצאו ${errorCount} שגיאות ו-${warningCount} אזהרות`,
    details,
  };
};
