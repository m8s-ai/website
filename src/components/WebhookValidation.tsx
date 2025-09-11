import React, { useEffect, useState } from 'react';
import { validateN8nConfiguration } from '@/utils/n8nWebhooks';

export const WebhookValidation: React.FC = () => {
  const [config, setConfig] = useState<{ businessQA: boolean; projectData: boolean; summarizer: boolean } | null>(null);

  useEffect(() => {
    const validationResult = validateN8nConfiguration();
    setConfig(validationResult);
    
    console.log('🔧 N8N Webhook Configuration Status:', {
      businessQA: validationResult.businessQA ? '✅ Configured' : '❌ Missing',
      projectData: validationResult.projectData ? '✅ Configured' : '❌ Missing', 
      summarizer: validationResult.summarizer ? '✅ Configured' : '❌ Missing',
      businessQAUrl: import.meta.env.VITE_N8N_BUSINESS_QA_WEBHOOK_URL || 'Not set'
    });
  }, []);

  if (!config) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 rounded-lg p-3 text-xs font-mono text-green-400 z-50">
      <div className="text-white mb-2">Webhook Status:</div>
      <div>QA Bot: {config.businessQA ? '✅' : '❌'}</div>
      <div>Project: {config.projectData ? '✅' : '❌'}</div>
      <div>Summary: {config.summarizer ? '✅' : '❌'}</div>
    </div>
  );
};