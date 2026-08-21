import React, { useState } from 'react';
import { Code2, X, Sparkles, Terminal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { parseSourceCode } from '../../services/astParser';
import { GeminiService } from '../../services/geminiClient';

export const CodeInputModal: React.FC = () => {
  const { 
    isCodeModalOpen, 
    setCodeModalOpen, 
    apiKey, 
    setGraphData, 
    setActiveCode,
    setLoading,
    setError 
  } = useAppStore();

  const [fileName, setFileName] = useState('customService.ts');
  const [codeSnippet, setCodeSnippet] = useState(`// Paste your source code here
export async function handlePaymentRequest(req, res) {
  const { amount, currency, userId } = req.body;
  
  const user = await db.users.findById(userId);
  if (!user) throw new Error("User not found");

  const transaction = await paymentGateway.charge({
    amount,
    currency,
    customerId: user.stripeCustomerId
  });

  await db.transactions.create({
    userId,
    transactionId: transaction.id,
    amount,
    status: 'SUCCESS'
  });

  return res.json({ status: 'ok', transactionId: transaction.id });
}`);

  if (!isCodeModalOpen) return null;

  const handleParse = async () => {
    setLoading(true);
    setError(null);

    try {
      if (apiKey) {
        // Run Live Gemini 2.5 Flash API Graph Extraction
        const gemini = new GeminiService(apiKey);
        const graph = await gemini.generateCodebaseGraph(codeSnippet, fileName);
        setGraphData(graph);
        setActiveCode(fileName, codeSnippet);
      } else {
        // Fallback to client-side AST Structural Parser
        const parsed = parseSourceCode(codeSnippet, fileName);
        setGraphData({
          repositoryName: `Custom AST: ${fileName}`,
          overview: parsed.overview,
          nodes: parsed.nodes,
          edges: parsed.edges
        });
        setActiveCode(fileName, codeSnippet);
      }
      setCodeModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to parse code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200
    }}>
      <div className="glass-panel" style={{
        width: '560px',
        padding: '24px',
        background: '#121824',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={18} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: '16px', color: '#fff' }}>Parse Custom Source Code</h3>
          </div>
          <button
            onClick={() => setCodeModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(10, 13, 20, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Source Code (JS/TS/Python)
          </label>
          <textarea
            rows={10}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(10, 13, 20, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#38bdf8',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {apiKey ? '⚡ Powered by Gemini 2.5 Flash API' : '⚙️ Client-side AST Parser Fallback'}
          </span>

          <button
            onClick={handleParse}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} /> Parse & Build Graph
          </button>
        </div>
      </div>
    </div>
  );
};
