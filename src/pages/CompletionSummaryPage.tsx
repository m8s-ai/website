import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioManager } from '@/components/AudioManager';

interface CompletionData {
  responses: Record<string, string>;
  waveData: {
    wave1: Record<string, string>;
    wave2: Record<string, string>;
    wave3: Record<string, string>;
    wave4: Record<string, string>;
  };
}

export const CompletionSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  
  // Get completion data from navigation state
  const completionData = location.state as CompletionData;
  const userEmail = completionData?.responses?.email || 'your email';

  // Play completion sound when page loads
  useEffect(() => {
    audio.playCompletionSound();
  }, [audio]);

  // If no completion data, redirect to home
  useEffect(() => {
    if (!completionData) {
      navigate('/');
    }
  }, [completionData, navigate]);

  const handleCloseTerminal = async () => {
    await audio.playSelectionSound();
    navigate('/home');
  };

  const handleAbort = async () => {
    await audio.playSelectionSound();
    navigate('/home');
  };

  if (!completionData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 pointer-events-none" />
      
      {/* Terminal grid background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Abort button */}
      <button
        onClick={handleAbort}
        className="fixed bottom-4 left-4 z-50 bg-transparent border border-red-400/30 text-red-400/60 px-3 py-2 text-xs font-mono hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:bg-red-400/10"
        title="Abort and return to website"
      >
        ⏸ ABORT
      </button>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-8 text-center max-w-4xl mx-auto p-8" dir="ltr">
          {/* Success Header */}
          <div className="space-y-4">
            <div className="text-green-300 text-3xl font-mono" style={{
              textShadow: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6)'
            }}>
              🎉 PROJECT PACKAGE COMPLETE!
            </div>
            <div className="text-amber-300 text-lg" style={{
              textShadow: '0 0 10px rgba(252, 211, 77, 0.6)'
            }}>
              MISSION ACCOMPLISHED • PACKAGE DELIVERED
            </div>
          </div>

          {/* Project Summary Based on Responses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Overview */}
            <div className="bg-green-900/20 border border-green-400/30 p-6 rounded text-left">
              <div className="text-green-300 text-xl font-mono mb-4">
                📋 PROJECT OVERVIEW
              </div>
              <div className="space-y-3 text-amber-200">
                <div>
                  <strong className="text-green-300">Type:</strong> {completionData.responses.project_type || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Problem:</strong> {completionData.responses.main_problem || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Target Audience:</strong> {completionData.responses.target_audience || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Urgency Level:</strong> {completionData.responses.urgency || 'Not specified'}
                </div>
              </div>
            </div>

            {/* Technical Approach */}
            <div className="bg-blue-900/20 border border-blue-400/30 p-6 rounded text-left">
              <div className="text-blue-300 text-xl font-mono mb-4">
                ⚡ TECHNICAL APPROACH
              </div>
              <div className="space-y-3 text-amber-200">
                <div>
                  <strong className="text-blue-300">Platform:</strong> {completionData.responses.platform_priority || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">Data Storage:</strong> {completionData.responses.data_requirements || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">User Accounts:</strong> {completionData.responses.user_accounts || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">Offline Support:</strong> {completionData.responses.offline_capability || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Deliverables */}
          <div className="bg-amber-900/20 border border-amber-400/30 p-6 rounded">
            <div className="text-amber-300 text-xl font-mono mb-4">
              📦 GENERATED DELIVERABLES
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>Project Requirements Document (PRD)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>Technical Architecture Diagrams</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>User Experience Flow Charts</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>Working Prototype Mockups</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>Development Cost Estimates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <span>Launch Strategy Recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Strategy */}
          <div className="bg-purple-900/20 border border-purple-400/30 p-6 rounded">
            <div className="text-purple-300 text-xl font-mono mb-4">
              🚀 BUSINESS STRATEGY
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left text-amber-200">
              <div>
                <div><strong className="text-purple-300">Success Metric:</strong> {completionData.responses.success_metric || 'Not specified'}</div>
                <div className="mt-2"><strong className="text-purple-300">Timeline Driver:</strong> {completionData.responses.timeline_urgency || 'Not specified'}</div>
              </div>
              <div>
                <div><strong className="text-purple-300">Budget Range:</strong> {completionData.responses.budget_range || 'Not specified'}</div>
                <div className="mt-2"><strong className="text-purple-300">Main Concern:</strong> {completionData.responses.biggest_concern || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-gray-900/40 border border-gray-400/30 p-4 rounded">
            <div className="text-gray-300 text-lg font-mono mb-2">
              📧 DELIVERY CONFIRMATION
            </div>
            <div className="text-gray-400">
              Complete project package sent to: <strong className="text-green-300">{userEmail}</strong>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Expected delivery: Within 24 hours
            </div>
          </div>

          {/* Close Button */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleCloseTerminal}
              className="bg-transparent border-2 border-green-400 text-green-400 px-8 py-3 text-lg font-mono hover:bg-green-400 hover:text-black transition-colors duration-200"
              style={{
                textShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
              }}
            >
              CLOSE TERMINAL
            </button>
            
            <div className="text-gray-500 text-sm">
              Continue to our terminal website
            </div>
          </div>

          {/* Terminal-style footer */}
          <div className="text-green-400 text-xs font-mono opacity-60 border-t border-green-400/20 pt-4">
            m8s.ai • AI Project Validation System • Session Complete
          </div>
        </div>
      </div>
    </div>
  );
};